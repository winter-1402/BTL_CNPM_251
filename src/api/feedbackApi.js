import axios from "./axios";

export const feedbackApi = {
  submitFeedback: async (feedbackData) => {
    const response = await axios.post("/feedback", feedbackData);
    return response.data;
  },

  getTutorFeedback: async (tutorId) => {
    const response = await axios.get(`/feedback/tutor/${tutorId}`);
    return response.data;
  },
};
