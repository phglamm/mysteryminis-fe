import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000; // 3 hours
let lastRequestTime = Date.now(); 

const api = axios.create({
  baseURL: "http://localhost:5053/api", // Đổi baseUrl thành baseURL
  timeout: 3000000,
});

const handleBefore = async (config) => {
  let accessToken = Cookies.get("accessToken")?.replaceAll('"', "");

  if (accessToken) {
    const tokenExpiry = jwtDecode(accessToken).exp * 1000;
    if (Date.now() >= tokenExpiry) {
      try {
        const refreshToken = Cookies.get("refreshToken");
        const encodedRefreshToken = encodeURIComponent(refreshToken);
        
        // Kiểm tra backend có hỗ trợ HTTPS không
        const response = await axios.post(
          `http://localhost:7256/api/Authentication/refresh-token?refreshToken=${encodedRefreshToken}`
        );

        accessToken = response.data.token;
        Cookies.set("accessToken", response.data?.token, { expires: 7, secure: true });
        Cookies.set("refreshToken", response.data?.refreshToken, { expires: 7, secure: true });
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return Promise.reject(error);
      }
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  lastRequestTime = Date.now(); 
  return config;
};

const handleError = (error) => {
  console.error("API Error:", error);
  return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
