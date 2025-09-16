// api/server.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addPlugin } from "react-native-flipper";

export const server = axios.create({
  baseURL: "http://192.168.0.113:8000",
  responseType: "json",
});

// Attach token
server.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔌 Flipper custom plugin
if (__DEV__) {
  addPlugin({
    getId: () => "axios-logger",
    onConnect(connection) {
      server.interceptors.request.use((request) => {
        connection.send("request", {
          url: request.url,
          method: request.method,
          data: request.data,
          headers: request.headers,
        });
        return request;
      });

      server.interceptors.response.use((response) => {
        connection.send("response", {
          url: response.config.url,
          status: response.status,
          data: response.data,
        });
        return response;
      });
    },
    onDisconnect() {},
    runInBackground: () => true,
  });
}
