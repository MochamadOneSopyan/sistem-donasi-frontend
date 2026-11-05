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

export default API;
