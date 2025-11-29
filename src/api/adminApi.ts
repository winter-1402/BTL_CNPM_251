// ============================================
// src/api/adminApi.ts - Admin API
// ============================================
import axios from "./axios";

export const adminApi = {
  // User Management
  getAllUsers: async () => {
    const response = await axios.get("/admin/users");
    return response.data;
  },

  createUser: async (userData: {
    name: string;
    email: string;
    role: string;
    faculty?: string;
  }) => {
    const response = await axios.post("/admin/users", userData);
    return response.data;
  },

  updateUser: async (userId: string, updates: any) => {
    const response = await axios.put(`/admin/users/${userId}`, updates);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await axios.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Data Sync
  syncWithDataCore: async () => {
    const response = await axios.post("/admin/sync/datacore");
    return response.data;
  },

  // Reports
  generateUsageReport: async (startDate: string, endDate: string) => {
    const response = await axios.post("/reports/usage", { startDate, endDate });
    return response.data;
  },

  generateSystemReport: async () => {
    const response = await axios.post("/reports/system");
    return response.data;
  },

  // System Config
  updateSystemConfig: async (config: any) => {
    const response = await axios.put("/admin/config", config);
    return response.data;
  },

  performBackup: async () => {
    const response = await axios.post("/admin/backup");
    return response.data;
  },

  restoreBackup: async () => {
    const response = await axios.post("/admin/restore");
    return response.data;
  },
};
