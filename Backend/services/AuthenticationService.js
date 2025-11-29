// ============================================
// services/AuthenticationService.js - Complete Implementation
// ============================================

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { mssqlDb } = require("../config/database");

class AuthenticationService {
  static async authenticateUser(email, password) {
    try {
      // First, try local authentication
      const users = await mssqlDb.query("SELECT * FROM users WHERE email = ?", [email]);
      if (users.length === 0) {
        // If user not found locally, try HCMUT_SSO
        return await this.authenticateWithHCMUT_SSO(email, password);
      }

      const user = users.map(user => user.passwords);;
      const isValid = password === user ? 0 :1;
      const user_id = users.map(user_id => user_id.id);
      const user_name = users.map(user_name => user_name.username);
      const user_email = users.map(user_email => user_email.email);
      const user_role = users.map(user_role => user_role.roles);
      if (!isValid) return null;
      // Remove password hash from returned object
      return  {
          id: user_id,
          name: user_name,
          email: user_email,
          role: user_role,
        };
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  }

  static async authenticateWithHCMUT_SSO(email, password) {
    try {
      // Simulate HCMUT_SSO authentication
      console.log("Authenticating with HCMUT_SSO...");

      // In real implementation, this would call the SSO API
      // const response = await axios.post('https://hcmut-sso-api/authenticate', {
      //   email, password
      // });

      // For simulation, return null
      return null;
    } catch (error) {
      console.error("HCMUT_SSO authentication error:", error);
      return null;
    }
  }


  static async login(email, password) {
    try {
      const user = await this.authenticateUser(email, password);
      if (!user) return null;
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async logout(token) {
    try {
      await db.query("DELETE FROM sessions WHERE token = $1", [token]);
      console.log("User logged out successfully");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  static async register(name, email, password, role = "student") {
    try {
      // Check if user already exists
      const existingUsers = await db.queryData("users", { email });

      if (existingUsers.length > 0) {
        throw new Error("User already exists");
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await db.storeData("users", {
        name,
        email,
        password_hash: passwordHash,
        role,
        status: "active",
        created_at: new Date(),
      });

      // Create role-specific record
      if (role === "student") {
        await db.storeData("students", {
          user_id: user.id,
          enrolled_courses: JSON.stringify([]),
          requested_sessions: JSON.stringify([]),
          feedback_history: JSON.stringify([]),
        });
      } else if (role === "tutor") {
        await db.storeData("tutors", {
          user_id: user.id,
          expertise_areas: JSON.stringify([]),
          availability: "",
          rating: 0.0,
        });
      }

      console.log(`User ${user.id} registered successfully`);
      return user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  static async resetPassword(email) {
    try {
      const users = await db.queryData("users", { email });

      if (users.length === 0) {
        throw new Error("User not found");
      }

      const user = users[0];

      // Generate reset token
      const resetToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "tutor-system-secret-key",
        { expiresIn: "1h" }
      );

      // Store reset token
      await db.storeData("password_resets", {
        user_id: user.id,
        token: resetToken,
        created_at: new Date(),
        expires_at: new Date(Date.now() + 60 * 60 * 1000),
      });

      // Send email with reset link
      const NotificationService =
        require("./NotificationService").NotificationService;
      await NotificationService.sendNotification(
        user.id,
        `Password reset link: http://localhost:3000/reset-password?token=${resetToken}`,
        "password_reset"
      );

      return { success: true, message: "Reset link sent to email" };
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  static async changePassword(userId, oldPassword, newPassword) {
    try {
      const users = await db.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);

      if (users.length === 0) {
        throw new Error("User not found");
      }

      const user = users[0];

      // Verify old password
      const isValid = await bcrypt.compare(oldPassword, user.password_hash);

      if (!isValid) {
        throw new Error("Invalid old password");
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      await db.updateData("users", userId, {
        password_hash: newPasswordHash,
        password_updated_at: new Date(),
      });

      console.log(`Password changed for user ${userId}`);
      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }
}

module.exports = { AuthenticationService };
