// src/api/AxiosInstance.js
import axios from "axios";
import refreshAccessToken from "./refreshAccessToken";

// 개발 환경 체크
const isDev = import.meta.env.MODE === "development";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 요청 시 accessToken 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 동시 요청 처리용
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log(`📥 [${response.data.message || "No message"}]`, {
        url: response.config?.url,
        method: response.config?.method,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (isDev) {
      console.error("❌ [Axios Error Response]", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    const isExpired =
      error.response?.status === 401 &&
      error.response?.data?.error === "TOKEN_EXPIRED";

    if (isExpired) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      } else {
        // 리프레시 중이면 대기
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
