import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
// const INACTIVITY_TIMEOUT = 1 * 2 * 60 * 1000; // 3 hours in milliseconds

let lastRequestTime = Date.now(); // Track the last request time
const baseUrl = "https://localhost:7256/api/";
const config = {
  baseUrl,
  timeout: 3000000,
};
const api = axios.create(config);
api.defaults.baseURL = baseUrl;

const handleBefore = async (config) => {
  let accessToken = Cookies.get("accessToken")?.replaceAll('"', "");
  // const timeSinceLastRequest = Date.now() - lastRequestTime;
  // if (timeSinceLastRequest > INACTIVITY_TIMEOUT) {
  //   // If inactivity period exceeds the threshold, log the user out
  //   console.log("User has been inactive for more than 3 hours. Logging out.");
  //   Cookies.remove("accessToken");
  //   Cookies.remove("refreshToken");
  //   return Promise.reject("User logged out due to inactivity.");
  // }
  // if (accessToken) {
  //   const tokenExpiry = jwtDecode(accessToken).exp * 1000;
  //   if (Date.now() >= tokenExpiry) {
  //     try {
  //       const refreshToken = Cookies.get("refreshToken");

  //       const encodedRefreshToken = encodeURIComponent(refreshToken);
  //       const response = await axios.post(
  //         `https://localhost:7256/api/Authentication/refresh-token?refreshToken=${encodedRefreshToken}`
  //       );
  //       console.log(response);
  //       accessToken = response.data.token;
  //       Cookies.set("accessToken", response.data?.token, {
  //         expires: 7,
  //         secure: true,
  //       }); // Expires in 7 days
  //       Cookies.set("refreshToken", response.data?.refreshToken, {
  //         expires: 7,
  //         secure: true,
  //       });
  //     } catch (error) {
  //       console.error("Failed to refresh token:", error);
  //       return Promise.reject(error);
  //     }
  //     // Refresh the token
  //   }
  // }
  config.headers.Authorization = `Bearer ${accessToken}`;
  lastRequestTime = Date.now(); // Update the last request time
  return config;
};
const handleError = (error) => {
  console.log(error);
  return;
};
api.interceptors.request.use(handleBefore, handleError);
export default api;
