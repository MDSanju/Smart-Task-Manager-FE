import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!config.headers) config.headers = {} as any;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers["x-auth-token"] = token;
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    console.error(err);
  }
  return config;
});

export default api;
