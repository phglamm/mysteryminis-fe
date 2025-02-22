import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const baseUrl = "https://localhost:7256/api/";
// const baseUrl =
//   "https://mysteryminis-b3are0btehhncpcx.australiacentral-01.azurewebsites.net/api/";

const config = {
  baseUrl,
  timeout: 3000000,
};
const api = axios.create(config);
api.defaults.baseURL = baseUrl;

const handleBefore = async (config) => {
  let accessToken = Cookies.get("accessToken")?.replaceAll('"', "");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

const handleError = (error) => {
  console.error("API Error:", error);
  return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
