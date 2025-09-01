// api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

try {
  const debuggerHost =
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    host = debuggerHost.split(":").shift();
  }
} catch (e) {
  console.warn("⚠️ Could not detect Expo debuggerHost:", e.message);
}

export const BASE_URL = "http://10.0.2.2:8000";

console.log("🌍 Using BASE_URL:", BASE_URL);

// ---- AXIOS INSTANCE ----
const api = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ---- REQUEST INTERCEPTOR ----
api.interceptors.request.use(async (config) => {
  const url = (config.url || "").replace(/^\//, "");

  const noAuthPaths = new Set([
    "token/",
    "token/refresh/",
    "auth/login/",
    "auth/refresh/",
  ]);

  if (noAuthPaths.has(url)) {
    if (config.headers?.Authorization) delete config.headers.Authorization;
    return config;
  }

  const token = await AsyncStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- RESPONSE INTERCEPTOR ----
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, newToken = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newToken);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    if (status !== 401 || original._retry) return Promise.reject(error);

    const url = (original.url || "").replace(/^\//, "");
    const isRefreshCall = url === "token/refresh/" || url === "auth/refresh/";
    if (isRefreshCall) {
      await AsyncStorage.multiRemove(["access", "refresh"]);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refresh = await AsyncStorage.getItem("refresh");
      if (!refresh) throw new Error("No refresh token");

      const r = await api.post(
        "token/refresh/",
        { refresh },
        { headers: { Authorization: "" } }
      );

      const newAccess = r.data?.access;
      if (!newAccess) throw new Error("No access token in refresh response");

      await AsyncStorage.setItem("access", newAccess);
      processQueue(null, newAccess);

      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (e) {
      processQueue(e, null);
      await AsyncStorage.multiRemove(["access", "refresh"]);
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
