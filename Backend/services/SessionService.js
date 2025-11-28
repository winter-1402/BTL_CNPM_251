// ============================================
// services/SessionService.js - Complete Implementation
// ============================================

const { Session, SessionStatus } = require("../models/Session");

class SessionService {
  static async createSession(
    tutorId,
    studentId,
    dateTime,
    duration,
    topic = null,
    location = null
  ) {
    try {
      // Validate inputs
      if (!tutorId || !studentId || !dateTime || !duration) {
        throw new Error("Missing required fields");
      }

      // Check for conflicts
      const conflicts = await this.checkConflicts(
        tutorId,
        studentId,
        dateTime,
        duration
      );

      if (conflicts.length > 0) {
        throw new Error("Time slot conflicts with existing session");
      }

      // Create session
      const sessionData = {
        tutor_id: tutorId,
        student_id: studentId,
        date_time: dateTime,
        duration: duration,
        status: SessionStatus.PENDING,
        topic: topic,
        location: location,
        created_at: new Date(),
      };

      const result = await db.storeData("sessions", sessionData);

      const session = new Session(
        result.id,
        tutorId,
        studentId,
        dateTime,
        duration
      );
      session.topic = topic;
      session.location = location;

      // Send notifications
      const NotificationService =
        require("./NotificationService").NotificationService;
      await NotificationService.sendNotification(
        tutorId,
        `New session request from student`,
        "session_request"
      );

      console.log(`Session ${session.sessionId} created successfully`);
      return session;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  static async checkConflicts(tutorId, studentId, dateTime, duration) {
    try {
      const sessionStart = new Date(dateTime);
      const sessionEnd = new Date(sessionStart.getTime() + duration * 60000);

      const conflicts = await db.query(
        `
        SELECT * FROM sessions 
        WHERE (tutor_id = $1 OR student_id = $2)
        AND status != 'cancelled'
        AND (
          (date_time <= $3 AND date_time + (duration * interval '1 minute') > $3)
          OR (date_time < $4 AND date_time + (duration * interval '1 minute') >= $4)
          OR (date_time >= $3 AND date_time < $4)
        )
      `,
        [tutorId, studentId, sessionStart, sessionEnd]
      );

      return conflicts;
    } catch (error) {
      console.error("Error checking conflicts:", error);
      throw error;
    }
  }

  static async updateSession(sessionId, updates) {
    try {
      const session = await this.getSessionById(sessionId);

      if (!session) {
        throw new Error("Session not found");
      }

      // If updating date_time, check for conflicts
      if (updates.date_time) {
        const conflicts = await this.checkConflicts(
          session.tutor_id,
          session.student_id,
          updates.date_time,
          updates.duration || session.duration
        );

        if (conflicts.length > 0 && conflicts[0].id !== sessionId) {
          throw new Error("Time slot conflicts with existing session");
        }
      }

      const updated = await db.updateData("sessions", sessionId, updates);

      // Send notifications
      const NotificationService =
        require("./NotificationService").NotificationService;
      await NotificationService.notifySessionChange(sessionId, "updated");

      console.log(`Session ${sessionId} updated successfully`);
      return updated;
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  }

  static async getSessionsByTutor(tutorId) {
    try {
      const sessions = await db.queryData("sessions", { tutor_id: tutorId });
      return sessions;
    } catch (error) {
      console.error("Error fetching tutor sessions:", error);
      throw error;
    }
  }

  static async getSessionsByStudent(studentId) {
    try {
      const sessions = await db.queryData("sessions", {
        student_id: studentId,
      });
      return sessions;
    } catch (error) {
      console.error("Error fetching student sessions:", error);
      throw error;
    }
  }

  static async getUpcomingSessions(userId, role) {
    try {
      const field = role === "tutor" ? "tutor_id" : "student_id";

      const sessions = await db.query(
        `
        SELECT * FROM sessions 
        WHERE ${field} = $1 
        AND date_time > NOW()
        AND status != 'cancelled'
        ORDER BY date_time ASC
      `,
        [userId]
      );

      return sessions;
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);
      throw error;
    }
  }

  static async getPastSessions(userId, role) {
    try {
      const field = role === "tutor" ? "tutor_id" : "student_id";

      const sessions = await db.query(
        `
        SELECT * FROM sessions 
        WHERE ${field} = $1 
        AND date_time < NOW()
        ORDER BY date_time DESC
      `,
        [userId]
      );

      return sessions;
    } catch (error) {
      console.error("Error fetching past sessions:", error);
      throw error;
    }
  }

  static async cancelSession(sessionId, cancelledBy, reason = null) {
    try {
      const session = await this.getSessionById(sessionId);

      if (!session) {
        throw new Error("Session not found");
      }

      await db.updateData("sessions", sessionId, {
        status: SessionStatus.CANCELLED,
        cancelled_at: new Date(),
        cancelled_by: cancelledBy,
        cancellation_reason: reason,
      });

      // Send notifications
      const NotificationService =
        require("./NotificationService").NotificationService;
      await NotificationService.notifySessionChange(sessionId, "cancelled");

      console.log(`Session ${sessionId} cancelled successfully`);
      return { success: true, message: "Session cancelled successfully" };
    } catch (error) {
      console.error("Error cancelling session:", error);
      throw error;
    }
  }

  static async approveSession(sessionId) {
    try {
      await db.updateData("sessions", sessionId, {
        status: SessionStatus.SCHEDULED,
        approved_at: new Date(),
      });

      const session = await this.getSessionById(sessionId);

      // Send notifications
      const NotificationService =
        require("./NotificationService").NotificationService;
      await NotificationService.sendNotification(
        session.student_id,
        "Your session request has been approved",
        "session_approved"
      );

      console.log(`Session ${sessionId} approved successfully`);
      return { success: true, message: "Session approved successfully" };
    } catch (error) {
      console.error("Error approving session:", error);
      throw error;
    }
  }

  static async rejectSession(sessionId, reason = null) {
    try {
      await db.updateData("sessions", sessionId, {
        status: SessionStatus.CANCELLED,
        rejected_at: new Date(),
        rejection_reason: reason,
      });

      const session = await this.getSessionById(sessionId);

      // Send notifications
      const NotificationService =
        require("./NotificationService").NotificationService;
      await NotificationService.sendNotification(
        session.student_id,
        `Your session request has been rejected. Reason: ${reason}`,
        "session_rejected"
      );

      console.log(`Session ${sessionId} rejected successfully`);
      return { success: true, message: "Session rejected successfully" };
    } catch (error) {
      console.error("Error rejecting session:", error);
      throw error;
    }
  }

  static async getSessionById(sessionId) {
    try {
      const sessions = await db.queryData("sessions", { id: sessionId });
      return sessions[0] || null;
    } catch (error) {
      console.error("Error getting session by ID:", error);
      throw error;
    }
  }

  static async getSessionStatistics(tutorId) {
    try {
      const stats = await db.query(
        `
        SELECT 
          COUNT(*) as total_sessions,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_sessions,
          AVG(duration) as avg_duration
        FROM sessions
        WHERE tutor_id = $1
      `,
        [tutorId]
      );

      return stats[0];
    } catch (error) {
      console.error("Error getting session statistics:", error);
      throw error;
    }
  }
}

module.exports = { SessionService };
