// ============================================
// routes/auth.js - Complete Authentication Routes
// ============================================
const express = require("express");
const { AuthenticationService } = require("../services/AuthenticationService");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = await AuthenticationService.login(email, password);

    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password required" });
    }

    const user = await AuthenticationService.register(
      name,
      email,
      password,
      role || "student"
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post("/logout", authenticate, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    await AuthenticationService.logout(token);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request password reset
router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const result = await AuthenticationService.resetPassword(email);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.post("/change-password", authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Old and new passwords required" });
    }

    const result = await AuthenticationService.changePassword(
      req.user.id,
      oldPassword,
      newPassword
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
