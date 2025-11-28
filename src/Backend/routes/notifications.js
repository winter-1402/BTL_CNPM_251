// ============================================
// routes/notifications.js - Notification Routes
// ============================================

const notificationRouter = express.Router();
const { NotificationService } = require("../services/NotificationService");

// Get user notifications
notificationRouter.get("/", authenticate, async (req, res) => {
  try {
    const { unreadOnly } = req.query;

    const notifications = await NotificationService.getUserNotifications(
      req.user.id,
      unreadOnly === "true"
    );

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
notificationRouter.put(
  "/:notificationId/read",
  authenticate,
  async (req, res) => {
    try {
      const { notificationId } = req.params;

      await NotificationService.markNotificationAsRead(
        parseInt(notificationId)
      );

      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Mark all as read
notificationRouter.put("/read-all", authenticate, async (req, res) => {
  try {
    await NotificationService.markAllAsRead(req.user.id);

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
notificationRouter.delete(
  "/:notificationId",
  authenticate,
  async (req, res) => {
    try {
      const { notificationId } = req.params;

      await NotificationService.deleteNotification(parseInt(notificationId));

      res.json({ message: "Notification deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = notificationRouter;
