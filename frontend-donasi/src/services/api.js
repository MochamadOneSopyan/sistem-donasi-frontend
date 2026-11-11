import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://sistem-donasi-backend-production.up.railway.app/api" : "http://localhost:3000/api"),
});

// Interceptor: Otomatis tempelkan Token JWT jika user sudah login
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && error.config?.headers?.Authorization) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-updated"));
    window.dispatchEvent(new Event("auth-expired"));
  }
  return Promise.reject(error);
});

export default API;
