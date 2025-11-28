// ============================================
// models/Feedback.js - Complete Feedback Model
// ============================================

class Feedback {
  constructor(
    feedbackId,
    studentId,
    tutorId,
    sessionId,
    rating,
    comments = null
  ) {
    this.feedbackId = feedbackId;
    this.studentId = studentId;
    this.tutorId = tutorId;
    this.sessionId = sessionId;
    this.rating = rating; // 1-5 stars
    this.comments = comments;
    this.date = new Date();
    this.isAnonymous = false;
    this.tutorResponse = null;
  }

  async submitFeedback() {
    try {
      // Validate rating
      if (this.rating < 1 || this.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      const data = {
        student_id: this.isAnonymous ? null : this.studentId,
        tutor_id: this.tutorId,
        session_id: this.sessionId,
        rating: this.rating,
        comments: this.comments,
        is_anonymous: this.isAnonymous,
        submitted_at: this.date,
      };

      const result = await db.storeData("feedback", data);
      this.feedbackId = result.id;

      // Update tutor rating
      const FeedbackService =
        require("../services/FeedbackService").FeedbackService;
      await FeedbackService.updateTutorRating(this.tutorId);

      // Notify tutor
      const NotificationService =
        require("../services/NotificationService").NotificationService;
      await NotificationService.sendNotification(
        this.tutorId,
        "You have received new feedback",
        "new_feedback"
      );

      return true;
    } catch (error) {
      console.error("Submit feedback error:", error);
      throw error;
    }
  }

  async editFeedback(newRating, newComments) {
    try {
      if (newRating < 1 || newRating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      this.rating = newRating;
      this.comments = newComments;

      await db.updateData("feedback", this.feedbackId, {
        rating: newRating,
        comments: newComments,
        updated_at: new Date(),
      });

      // Update tutor rating
      const FeedbackService =
        require("../services/FeedbackService").FeedbackService;
      await FeedbackService.updateTutorRating(this.tutorId);

      return true;
    } catch (error) {
      console.error("Edit feedback error:", error);
      throw error;
    }
  }

  async delete() {
    try {
      await db.deleteData("feedback", this.feedbackId);

      // Update tutor rating
      const FeedbackService =
        require("../services/FeedbackService").FeedbackService;
      await FeedbackService.updateTutorRating(this.tutorId);

      return true;
    } catch (error) {
      console.error("Delete feedback error:", error);
      throw error;
    }
  }

  async addTutorResponse(response) {
    try {
      this.tutorResponse = response;

      await db.updateData("feedback", this.feedbackId, {
        tutor_response: response,
        responded_at: new Date(),
      });

      // Notify student if not anonymous
      if (!this.isAnonymous) {
        const NotificationService =
          require("../services/NotificationService").NotificationService;
        await NotificationService.sendNotification(
          this.studentId,
          "Your tutor has responded to your feedback",
          "feedback_response"
        );
      }

      return true;
    } catch (error) {
      console.error("Add tutor response error:", error);
      throw error;
    }
  }
}

module.exports = { Feedback };
