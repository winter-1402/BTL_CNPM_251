// ============================================
// services/ReportService.js - Complete Implementation
// ============================================

const { Report } = require("../models/Report");

class ReportService {
  static async generateUsageReport(startDate, endDate) {
    try {
      const data = await this.fetchUsageData(startDate, endDate);

      const report = new Report(null, "usage", data, null);
      await report.generateReport();

      console.log("Usage report generated successfully");
      return report;
    } catch (error) {
      console.error("Error generating usage report:", error);
      throw error;
    }
  }

  static async fetchUsageData(startDate, endDate) {
    try {
      const totalUsers = await db.query(
        "SELECT COUNT(*) as count FROM users WHERE created_at BETWEEN $1 AND $2",
        [startDate, endDate]
      );

      const totalSessions = await db.query(
        "SELECT COUNT(*) as count FROM sessions WHERE created_at BETWEEN $1 AND $2",
        [startDate, endDate]
      );

      const completedSessions = await db.query(
        "SELECT COUNT(*) as count FROM sessions WHERE status = 'completed' AND created_at BETWEEN $1 AND $2",
        [startDate, endDate]
      );

      const cancelledSessions = await db.query(
        "SELECT COUNT(*) as count FROM sessions WHERE status = 'cancelled' AND created_at BETWEEN $1 AND $2",
        [startDate, endDate]
      );

      const totalFeedback = await db.query(
        "SELECT COUNT(*) as count FROM feedback WHERE submitted_at BETWEEN $1 AND $2",
        [startDate, endDate]
      );

      const avgRating = await db.query(
        "SELECT AVG(rating) as avg FROM feedback WHERE submitted_at BETWEEN $1 AND $2",
        [startDate, endDate]
      );

      return {
        period: { startDate, endDate },
        totalUsers: parseInt(totalUsers[0].count),
        totalSessions: parseInt(totalSessions[0].count),
        completedSessions: parseInt(completedSessions[0].count),
        cancelledSessions: parseInt(cancelledSessions[0].count),
        totalFeedback: parseInt(totalFeedback[0].count),
        avgRating: parseFloat(avgRating[0].avg) || 0,
      };
    } catch (error) {
      console.error("Error fetching usage data:", error);
      throw error;
    }
  }

  static async generateTutorPerformance(tutorId) {
    try {
      const data = await this.fetchTutorPerformanceData(tutorId);

      const report = new Report(null, "tutor_performance", data, null);
      await report.generateReport();

      console.log(
        `Tutor performance report for ${tutorId} generated successfully`
      );
      return report;
    } catch (error) {
      console.error("Error generating tutor performance:", error);
      throw error;
    }
  }

  static async fetchTutorPerformanceData(tutorId) {
    try {
      const tutor = await db.query("SELECT * FROM tutors WHERE id = $1", [
        tutorId,
      ]);

      if (tutor.length === 0) {
        throw new Error("Tutor not found");
      }

      const totalSessions = await db.query(
        "SELECT COUNT(*) as count FROM sessions WHERE tutor_id = $1",
        [tutorId]
      );

      const completedSessions = await db.query(
        "SELECT COUNT(*) as count FROM sessions WHERE tutor_id = $1 AND status = 'completed'",
        [tutorId]
      );

      const cancelledSessions = await db.query(
        "SELECT COUNT(*) as count FROM sessions WHERE tutor_id = $1 AND status = 'cancelled'",
        [tutorId]
      );

      const FeedbackService = require("./FeedbackService").FeedbackService;
      const feedbackStats = await FeedbackService.getTutorFeedbackStats(
        tutorId
      );

      const sessionStats = await db.query(
        `
        SELECT 
          AVG(duration) as avg_duration,
          MIN(duration) as min_duration,
          MAX(duration) as max_duration
        FROM sessions
        WHERE tutor_id = $1
      `,
        [tutorId]
      );

      return {
        tutor: tutor[0],
        sessions: {
          total: parseInt(totalSessions[0].count),
          completed: parseInt(completedSessions[0].count),
          cancelled: parseInt(cancelledSessions[0].count),
          completionRate:
            totalSessions[0].count > 0
              ? (
                  (completedSessions[0].count / totalSessions[0].count) *
                  100
                ).toFixed(2)
              : 0,
        },
        feedback: feedbackStats,
        sessionDuration: {
          avg: parseFloat(sessionStats[0].avg_duration) || 0,
          min: parseInt(sessionStats[0].min_duration) || 0,
          max: parseInt(sessionStats[0].max_duration) || 0,
        },
      };
    } catch (error) {
      console.error("Error fetching tutor performance data:", error);
      throw error;
    }
  }

  static async generateStudentProgress(studentId) {
    try {
      const data = await this.fetchStudentProgressData(studentId);

      const report = new Report(null, "student_progress", data, null);
      await report.generateReport();

      console.log(
        `Student progress report for ${studentId} generated successfully`
      );
      return report;
    } catch (error) {
      console.error("Error generating student progress:", error);
      throw error;
    }
  }

  static async fetchStudentProgressData(studentId) {
    try {
      const student = await db.query("SELECT * FROM students WHERE id = $1", [
        studentId,
      ]);

      if (student.length === 0) {
        throw new Error("Student not found");
      }

      const totalSessions = await db.query(
        "SELECT COUNT(*) as count FROM sessions WHERE student_id = $1",
        [studentId]
      );

      const completedSessions = await db.query(
        "SELECT COUNT(*) as count FROM sessions WHERE student_id = $1 AND status = 'completed'",
        [studentId]
      );

      const upcomingSessions = await db.query(
        "SELECT COUNT(*) as count FROM sessions WHERE student_id = $1 AND status = 'scheduled' AND date_time > NOW()",
        [studentId]
      );

      const feedbackGiven = await db.query(
        "SELECT COUNT(*) as count FROM feedback WHERE student_id = $1",
        [studentId]
      );

      const sessionsWithTutors = await db.query(
        `
        SELECT t.name, t.expertise_areas, COUNT(s.id) as session_count
        FROM sessions s
        JOIN tutors t ON s.tutor_id = t.id
        WHERE s.student_id = $1
        GROUP BY t.id, t.name, t.expertise_areas
      `,
        [studentId]
      );

      return {
        student: student[0],
        sessions: {
          total: parseInt(totalSessions[0].count),
          completed: parseInt(completedSessions[0].count),
          upcoming: parseInt(upcomingSessions[0].count),
          feedbackGiven: parseInt(feedbackGiven[0].count),
        },
        tutors: sessionsWithTutors,
      };
    } catch (error) {
      console.error("Error fetching student progress data:", error);
      throw error;
    }
  }

  static async generateSystemReport() {
    try {
      const data = {
        users: await this.getUserStatistics(),
        sessions: await this.getSessionStatistics(),
        feedback: await this.getFeedbackStatistics(),
        topTutors: await this.getTopTutors(10),
        activeStudents: await this.getMostActiveStudents(10),
      };

      const report = new Report(null, "system_overview", data, null);
      await report.generateReport();

      console.log("System report generated successfully");
      return report;
    } catch (error) {
      console.error("Error generating system report:", error);
      throw error;
    }
  }

  static async getUserStatistics() {
    try {
      const stats = await db.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN role = 'student' THEN 1 END) as students,
          COUNT(CASE WHEN role = 'tutor' THEN 1 END) as tutors,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users
        FROM users
      `);

      return stats[0];
    } catch (error) {
      console.error("Error getting user statistics:", error);
      throw error;
    }
  }

  static async getSessionStatistics() {
    try {
      const stats = await db.query(`
        SELECT 
          COUNT(*) as total_sessions,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          AVG(duration) as avg_duration
        FROM sessions
      `);

      return stats[0];
    } catch (error) {
      console.error("Error getting session statistics:", error);
      throw error;
    }
  }

  static async getFeedbackStatistics() {
    try {
      const stats = await db.query(`
        SELECT 
          COUNT(*) as total_feedback,
          AVG(rating) as avg_rating,
          COUNT(CASE WHEN is_anonymous THEN 1 END) as anonymous_feedback
        FROM feedback
      `);

      return stats[0];
    } catch (error) {
      console.error("Error getting feedback statistics:", error);
      throw error;
    }
  }

  static async getTopTutors(limit = 10) {
    try {
      const tutors = await db.query(
        `
        SELECT t.*, u.name, u.email,
               COUNT(s.id) as session_count,
               AVG(f.rating) as avg_rating
        FROM tutors t
        JOIN users u ON t.user_id = u.id
        LEFT JOIN sessions s ON t.id = s.tutor_id
        LEFT JOIN feedback f ON t.id = f.tutor_id
        GROUP BY t.id, u.name, u.email
        ORDER BY avg_rating DESC, session_count DESC
        LIMIT $1
      `,
        [limit]
      );

      return tutors;
    } catch (error) {
      console.error("Error getting top tutors:", error);
      throw error;
    }
  }

  static async getMostActiveStudents(limit = 10) {
    try {
      const students = await db.query(
        `
        SELECT s.*, u.name, u.email,
               COUNT(se.id) as session_count,
               COUNT(f.id) as feedback_count
        FROM students s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN sessions se ON s.id = se.student_id
        LEFT JOIN feedback f ON s.id = f.student_id
        GROUP BY s.id, u.name, u.email
        ORDER BY session_count DESC
        LIMIT $1
      `,
        [limit]
      );

      return students;
    } catch (error) {
      console.error("Error getting most active students:", error);
      throw error;
    }
  }
}

module.exports = { ReportService };
