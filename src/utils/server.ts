
// api/server.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
export const server = axios.create({
  // baseURL: API_URL,
  baseURL: "https://f66159d2d645.ngrok-free.app",
  responseType: "json",
});


server.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});