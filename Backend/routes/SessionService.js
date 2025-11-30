// ============================================
// services/SessionService.js
// ============================================

const { Session, SessionStatus } = require("../models/Session");
// FIXED: Import the database connection
const { mssqlDb } = require("../config/database");

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
      if (!tutorId || !studentId || !dateTime || !duration) {
        throw new Error("Missing required fields");
      }

      const conflicts = await this.checkConflicts(
        tutorId,
        studentId,
        dateTime,
        duration
      );

      if (conflicts.length > 0) {
        throw new Error("Time slot conflicts with existing session");
      }

      // Format date for SQL Server
      const sqlDate = new Date(dateTime)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // Use generic query or specific insert helper depending on your db wrapper
      // Assuming db.query handles raw SQL
      const insertQuery = `
        INSERT INTO buoi_hoc (tutorId, studentId, thoi_gian, thoi_luong, topic, dia_diem, tien_do)
        OUTPUT inserted.buoi_hoc_Id as id
        VALUES (${tutorId}, ${studentId}, '${sqlDate}', ${duration}, N'${
        topic || ""
      }', N'${location || ""}', 0)
      `;

      const result = await mssqlDb.query(insertQuery);
      const newId = result[0]?.id;

      // Send notifications (Mocked)
      console.log(`Session ${newId} created successfully`);

      return {
        id: newId,
        tutorId,
        studentId,
        dateTime,
        duration,
        status: SessionStatus.PENDING,
      };
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  static async checkConflicts(tutorId, studentId, dateTime, duration) {
    try {
      const sqlDate = new Date(dateTime)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // SQL Server DateAdd syntax
      const query = `
        SELECT * FROM buoi_hoc 
        WHERE (tutorId = ${tutorId} OR studentId = ${studentId})
        AND cancelled_at IS NULL
        AND (
          (thoi_gian <= '${sqlDate}' AND DATEADD(minute, thoi_luong, thoi_gian) > '${sqlDate}')
          OR (thoi_gian < DATEADD(minute, ${duration}, '${sqlDate}') AND DATEADD(minute, thoi_luong, thoi_gian) >= DATEADD(minute, ${duration}, '${sqlDate}'))
        )
      `;

      const conflicts = await mssqlDb.query(query);
      return conflicts;
    } catch (error) {
      console.error("Error checking conflicts:", error);
      throw error;
    }
  }

  static async getUpcomingSessions(userId, role) {
    try {
      const field = role === "tutor" ? "tutorId" : "studentId";
      const sessions = await mssqlDb.query(
        `
        SELECT * FROM buoi_hoc 
        WHERE ${field} = ${userId} 
        AND thoi_gian > GETDATE()
        AND cancelled_at IS NULL
        ORDER BY thoi_gian ASC
      `
      );

      // Map back to frontend expected format if needed, or return as is
      return sessions.map((s) => ({
        id: s.buoi_hoc_Id,
        tutor_id: s.tutorId,
        student_id: s.studentId,
        date_time: s.thoi_gian,
        duration: s.thoi_luong,
        topic: s.topic,
        location: s.dia_diem,
        status: s.cancelled_at ? "cancelled" : "scheduled", // Simple status mapping
      }));
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);
      throw error;
    }
  }

  static async getPastSessions(userId, role) {
    try {
      const field = role === "tutor" ? "tutorId" : "studentId";

      const sessions = await mssqlDb.query(
        `
        SELECT * FROM buoi_hoc 
        WHERE ${field} = ${userId} 
        AND thoi_gian < GETDATE()
        ORDER BY thoi_gian DESC
      `
      );

      return sessions.map((s) => ({
        id: s.buoi_hoc_Id,
        tutor_id: s.tutorId,
        student_id: s.studentId,
        date_time: s.thoi_gian,
        duration: s.thoi_luong,
        topic: s.topic,
        location: s.dia_diem,
        status: "completed",
      }));
    } catch (error) {
      console.error("Error fetching past sessions:", error);
      throw error;
    }
  }

  static async cancelSession(sessionId, cancelledBy, reason = null) {
    try {
      const query = `
            UPDATE buoi_hoc 
            SET cancelled_at = GETDATE(), cancelled_by = ${cancelledBy}, cancellation_reason = N'${reason}'
            WHERE buoi_hoc_Id = ${sessionId}
          `;
      await mssqlDb.query(query);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { SessionService };
