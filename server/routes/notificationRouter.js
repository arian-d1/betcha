const express = require("express");
const {
  getNotifications,
  createNotification,
  patchNotificationStatus,
  getNotificationById,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", getNotifications);
router.get("/:notificationId", getNotificationById); // <-- add
router.put("/", createNotification);
router.patch("/:notificationId", patchNotificationStatus);

module.exports = router;