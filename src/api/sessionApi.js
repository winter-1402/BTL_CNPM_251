import axios from "./axios";

export const sessionApi = {
  createSession: async (sessionData) => {
    const response = await axios.post("/sessions", sessionData);
    return response.data;
  },

  getTutorSessions: async (tutorId) => {
    const response = await axios.get(`/sessions/tutor/${tutorId}`);
    return response.data;
  },

  getStudentSessions: async (studentId) => {
    const response = await axios.get(`/sessions/student/${studentId}`);
    return response.data;
  },

  cancelSession: async (sessionId, reason) => {
    const response = await axios.put(`/sessions/${sessionId}/cancel`, {
      reason,
    });
    return response.data;
  },

  approveSession: async (sessionId) => {
    const response = await axios.put(`/sessions/${sessionId}/approve`);
    return response.data;
  },
};
