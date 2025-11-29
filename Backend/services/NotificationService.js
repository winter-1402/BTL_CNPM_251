// ============================================
// services/NotificationService.js - Complete Implementation
// ============================================

const nodemailer = require("nodemailer");

class NotificationService {
  static transporter = null;

  static async initialize() {
    try {
      // Initialize email transporter
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      console.log("Notification service initialized");
    } catch (error) {
      console.error("Error initializing notification service:", error);
    }
  }

  static async sendNotification(userId, message, notificationType) {
    try {
      // Get user details
      const user = await db.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);

      if (user.length === 0) {
        throw new Error("User not found");
      }

      // Store notification in database
      await db.storeData("notifications", {
        user_id: userId,
        message: message,
        type: notificationType,
        is_read: false,
        created_at: new Date(),
      });

      // Send email
      await this.sendEmail(
        user[0].email,
        this.getSubject(notificationType),
        message
      );

      // Could also send SMS here
      // await this.sendSMS(user[0].phone, message);

      console.log(`Notification sent to user ${userId}`);
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  static async sendEmail(to, subject, text) {
    try {
      if (!this.transporter) {
        await this.initialize();
      }

      const mailOptions = {
        from: process.env.SMTP_USER || "noreply@tutorsystem.com",
        to: to,
        subject: subject,
        text: text,
        html: `<p>${text}</p>`,
      };

      await this.transporter.sendMail(mailOptions);

      console.log(`Email sent to ${to}`);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  static async sendSMS(to, message) {
    try {
      // Implementation for SMS using Twilio or similar service
      console.log(`SMS would be sent to ${to}: ${message}`);
      return true;
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw error;
    }
  }

  static async sendSessionReminder(sessionId) {
    try {
      const SessionService = require("./SessionService").SessionService;
      const session = await SessionService.getSessionById(sessionId);

      if (!session) {
        throw new Error("Session not found");
      }

      const sessionDate = new Date(session.date_time);
      const formattedDate = sessionDate.toLocaleDateString();
      const formattedTime = sessionDate.toLocaleTimeString();

      // Send to tutor
      await this.sendNotification(
        session.tutor_id,
        `Reminder: You have a session scheduled for ${formattedDate} at ${formattedTime}`,
        "session_reminder"
      );

      // Send to student
      await this.sendNotification(
        session.student_id,
        `Reminder: You have a session scheduled for ${formattedDate} at ${formattedTime}`,
        "session_reminder"
      );

      console.log(`Session reminder sent for session ${sessionId}`);
      return true;
    } catch (error) {
      console.error("Error sending session reminder:", error);
      throw error;
    }
  }

  static async notifySessionChange(sessionId, changeType) {
    try {
      const SessionService = require("./SessionService").SessionService;
      const session = await SessionService.getSessionById(sessionId);

      if (!session) {
        throw new Error("Session not found");
      }

      const message = this.getSessionChangeMessage(changeType, session);

      await this.sendNotification(
        session.tutor_id,
        message,
        `session_${changeType}`
      );
      await this.sendNotification(
        session.student_id,
        message,
        `session_${changeType}`
      );

      console.log(`Session change notification sent for session ${sessionId}`);
      return true;
    } catch (error) {
      console.error("Error notifying session change:", error);
      throw error;
    }
  }

  static getSessionChangeMessage(changeType, session) {
    const sessionDate = new Date(session.date_time);
    const formattedDate = sessionDate.toLocaleDateString();
    const formattedTime = sessionDate.toLocaleTimeString();

    switch (changeType) {
      case "cancelled":
        return `Your session scheduled for ${formattedDate} at ${formattedTime} has been cancelled.`;
      case "rescheduled":
        return `Your session has been rescheduled to ${formattedDate} at ${formattedTime}.`;
      case "updated":
        return `Your session scheduled for ${formattedDate} at ${formattedTime} has been updated.`;
      default:
        return `Your session has been ${changeType}.`;
    }
  }

  static getSubject(notificationType) {
    const subjects = {
      session_request: "New Session Request",
      session_approved: "Session Approved",
      session_rejected: "Session Rejected",
      session_cancelled: "Session Cancelled",
      session_rescheduled: "Session Rescheduled",
      session_reminder: "Session Reminder",
      session_updated: "Session Updated",
      new_feedback: "New Feedback Received",
      feedback_response: "Tutor Response to Your Feedback",
      feedback_request: "Please Provide Feedback",
      password_reset: "Password Reset Request",
      account_update: "Account Update",
    };

    return subjects[notificationType] || "Notification from Tutor System";
  }

  static async getUserNotifications(userId, unreadOnly = false) {
    try {
      let query = "SELECT * FROM notifications WHERE user_id = $1";

      if (unreadOnly) {
        query += " AND is_read = false";
      }

      query += " ORDER BY created_at DESC";

      const notifications = await db.query(query, [userId]);
      return notifications;
    } catch (error) {
      console.error("Error getting user notifications:", error);
      throw error;
    }
  }

  static async markNotificationAsRead(notificationId) {
    try {
      await db.updateData("notifications", notificationId, {
        is_read: true,
        read_at: new Date(),
      });

      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  static async markAllAsRead(userId) {
    try {
      await db.query(
        "UPDATE notifications SET is_read = true, read_at = NOW() WHERE user_id = $1 AND is_read = false",
        [userId]
      );

      return true;
    } catch (error) {
      console.error("Error marking all as read:", error);
      throw error;
    }
  }

  static async deleteNotification(notificationId) {
    try {
      await db.deleteData("notifications", notificationId);
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  // Schedule automatic reminders
  static async scheduleReminders() {
    try {
      // Get sessions happening in next 24 hours that haven't been reminded
      const sessions = await db.query(`
        SELECT s.* FROM sessions s
        LEFT JOIN session_reminders sr ON s.id = sr.session_id
        WHERE s.status = 'scheduled'
        AND s.date_time BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
        AND sr.id IS NULL
      `);

      for (const session of sessions) {
        await this.sendSessionReminder(session.id);

        // Mark as reminded
        await db.storeData("session_reminders", {
          session_id: session.id,
          sent_at: new Date(),
        });
      }

      console.log(`${sessions.length} reminders sent`);
      return sessions.length;
    } catch (error) {
      console.error("Error scheduling reminders:", error);
      throw error;
    }
  }
}

module.exports = { NotificationService };
