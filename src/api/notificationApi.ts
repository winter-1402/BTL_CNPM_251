// ============================================
// src/api/notificationApi.ts - Notification API
// ============================================
import axios from "./axios";

export const notificationApi = {
  getNotifications: async (unreadOnly: boolean = false) => {
    const response = await axios.get("/notifications", {
      params: { unreadOnly },
    });
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await axios.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axios.put("/notifications/read-all");
    return response.data;
  },

  deleteNotification: async (notificationId: string) => {
    const response = await axios.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};
