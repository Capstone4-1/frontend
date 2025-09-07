import { useState } from "react";
import axios from "axios"; // 일반 axios import

const HealthCheckSection = () => {
  const [status, setStatus] = useState(""); // 서버 응답 상태 표시

  const handleHealthCheck = async () => {
    try {
      const response = await axios.get("http://15.164.171.42:8080/health"); // 일반 axios 사용
      setStatus(response.data); // 서버 응답 바디
      alert(`서버 응답: ${response.data}`); // 200 OK 확인
      console.log(response.data)
    } catch (error) {
      console.error(error);
      setStatus("요청 중 오류 발생");
      alert("요청 중 오류 발생");
    }
  };

  return (
    <div className="health-check-section">
      <h2>서버 헬스체크 테스트</h2>

      <div>
        <button onClick={handleHealthCheck}>헬스체크 요청</button>
      </div>

      {status && <p>서버 상태: {status}</p>}
    </div>
  );
};

export default HealthCheckSection;
