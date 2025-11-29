// ============================================
// src/api/sessionApi.ts - Session API
// ============================================
import axios from './axios';
import { Session } from '../App';

export const sessionApi = {
  createSession: async (sessionData: Partial<Session>) => {
    const response = await axios.post('/sessions', {
      tutorId: sessionData.tutorId,
      studentId: sessionData.studentId,
      dateTime: new Date(`${sessionData.date} ${sessionData.time}`).toISOString(),
      duration: sessionData.duration,
      topic: sessionData.subject,
      location: sessionData.location,
      meetingLink: sessionData.meetingLink,
      notes: sessionData.notes,
    });
    return response.data;
  },

  getAllSessions: async (filters?: { tutorId?: string; studentId?: string; status?: string }) => {
    const response = await axios.get('/sessions', { params: filters });
    return response.data;
  },

  getSessionById: async (sessionId: string) => {
    const response = await axios.get(`/sessions/${sessionId}`);
    return response.data;
  },

  getTutorSessions: async (tutorId: string) => {
    const response = await axios.get(`/sessions/tutor/${tutorId}`);
    return response.data;
  },

  getStudentSessions: async (studentId: string) => {
    const response = await axios.get(`/sessions/student/${studentId}`);
    return response.data;
  },

  getUpcomingSessions: async (userId: string, role: string) => {
    const response = await axios.get(`/sessions/upcoming/${userId}`, { params: { role } });
    return response.data;
  },

  getPastSessions: async (userId: string, role: string) => {
    const response = await axios.get(`/sessions/past/${userId}`, { params: { role } });
    return response.data;
  },

  updateSession: async (sessionId: string, updates: Partial<Session>) => {
    const response = await axios.put(`/sessions/${sessionId}`, updates);
    return response.data;
  },

  cancelSession: async (sessionId: string, reason?: string) => {
    const response = await axios.put(`/sessions/${sessionId}/cancel`, { reason });
    return response.data;
  },

  approveSession: async (sessionId: string) => {
    const response = await axios.put(`/sessions/${sessionId}/approve`);
    return response.data;
  },

  rejectSession: async (sessionId: string, reason?: string) => {
    const response = await axios.put(`/sessions/${sessionId}/reject`, { reason });
    return response.data;
  },

  getSessionStats: async (tutorId: string) => {
    const response = await axios.get(`/sessions/stats/${tutorId}`);
    return response.data;
  },
};
