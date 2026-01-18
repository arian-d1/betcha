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

// GET /api/notifications?to_uid=...&from_uid=...&contract_id=...&status=...&limit=...
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

// PUT /api/notifications
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

// PATCH /api/notifications/:notificationId
// body: { status }
async function patchNotificationStatus(req, res) {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;

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

      // This logic assumes both parties already escrowed the "old" amount (typical for active contracts)
      if (contract.status !== "active") {
        return res.status(409).json({
          success: false,
          error: "Negotiated bid can only be accepted for active contracts",
        });
      }

      const oldAmount = Number(contract.amount ?? 0);
      const newAmount = Number(notification.amount);

      if (Number.isNaN(newAmount) || newAmount <= 0) {
        return res.status(400).json({ success: false, error: "Notification amount must be a number > 0" });
      }

      const diff = newAmount - oldAmount;

      // Only do balance changes / contract update if it actually changes the wager
      if (diff !== 0) {
        const proposerId = notification.from_uid; // sender proposed the new amount
        const acceptorId = notification.to_uid;   // receiver is accepting

        const [proposer, acceptor] = await Promise.all([
          db.getUser(proposerId),
          db.getUser(acceptorId),
        ]);

        if (!proposer) return res.status(404).json({ success: false, error: "Proposer user not found" });
        if (!acceptor) return res.status(404).json({ success: false, error: "Acceptor user not found" });

        const proposerBal = Number(proposer.balance ?? 0);
        const acceptorBal = Number(acceptor.balance ?? 0);

        // If increasing wager, both need to contribute the additional diff
        if (diff > 0) {
          if (proposerBal < diff) {
            return res.status(400).json({
              success: false,
              error: "Proposer has insufficient balance for the increased wager",
            });
          }
          if (acceptorBal < diff) {
            return res.status(400).json({
              success: false,
              error: "Acceptor has insufficient balance for the increased wager",
            });
          }
        }

        const nextProposerBal = proposerBal - diff; // diff<0 => refunds (minus negative)
        const nextAcceptorBal = acceptorBal - diff;

        // Apply updates
        await Promise.all([
          db.updateUser(proposerId, { balance: nextProposerBal }),
          db.updateUser(acceptorId, { balance: nextAcceptorBal }),
          db.updateContract(contract.id, { amount: newAmount }),
        ]);
      }
    }

    // Finally update notification status
    const result = await db.updateNotificationStatus(notificationId, status);
    const updated = result?.value;

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