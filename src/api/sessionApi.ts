/// ============================================
// src/api/sessionApi.ts
// ============================================
import axios from "./axios";
import { Session } from "../App";

export const sessionApi = {
  // Create a new session (POST /api/sessions)
  createSession: async (sessionData: {
    tutorId: string;
    studentId?: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    duration: number;
    subject: string;
    location?: string;
    meetingLink?: string;
    notes?: string;
  }) => {
    try {
      // Construct ISO dateTime string
      const dateTime = new Date(
        `${sessionData.date}T${sessionData.time}:00`
      ).toISOString();

      const response = await axios.post("/sessions", {
        tutorId: sessionData.tutorId,
        studentId: sessionData.studentId, // Can be undefined/empty
        dateTime: dateTime,
        duration: sessionData.duration,
        topic: sessionData.subject,
        location: sessionData.meetingLink || sessionData.location,
        notes: sessionData.notes,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  },

  // Get all sessions with filters (GET /api/sessions)
  getAllSessions: async (filters?: {
    tutorId?: string;
    studentId?: string;
    status?: string;
  }) => {
    try {
      const response = await axios.get("/sessions", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching all sessions:", error);
      throw error;
    }
  },

  // Get upcoming sessions (GET /api/sessions/upcoming/:userId)
  getUpcomingSessions: async (userId: string, role: string) => {
    try {
      const response = await axios.get(`/sessions/upcoming/${userId}`, {
        params: { role },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);
      throw error;
    }
  },

  // Get past sessions (GET /api/sessions/past/:userId)
  getPastSessions: async (userId: string, role: string) => {
    try {
      const response = await axios.get(`/sessions/past/${userId}`, {
        params: { role },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching past sessions:", error);
      throw error;
    }
  },

  // Cancel session (PUT /api/sessions/:sessionId/cancel)
  cancelSession: async (sessionId: string, reason?: string) => {
    try {
      const response = await axios.put(`/sessions/${sessionId}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error cancelling session:", error);
      throw error;
    }
  },

  // Approve session (PUT /api/sessions/:sessionId/approve)
  approveSession: async (sessionId: string) => {
    try {
      const response = await axios.put(`/sessions/${sessionId}/approve`);
      return response.data;
    } catch (error) {
      console.error("Error approving session:", error);
      throw error;
    }
  },

  // Reject session (PUT /api/sessions/:sessionId/reject)
  rejectSession: async (sessionId: string, reason?: string) => {
    try {
      const response = await axios.put(`/sessions/${sessionId}/reject`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error rejecting session:", error);
      throw error;
    }
  },

  // Get session stats (GET /api/sessions/stats/:tutorId)
  getSessionStats: async (tutorId: string) => {
    try {
      const response = await axios.get(`/sessions/stats/${tutorId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching session stats:", error);
      throw error;
    }
  },
};
