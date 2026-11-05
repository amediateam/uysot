import axios from "axios";
import { API_BASE_URL } from "@/config";

// Shared axios client (recovered from the build). Cookie-based auth (withCredentials);
// on 401/403 it clears the session and reloads to bounce back to login.
export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    if ((status === 403 || status === 401) && config && !config._retry) {
      config._retry = true;
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("USER_NAME");
      location.reload();
    }
    return Promise.reject(error);
  },
);
