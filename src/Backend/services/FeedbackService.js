// ============================================
// services/FeedbackService.js - Complete Implementation
// ============================================

const { Feedback } = require("../models/Feedback");

class FeedbackService {
  static async addFeedback(
    studentId,
    tutorId,
    sessionId,
    rating,
    comments,
    isAnonymous = false
  ) {
    try {
      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      // Check if session exists and is completed
      const session = await db.queryData("sessions", { id: sessionId });

      if (session.length === 0) {
        throw new Error("Session not found");
      }

      if (session[0].status !== SessionStatus.COMPLETED) {
        throw new Error("Can only provide feedback for completed sessions");
      }

      // Check if feedback already exists
      const existing = await db.queryData("feedback", {
        session_id: sessionId,
        student_id: studentId,
      });

      if (existing.length > 0) {
        throw new Error("Feedback already submitted for this session");
      }

      // Create feedback
      const feedbackData = {
        student_id: isAnonymous ? null : studentId,
        tutor_id: tutorId,
        session_id: sessionId,
        rating: rating,
        comments: comments,
        is_anonymous: isAnonymous,
        submitted_at: new Date(),
      };

      const result = await db.storeData("feedback", feedbackData);

      const feedback = new Feedback(
        result.id,
        studentId,
        tutorId,
        sessionId,
        rating,
        comments
      );
      feedback.isAnonymous = isAnonymous;

      // Update tutor rating
      await this.updateTutorRating(tutorId);

      // Send notification
      const NotificationService =
        require("./NotificationService").NotificationService;
      await NotificationService.sendNotification(
        tutorId,
        "You have received new feedback",
        "new_feedback"
      );

      console.log(`Feedback ${feedback.feedbackId} added successfully`);
      return feedback;
    } catch (error) {
      console.error("Error adding feedback:", error);
      throw error;
    }
  }

  static async getFeedbackForTutor(tutorId) {
    try {
      const feedbacks = await db.queryData("feedback", { tutor_id: tutorId });
      return feedbacks;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      throw error;
    }
  }

  static async getFeedbackForSession(sessionId) {
    try {
      const feedbacks = await db.queryData("feedback", {
        session_id: sessionId,
      });
      return feedbacks[0] || null;
    } catch (error) {
      console.error("Error fetching session feedback:", error);
      throw error;
    }
  }

  static async calculateTutorRating(tutorId) {
    try {
      const result = await db.query(
        `
        SELECT AVG(rating) as avg_rating, COUNT(*) as feedback_count
        FROM feedback
        WHERE tutor_id = $1
      `,
        [tutorId]
      );

      return {
        avgRating: parseFloat(result[0].avg_rating) || 0.0,
        feedbackCount: parseInt(result[0].feedback_count) || 0,
      };
    } catch (error) {
      console.error("Error calculating rating:", error);
      throw error;
    }
  }

  static async updateTutorRating(tutorId) {
    try {
      const { avgRating } = await this.calculateTutorRating(tutorId);

      await db.updateData("tutors", tutorId, {
        rating: avgRating,
      });

      console.log(`Tutor ${tutorId} rating updated to ${avgRating}`);
      return avgRating;
    } catch (error) {
      console.error("Error updating tutor rating:", error);
      throw error;
    }
  }

  static async editFeedback(feedbackId, newRating, newComments) {
    try {
      const feedback = await db.queryData("feedback", { id: feedbackId });

      if (feedback.length === 0) {
        throw new Error("Feedback not found");
      }

      await db.updateData("feedback", feedbackId, {
        rating: newRating,
        comments: newComments,
        updated_at: new Date(),
      });

      // Update tutor rating
      await this.updateTutorRating(feedback[0].tutor_id);

      console.log(`Feedback ${feedbackId} updated successfully`);
      return { success: true, message: "Feedback updated successfully" };
    } catch (error) {
      console.error("Error editing feedback:", error);
      throw error;
    }
  }

  static async deleteFeedback(feedbackId) {
    try {
      const feedback = await db.queryData("feedback", { id: feedbackId });

      if (feedback.length === 0) {
        throw new Error("Feedback not found");
      }

      const tutorId = feedback[0].tutor_id;

      await db.deleteData("feedback", feedbackId);

      // Update tutor rating
      await this.updateTutorRating(tutorId);

      console.log(`Feedback ${feedbackId} deleted successfully`);
      return { success: true, message: "Feedback deleted successfully" };
    } catch (error) {
      console.error("Error deleting feedback:", error);
      throw error;
    }
  }

  static async getTutorFeedbackStats(tutorId) {
    try {
      const stats = await db.query(
        `
        SELECT 
          COUNT(*) as total_feedback,
          AVG(rating) as avg_rating,
          COUNT(CASE WHEN rating = 5 THEN 1 END) as five_stars,
          COUNT(CASE WHEN rating = 4 THEN 1 END) as four_stars,
          COUNT(CASE WHEN rating = 3 THEN 1 END) as three_stars,
          COUNT(CASE WHEN rating = 2 THEN 1 END) as two_stars,
          COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
        FROM feedback
        WHERE tutor_id = $1
      `,
        [tutorId]
      );

      return stats[0];
    } catch (error) {
      console.error("Error getting feedback stats:", error);
      throw error;
    }
  }
}

module.exports = { FeedbackService };
