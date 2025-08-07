// src/api/AxiosInstance.js
import axios from "axios";
import refreshAccessToken from "./refreshAccessToken";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 시 accessToken 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 (토큰 만료 처리)
axiosInstance.interceptors.response.use(
  (response) => response, // 정상 응답 그대로
  async (error) => {
    const originalRequest = error.config;

    // 액세스 토큰 만료 에러인지 확인
    const isExpired =
      error.response?.status === 401 &&
      error.response?.data?.error === "TOKEN_EXPIRED";

    // 중복 재시도 방지 (_retry 플래그)
    if (isExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // 🔁 재요청
      } catch (refreshError) {
        // refreshAccessToken에서 처리됨
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
