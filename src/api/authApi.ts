// ============================================
// src/api/authApi.ts - Authentication API
// ============================================
import axios from "./axios";
import { User, UserRole } from "../App";

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await axios.post("/auth/login", { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "student"
  ) => {
    const response = await axios.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },

  logout: async () => {
    await axios.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get("/auth/me");
    return response.data;
  },

  resetPassword: async (email: string) => {
    const response = await axios.post("/auth/reset-password", { email });
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await axios.post("/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};
