import axios from "axios";

const normalizeApiUrl = (url) => {
  if (!url) {
    return "/api";
  }

  const trimmedUrl = url.trim().replace(/\/+$/, "");

  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
};

const api = axios.create({
  baseURL: normalizeApiUrl(process.env.REACT_APP_API_URL),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("task_manager_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
