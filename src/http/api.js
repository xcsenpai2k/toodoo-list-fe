import axios from "axios";
import { useAuthStore } from '../stores/auth';
axios.defaults.withCredentials = true;


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.getAuthToken();

  if (token) {
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }

  return config;
});

export default api;
