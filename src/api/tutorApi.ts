// ============================================
// src/api/tutorApi.ts - Tutor API
// ============================================
import axios from "./axios";
import { Tutor } from "../App";

export const tutorApi = {
  getAllTutors: async () => {
    const response = await axios.get("/tutors");
    return response.data;
  },

  getTutorById: async (tutorId: string) => {
    const response = await axios.get(`/tutors/${tutorId}`);
    return response.data;
  },

  searchTutors: async (query: string, faculty?: string) => {
    const response = await axios.get("/tutors/search", {
      params: { query, faculty },
    });
    return response.data;
  },

  updateAvailability: async (tutorId: string, availability: string) => {
    const response = await axios.put(`/tutors/${tutorId}/availability`, {
      availability,
    });
    return response.data;
  },

  addAvailabilitySlot: async (
    tutorId: string,
    slot: {
      day: string;
      startTime: string;
      endTime: string;
    }
  ) => {
    const response = await axios.post(
      `/tutors/${tutorId}/availability/slots`,
      slot
    );
    return response.data;
  },

  removeAvailabilitySlot: async (tutorId: string, slotId: string) => {
    const response = await axios.delete(
      `/tutors/${tutorId}/availability/slots/${slotId}`
    );
    return response.data;
  },
};
