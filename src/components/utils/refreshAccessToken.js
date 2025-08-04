import axios from "axios";
import axiosInstance from "./AxiosInstance";
const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post("/auth/refresh", {
      refreshToken: localStorage.getItem("refreshToken"),
    });

    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    console.log("Access Token 리프레시 성공");
    return response.data.accessToken;
  } catch (error) {
    console.log("리프레시 토큰 요청 실패", error);
    throw error;
  }
};

export default refreshAccessToken;






