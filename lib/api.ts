// lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://smart-task-manager-server.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach x-auth-token automatically from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["x-auth-token"] = token;
    }
  }
  return config;
});
