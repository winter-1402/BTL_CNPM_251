// ============================================
// routes/sessions.js - Complete Session Routes
// ============================================
const express = require("express");
const sessionRouter = express.Router();
const { SessionService } = require("../services/SessionService");
const { authenticate, authorize } = require("../middleware/auth");

// Create session (Students request, Tutors create)
sessionRouter.post("/", authenticate, async (req, res) => {
  try {
    const { tutorId, studentId, dateTime, duration, topic, location } =
      req.body;

    if (!tutorId || !studentId || !dateTime || !duration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const session = await SessionService.createSession(
      tutorId,
      studentId,
      new Date(dateTime),
      duration,
      topic,
      location
    );

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all sessions (with filters)
sessionRouter.get("/", authenticate, async (req, res) => {
  try {
    const { tutorId, studentId, status } = req.query;

    let sessions;

    if (tutorId) {
      sessions = await SessionService.getSessionsByTutor(parseInt(tutorId));
    } else if (studentId) {
      sessions = await SessionService.getSessionsByStudent(parseInt(studentId));
    } else {
      sessions = await db.queryData("sessions", status ? { status } : {});
    }

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get session by ID
sessionRouter.get("/:sessionId", authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await SessionService.getSessionById(parseInt(sessionId));

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tutor's sessions
sessionRouter.get("/tutor/:tutorId", authenticate, async (req, res) => {
  try {
    const { tutorId } = req.params;

    const sessions = await SessionService.getSessionsByTutor(parseInt(tutorId));

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's sessions
sessionRouter.get("/student/:studentId", authenticate, async (req, res) => {
  try {
    const { studentId } = req.params;

    const sessions = await SessionService.getSessionsByStudent(
      parseInt(studentId)
    );

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming sessions
sessionRouter.get("/upcoming/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query;

    const sessions = await SessionService.getUpcomingSessions(
      parseInt(userId),
      role
    );

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get past sessions
sessionRouter.get("/past/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query;

    const sessions = await SessionService.getPastSessions(
      parseInt(userId),
      role
    );

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update session
sessionRouter.put("/:sessionId", authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const updates = req.body;

    const session = await SessionService.updateSession(
      parseInt(sessionId),
      updates
    );

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel session
sessionRouter.put("/:sessionId/cancel", authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;

    await SessionService.cancelSession(
      parseInt(sessionId),
      req.user.id,
      reason
    );

    res.json({ message: "Session cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve session (Tutor only)
sessionRouter.put(
  "/:sessionId/approve",
  authenticate,
  authorize("tutor"),
  async (req, res) => {
    try {
      const { sessionId } = req.params;

      await SessionService.approveSession(parseInt(sessionId));

      res.json({ message: "Session approved successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Reject session (Tutor only)
sessionRouter.put(
  "/:sessionId/reject",
  authenticate,
  authorize("tutor"),
  async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { reason } = req.body;

      await SessionService.rejectSession(parseInt(sessionId), reason);

      res.json({ message: "Session rejected successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get session statistics
sessionRouter.get("/stats/:tutorId", authenticate, async (req, res) => {
  try {
    const { tutorId } = req.params;

    const stats = await SessionService.getSessionStatistics(parseInt(tutorId));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = sessionRouter;
