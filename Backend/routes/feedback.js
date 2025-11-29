// ============================================
// routes/feedback.js - Complete Feedback Routes
// ============================================
const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const feedbackRouter = express.Router();
const { FeedbackService } = require("../services/FeedbackService");

// Submit feedback (Student only)
feedbackRouter.post(
  "/",
  authenticate,
  authorize("student"),
  async (req, res) => {
    try {
      const { studentId, tutorId, sessionId, rating, comments, isAnonymous } =
        req.body;

      if (!tutorId || !sessionId || !rating) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const feedback = await FeedbackService.addFeedback(
        studentId || req.user.id,
        tutorId,
        sessionId,
        rating,
        comments,
        isAnonymous
      );

      res.status(201).json(feedback);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get tutor's feedback
feedbackRouter.get("/tutor/:tutorId", authenticate, async (req, res) => {
  try {
    const { tutorId } = req.params;

    const feedbacks = await FeedbackService.getFeedbackForTutor(
      parseInt(tutorId)
    );

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get feedback for session
feedbackRouter.get("/session/:sessionId", authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const feedback = await FeedbackService.getFeedbackForSession(
      parseInt(sessionId)
    );

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tutor rating
feedbackRouter.get("/rating/:tutorId", authenticate, async (req, res) => {
  try {
    const { tutorId } = req.params;

    const rating = await FeedbackService.calculateTutorRating(
      parseInt(tutorId)
    );

    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get feedback stats
feedbackRouter.get("/stats/:tutorId", authenticate, async (req, res) => {
  try {
    const { tutorId } = req.params;

    const stats = await FeedbackService.getTutorFeedbackStats(
      parseInt(tutorId)
    );

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit feedback
feedbackRouter.put(
  "/:feedbackId",
  authenticate,
  authorize("student"),
  async (req, res) => {
    try {
      const { feedbackId } = req.params;
      const { rating, comments } = req.body;

      await FeedbackService.editFeedback(
        parseInt(feedbackId),
        rating,
        comments
      );

      res.json({ message: "Feedback updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete feedback
feedbackRouter.delete(
  "/:feedbackId",
  authenticate,
  authorize("student", "admin"),
  async (req, res) => {
    try {
      const { feedbackId } = req.params;

      await FeedbackService.deleteFeedback(parseInt(feedbackId));

      res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = feedbackRouter;
