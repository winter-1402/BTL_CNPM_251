import axios from "./axios";

export const authApi = {
  login: async (email, password) => {
    const response = await axios.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (name, email, password, role = "student") => {
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

  getCurrentUser: async () => {
    const response = await axios.get("/auth/me");
    return response.data;
  },
};
