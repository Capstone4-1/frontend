import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/utils/AxiosInstance";
import { useState } from "react";

const WithdrawSection = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // 테스트할 이메일 입력값

  const handleTestRequest = async () => {
    try {
      const response = await axiosInstance.post("/auth/email-check", {
        email: email, // MailDto의 email 필드
      });
      alert(`서버 응답: ${response.data}`); // 인증 코드 or 메시지 표시
    } catch (error) {
      console.error(error);
      alert("요청 중 오류 발생");
    }
  };

  return (
    <div className="withdraw-section">
      <h2>회원 탈퇴</h2>

      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div>
        <button onClick={handleTestRequest}>테스트 요청</button>
      </div>
    </div>
  );
};

export default WithdrawSection;
