// src/api/refreshAccessToken.js
import axios from "axios";

// 인터셉터 없는 순수 인스턴스 사용
const rawAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await rawAxios.post("/auth/refresh", {
      refreshToken: localStorage.getItem("refreshToken"),
    });
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    console.log("✅ Access Token 리프레시 성공");

    return accessToken;
  } catch (error) {
    console.error("❌ 리프레시 토큰 요청 실패", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    throw error;
  }
};

export default refreshAccessToken;
