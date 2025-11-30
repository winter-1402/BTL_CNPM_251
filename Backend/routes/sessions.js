// ============================================
// routes/sessions.js - Complete Session Routes
// ============================================
const express = require("express");
const sessionRouter = express.Router();
const { SessionService } = require("../services/SessionService");
const { authenticate, authorize } = require("../middleware/auth");
const { mssqlDb } = require("../config/database");

// Create session (Students request, Tutors create)
sessionRouter.post("/", async (req, res) => {
  try {
    const { tutorId, studentId, dateTime, duration, topic, location } =
      req.body;

    // If studentId is missing (Tutor creating open session), we will default it to 0 in SQL.
    if (!tutorId || !dateTime || !duration) {
      return res.status(400).json({
        error: "Missing required fields (tutorId, dateTime, duration)",
      });
    }

    // Format Date for SQL Server
    const sqlDate = new Date(dateTime)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Use default '0' for studentId if not provided to satisfy NOT NULL constraint
    // Assuming '0' is a valid placeholder student ID in your database logic
    const safeStudentId = studentId || 0;

    // Use a Subquery to calculate the ID inside the INSERT statement.
    const insertQuery = `
      INSERT INTO buoi_hoc (buoi_hoc_Id, tutorId, studentId, thoi_gian, thoi_luong, topic, dia_diem, tien_do)
      VALUES (
        (SELECT ISNULL(MAX(buoi_hoc_Id), 0) + 1 FROM buoi_hoc),
        ${tutorId}, 
        ${safeStudentId}, 
        '${sqlDate}', 
        ${duration}, 
        N'${topic || ""}', 
        N'${location || ""}', 
        0
      )
    `;

    await mssqlDb.query(insertQuery);

    console.log(`Session created successfully by Tutor ${tutorId}`);

    // Return success response
    res.status(201).json({
      success: true,
      message: "Session created successfully",
      tutorId,
      studentId: safeStudentId,
      dateTime,
      status: "pending",
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all sessions (with filters)
sessionRouter.get("/", async (req, res) => {
  try {
    const { tutorId, studentId, status } = req.query;

    let sessions;

    if (tutorId) {
      sessions = await SessionService.getSessionsByTutor(parseInt(tutorId));
    } else if (studentId) {
      sessions = await SessionService.getSessionsByStudent(parseInt(studentId));
    } else {
      sessions = await SessionService.getAllSessions(status);
    }

    res.json(sessions || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get session by ID
sessionRouter.get("/:sessionId", async (req, res) => {
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
sessionRouter.get("/tutor/:tutorId", async (req, res) => {
  try {
    const { tutorId } = req.params;
    const sessions = await SessionService.getSessionsByTutor(parseInt(tutorId));
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's sessions
sessionRouter.get("/student/:studentId", async (req, res) => {
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
sessionRouter.get("/upcoming/:userId", async (req, res) => {
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
sessionRouter.get("/past/:userId", async (req, res) => {
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
sessionRouter.put("/:sessionId", async (req, res) => {
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
sessionRouter.put("/:sessionId/cancel", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;
    const cancelledBy = req.user ? req.user.id : 0;
    await SessionService.cancelSession(
      parseInt(sessionId),
      cancelledBy,
      reason
    );
    res.json({ message: "Session cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve session
sessionRouter.put("/:sessionId/approve", async (req, res) => {
  try {
    const { sessionId } = req.params;
    await SessionService.approveSession(parseInt(sessionId));
    res.json({ message: "Session approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject session
sessionRouter.put("/:sessionId/reject", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;
    await SessionService.rejectSession(parseInt(sessionId), reason);
    res.json({ message: "Session rejected successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get session statistics
sessionRouter.get("/stats/:tutorId", async (req, res) => {
  try {
    const { tutorId } = req.params;
    const stats = await SessionService.getSessionStatistics(parseInt(tutorId));
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = sessionRouter;
