const crypto = require("crypto");
const db = require("../db/queries");

const ALLOWED_STATUSES = new Set(["pending", "accepted", "declined"]);

function mapNotification(n) {
  return {
    n_id: n.n_id,
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
      n_id: crypto.randomUUID(),
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