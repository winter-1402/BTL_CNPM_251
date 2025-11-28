// ============================================
// models/User.js - Complete User Models
// ============================================

const bcrypt = require("bcrypt");
const { db } = require("../config/database");

class User {
  constructor(id, name, email, passwordHash, role) {
    if (this.constructor === User) {
      throw new Error("Abstract class cannot be instantiated");
    }
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
  }

  async login(email, password) {
    try {
      const users = await db.queryData("users", { email });

      if (users.length === 0) return null;

      const user = users[0];
      const isValid = await bcrypt.compare(password, user.password_hash);

      return isValid ? user : null;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      // Clear session, invalidate token
      console.log(`User ${this.id} logged out`);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async updateProfile(data) {
    try {
      const updated = await db.updateData("users", this.id, data);
      Object.assign(this, updated);
      return this;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  async save() {
    try {
      const data = {
        name: this.name,
        email: this.email,
        password_hash: this.passwordHash,
        role: this.role,
      };

      if (this.id) {
        return await db.updateData("users", this.id, data);
      } else {
        return await db.storeData("users", data);
      }
    } catch (error) {
      console.error("Save user error:", error);
      throw error;
    }
  }
}

class Student extends User {
  constructor(id, name, email, passwordHash) {
    super(id, name, email, passwordHash, "student");
    this.enrolledCourses = [];
    this.requestedSessions = [];
    this.feedbackHistory = [];
  }

  async requestSession(sessionId) {
    try {
      this.requestedSessions.push(sessionId);

      await db.storeData("session_requests", {
        student_id: this.id,
        session_id: sessionId,
        requested_at: new Date(),
      });

      console.log(`Student ${this.id} requested session ${sessionId}`);
      return true;
    } catch (error) {
      console.error("Request session error:", error);
      throw error;
    }
  }

  async submitFeedback(feedbackId) {
    try {
      this.feedbackHistory.push(feedbackId);

      await db.updateData("students", this.id, {
        feedback_history: JSON.stringify(this.feedbackHistory),
      });

      console.log(`Student ${this.id} submitted feedback ${feedbackId}`);
      return true;
    } catch (error) {
      console.error("Submit feedback error:", error);
      throw error;
    }
  }

  async getEnrolledCourses() {
    try {
      const courses = await db.query(
        "SELECT * FROM courses WHERE id = ANY($1)",
        [this.enrolledCourses]
      );
      return courses;
    } catch (error) {
      console.error("Get enrolled courses error:", error);
      throw error;
    }
  }

  async enrollCourse(courseId) {
    try {
      this.enrolledCourses.push(courseId);

      await db.storeData("enrollments", {
        student_id: this.id,
        course_id: courseId,
        enrolled_at: new Date(),
      });

      return true;
    } catch (error) {
      console.error("Enroll course error:", error);
      throw error;
    }
  }
}

class Tutor extends User {
  constructor(id, name, email, passwordHash) {
    super(id, name, email, passwordHash, "tutor");
    this.expertiseAreas = [];
    this.availability = "";
    this.rating = 0.0;
  }

  async updateAvailability(newAvailability) {
    try {
      this.availability = newAvailability;

      await db.updateData("tutors", this.id, {
        availability: newAvailability,
      });

      console.log(`Tutor ${this.id} updated availability`);
      return true;
    } catch (error) {
      console.error("Update availability error:", error);
      throw error;
    }
  }

  async viewSessions() {
    try {
      const sessions = await db.queryData("sessions", { tutor_id: this.id });
      return sessions.map((s) => s.id);
    } catch (error) {
      console.error("View sessions error:", error);
      throw error;
    }
  }

  async respondToFeedback(feedbackId, response) {
    try {
      await db.updateData("feedback", feedbackId, {
        tutor_response: response,
        responded_at: new Date(),
      });

      console.log(`Tutor ${this.id} responded to feedback ${feedbackId}`);
      return true;
    } catch (error) {
      console.error("Respond to feedback error:", error);
      throw error;
    }
  }

  async updateRating(newRating) {
    try {
      this.rating = newRating;

      await db.updateData("tutors", this.id, {
        rating: newRating,
      });

      return true;
    } catch (error) {
      console.error("Update rating error:", error);
      throw error;
    }
  }

  async addExpertiseArea(area) {
    try {
      this.expertiseAreas.push(area);

      await db.updateData("tutors", this.id, {
        expertise_areas: JSON.stringify(this.expertiseAreas),
      });

      return true;
    } catch (error) {
      console.error("Add expertise area error:", error);
      throw error;
    }
  }
}

class Admin extends User {
  constructor(id, name, email, passwordHash) {
    super(id, name, email, passwordHash, "admin");
    this.managedUsers = [];
    this.reports = [];
  }

  async generateReport(reportType) {
    try {
      const reportId = Date.now();
      let data = {};

      switch (reportType) {
        case "usage":
          data = await this.getUsageData();
          break;
        case "tutor_performance":
          data = await this.getTutorPerformanceData();
          break;
        case "student_progress":
          data = await this.getStudentProgressData();
          break;
        default:
          throw new Error("Invalid report type");
      }

      const report = await db.storeData("reports", {
        report_type: reportType,
        data: JSON.stringify(data),
        generated_by: this.id,
        generated_at: new Date(),
      });

      this.reports.push(report.id);

      return report;
    } catch (error) {
      console.error("Generate report error:", error);
      throw error;
    }
  }

  async manageAccounts(userId, action) {
    try {
      switch (action) {
        case "activate":
          await db.updateData("users", userId, { status: "active" });
          break;
        case "deactivate":
          await db.updateData("users", userId, { status: "inactive" });
          break;
        case "delete":
          await db.deleteData("users", userId);
          break;
        case "reset_password":
          const tempPassword = this.generateTempPassword();
          const hashedPassword = await bcrypt.hash(tempPassword, 10);
          await db.updateData("users", userId, {
            password_hash: hashedPassword,
          });
          break;
        default:
          throw new Error("Invalid action");
      }

      console.log(`Admin ${this.id} performed ${action} on user ${userId}`);
      return true;
    } catch (error) {
      console.error("Manage accounts error:", error);
      throw error;
    }
  }

  async getUsageData() {
    try {
      const totalUsers = await db.query("SELECT COUNT(*) FROM users");
      const totalSessions = await db.query("SELECT COUNT(*) FROM sessions");
      const activeSessions = await db.query(
        "SELECT COUNT(*) FROM sessions WHERE status = 'scheduled'"
      );

      return {
        totalUsers: totalUsers[0].count,
        totalSessions: totalSessions[0].count,
        activeSessions: activeSessions[0].count,
      };
    } catch (error) {
      console.error("Get usage data error:", error);
      throw error;
    }
  }

  async getTutorPerformanceData() {
    try {
      const tutors = await db.query(`
        SELECT t.id, t.name, t.rating, COUNT(s.id) as session_count
        FROM tutors t
        LEFT JOIN sessions s ON t.id = s.tutor_id
        GROUP BY t.id, t.name, t.rating
        ORDER BY t.rating DESC
      `);

      return tutors;
    } catch (error) {
      console.error("Get tutor performance data error:", error);
      throw error;
    }
  }

  async getStudentProgressData() {
    try {
      const students = await db.query(`
        SELECT s.id, s.name, COUNT(se.id) as session_count,
               AVG(f.rating) as avg_satisfaction
        FROM students s
        LEFT JOIN sessions se ON s.id = se.student_id
        LEFT JOIN feedback f ON se.id = f.session_id
        GROUP BY s.id, s.name
      `);

      return students;
    } catch (error) {
      console.error("Get student progress data error:", error);
      throw error;
    }
  }

  generateTempPassword() {
    return Math.random().toString(36).slice(-8);
  }

  async syncWithHCMUTDataCore() {
    try {
      // Simulate API call to HCMUT_DATACORE
      console.log("Syncing with HCMUT_DATACORE...");

      // In real implementation, this would call the external API
      // const response = await axios.get('https://hcmut-datacore-api/sync');

      return { success: true, message: "Data synced successfully" };
    } catch (error) {
      console.error("Sync with HCMUT_DATACORE error:", error);
      throw error;
    }
  }
}

module.exports = { User, Student, Tutor, Admin };
