// ============================================
// models/Session.js - Complete Session Model
// ============================================

const SessionStatus = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  PENDING: "pending",
};

class Session {
  constructor(sessionId, tutorId, studentId, dateTime, duration) {
    this.sessionId = sessionId;
    this.tutorId = tutorId;
    this.studentId = studentId;
    this.dateTime = dateTime;
    this.duration = duration;
    this.status = SessionStatus.PENDING;
    this.topic = null;
    this.location = null;
    this.notes = "";
  }

  async schedule() {
    try {
      this.status = SessionStatus.SCHEDULED;

      await db.updateData("sessions", this.sessionId, {
        status: this.status,
      });

      // Send notifications
      const NotificationService =
        require("../services/NotificationService").NotificationService;
      await NotificationService.sendNotification(
        this.tutorId,
        `Session scheduled for ${this.dateTime}`,
        "session_scheduled"
      );
      await NotificationService.sendNotification(
        this.studentId,
        `Session scheduled for ${this.dateTime}`,
        "session_scheduled"
      );

      return true;
    } catch (error) {
      console.error("Schedule session error:", error);
      throw error;
    }
  }

  async cancel() {
    try {
      this.status = SessionStatus.CANCELLED;

      await db.updateData("sessions", this.sessionId, {
        status: this.status,
        cancelled_at: new Date(),
      });

      // Send notifications
      const NotificationService =
        require("../services/NotificationService").NotificationService;
      await NotificationService.notifySessionChange(
        this.sessionId,
        "cancelled"
      );

      return true;
    } catch (error) {
      console.error("Cancel session error:", error);
      throw error;
    }
  }

  async markComplete() {
    try {
      this.status = SessionStatus.COMPLETED;

      await db.updateData("sessions", this.sessionId, {
        status: this.status,
        completed_at: new Date(),
      });

      // Send notification to request feedback
      const NotificationService =
        require("../services/NotificationService").NotificationService;
      await NotificationService.sendNotification(
        this.studentId,
        `Please provide feedback for your session`,
        "feedback_request"
      );

      return true;
    } catch (error) {
      console.error("Mark complete error:", error);
      throw error;
    }
  }

  async reschedule(newDateTime) {
    try {
      const oldDateTime = this.dateTime;
      this.dateTime = newDateTime;

      await db.updateData("sessions", this.sessionId, {
        date_time: newDateTime,
        rescheduled_from: oldDateTime,
      });

      // Send notifications
      const NotificationService =
        require("../services/NotificationService").NotificationService;
      await NotificationService.notifySessionChange(
        this.sessionId,
        "rescheduled"
      );

      return true;
    } catch (error) {
      console.error("Reschedule session error:", error);
      throw error;
    }
  }

  async addNotes(notes) {
    try {
      this.notes = notes;

      await db.updateData("sessions", this.sessionId, {
        notes: notes,
      });

      return true;
    } catch (error) {
      console.error("Add notes error:", error);
      throw error;
    }
  }

  async save() {
    try {
      const data = {
        tutor_id: this.tutorId,
        student_id: this.studentId,
        date_time: this.dateTime,
        duration: this.duration,
        status: this.status,
        topic: this.topic,
        location: this.location,
        notes: this.notes,
      };

      if (this.sessionId) {
        return await db.updateData("sessions", this.sessionId, data);
      } else {
        return await db.storeData("sessions", data);
      }
    } catch (error) {
      console.error("Save session error:", error);
      throw error;
    }
  }
}

module.exports = { Session, SessionStatus };
