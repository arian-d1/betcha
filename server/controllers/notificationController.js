const crypto = require("crypto");
const db = require("../db/queries");

const ALLOWED_STATUSES = new Set(["pending", "accepted", "declined"]);

function mapNotification(n) {
  return {
    id: n.id,
    from_uid: n.from_uid,
    to_uid: n.to_uid,
    contract_id: n.contract_id,
    amount: Number(n.amount ?? 0),
    status: n.status,
    created_at: n.created_at instanceof Date ? n.created_at.toISOString() : n.created_at,
  };
}

// GET /notifications?to_uid=...&from_uid=...&contract_id=...&status=...&limit=...
async function getNotifications(req, res) {
  try {
    const { to_uid, from_uid, contract_id, status, limit } = req.query;

    if (status && !ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({
        success: false,
        error: `status must be one of: ${Array.from(ALLOWED_STATUSES).join(", ")}`,
      });
    }

    const data = await db.listNotifications({
      to_uid: to_uid || null,
      from_uid: from_uid || null,
      contract_id: contract_id || null,
      status: status || null,
      limit,
    });

    return res.json({
      success: true,
      data: data.map(mapNotification),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch notifications",
    });
  }
}

// PUT /notification
// body: { from_uid, to_uid, contract_id, amount, status? }
async function createNotification(req, res) {
  try {
    const { from_uid, to_uid, contract_id, amount, status } = req.body;

    if (!from_uid || !to_uid || !contract_id) {
      return res.status(400).json({
        success: false,
        error: "from_uid, to_uid, and contract_id are required",
      });
    }

    const amountNum = Number(amount);
    if (amount == null || Number.isNaN(amountNum) || amountNum < 0) {
      return res.status(400).json({
        success: false,
        error: "amount is required (number >= 0)",
      });
    }

    const nextStatus = status ?? "pending";
    if (!ALLOWED_STATUSES.has(nextStatus)) {
      return res.status(400).json({
        success: false,
        error: `status must be one of: ${Array.from(ALLOWED_STATUSES).join(", ")}`,
      });
    }

    const notification = {
      id: crypto.randomUUID(),
      from_uid,
      to_uid,
      contract_id,
      amount: amountNum,
      status: nextStatus,
      created_at: new Date(),
    };

    await db.createNotification(notification);

    return res.status(201).json({
      success: true,
      message: "Notification created",
      data: mapNotification(notification),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to create notification",
    });
  }
}

// PATCH /notification/:notificationId
// body: { status }
async function patchNotificationStatus(req, res) {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;
    console.log("HERE" + notificationId);

    if (!notificationId) {
      return res.status(400).json({ success: false, error: "Missing notificationId" });
    }
    if (!status || typeof status !== "string") {
      return res.status(400).json({ success: false, error: "status is required (string)" });
    }
    if (!ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({
        success: false,
        error: `status must be one of: ${Array.from(ALLOWED_STATUSES).join(", ")}`,
      });
    }

    // If accepting, apply negotiated bid settlement before marking accepted
    if (status === "accepted") {
      const notification = await db.getNotification(notificationId);
      if (!notification) {
        return res.status(404).json({ success: false, error: "Notification not found" });
      }
      if (notification.status === "accepted") {
        return res.status(409).json({ success: false, error: "Notification already accepted" });
      }

      const contract = await db.getContract(notification.contract_id);
      if (!contract) {
        return res.status(404).json({ success: false, error: "Contract not found" });
      }

      // This acceptance flow is for "negotiated bid on an OPEN contract":
      // - maker already escrowed old amount at creation
      // - proposer has NOT escrowed anything when sending the notification
      if (contract.status !== "open") {
        return res.status(409).json({
          success: false,
          error: "Negotiated bid can only be accepted for open contracts",
        });
      }

      const proposerId = notification.from_uid; // sender proposed the new amount
      const makerId = contract.maker;
      const acceptorId = notification.to_uid; // receiver accepting (should be maker)

      if (!makerId) {
        return res.status(409).json({ success: false, error: "Contract maker missing" });
      }
      if (acceptorId !== makerId) {
        return res.status(403).json({
          success: false,
          error: "Only the contract maker can accept this negotiated bid",
        });
      }
      if (proposerId === makerId) {
        return res.status(400).json({
          success: false,
          error: "Invalid negotiated bid: proposer cannot be the contract maker",
        });
      }

      const oldAmount = Number(contract.amount ?? 0);
      const newAmount = Number(notification.amount);

      if (Number.isNaN(oldAmount) || oldAmount <= 0) {
        return res.status(409).json({ success: false, error: "Contract amount is invalid" });
      }
      if (Number.isNaN(newAmount) || newAmount <= 0) {
        return res.status(400).json({
          success: false,
          error: "Notification amount must be a number > 0",
        });
      }

      const diff = newAmount - oldAmount;

      const [proposer, maker] = await Promise.all([
        db.getUser(proposerId),
        db.getUser(makerId),
      ]);

      if (!proposer) {
        return res.status(404).json({ success: false, error: "Proposer user not found" });
      }
      if (!maker) {
        return res.status(404).json({ success: false, error: "Maker user not found" });
      }

      const proposerBal = Number(proposer.balance ?? 0);
      const makerBal = Number(maker.balance ?? 0);

      // Proposer must fund the FULL new wager now (they were NOT charged on notification send)
      if (proposerBal < newAmount) {
        return res.status(400).json({
          success: false,
          error: "Proposer has insufficient balance for the wager",
        });
      }

      // Maker already escrowed oldAmount; they only need to cover the increase (diff) if diff > 0
      if (diff > 0 && makerBal < diff) {
        return res.status(400).json({
          success: false,
          error: "Maker has insufficient balance to increase the wager",
        });
      }

      const nextProposerBal = proposerBal - newAmount;
      const nextMakerBal = makerBal - diff; // diff<0 => refund (subtracting negative adds)

      // Apply updates (best-effort ordering: funds + contract + notification)
      await Promise.all([
        db.updateUser(proposerId, { balance: nextProposerBal }),
        db.updateUser(makerId, { balance: nextMakerBal }),
        db.updateContract(contract.id, { amount: newAmount, status: "active", taker: proposerId }),
      ]);

      const result = await db.updateNotificationStatus(notificationId, "accepted");
      const updated = result?.value;

      return res.json({
        success: true,
        message: "Negotiated bid accepted; contract activated",
        data: mapNotification(updated ?? { ...notification, status: "accepted" }),
      });
    }

    // Non-accept case: just update notification status
    const result = await db.updateNotificationStatus(notificationId, status);
    const updated = result?.value || result;

    if (!updated || !updated.id) {
      updated = await db.getNotification(notificationId);
    }
    
    if (!updated) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }

    return res.json({
      success: true,
      message: "Notification status updated",
      data: mapNotification(updated),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to update notification status",
    });
  }
}

// GET /api/notifications/:notificationId
async function getNotificationById(req, res) {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({ success: false, error: "Missing notificationId" });
    }

    const notification = await db.getNotification(notificationId);

    if (!notification) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }

    return res.json({
      success: true,
      data: mapNotification(notification),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch notification",
    });
  }
}

module.exports = {
  getNotifications,
  createNotification,
  patchNotificationStatus,
  getNotificationById
};