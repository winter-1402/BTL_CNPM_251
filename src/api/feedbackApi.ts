// ============================================
// src/api/feedbackApi.ts - Feedback API
// ============================================
import axios from './axios';

export const feedbackApi = {
  submitFeedback: async (feedbackData: {
    studentId: string;
    tutorId: string;
    sessionId: string;
    rating: number;
    comments: string;
    isAnonymous?: boolean;
  }) => {
    const response = await axios.post('/feedback', feedbackData);
    return response.data;
  },

  getTutorFeedback: async (tutorId: string) => {
    const response = await axios.get(`/feedback/tutor/${tutorId}`);
    return response.data;
  },

  getSessionFeedback: async (sessionId: string) => {
    const response = await axios.get(`/feedback/session/${sessionId}`);
    return response.data;
  },

  getTutorRating: async (tutorId: string) => {
    const response = await axios.get(`/feedback/rating/${tutorId}`);
    return response.data;
  },

  getFeedbackStats: async (tutorId: string) => {
    const response = await axios.get(`/feedback/stats/${tutorId}`);
    return response.data;
  },

  editFeedback: async (feedbackId: string, rating: number, comments: string) => {
    const response = await axios.put(`/feedback/${feedbackId}`, { rating, comments });
    return response.data;
  },

  deleteFeedback: async (feedbackId: string) => {
    const response = await axios.delete(`/feedback/${feedbackId}`);
    return response.data;
  },
};
