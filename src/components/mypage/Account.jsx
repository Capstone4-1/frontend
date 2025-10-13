import { useEffect, useRef } from "react";
import "./Account.css";
import MyInfo from "./MyInfo";
import Inquiry from "./Inquiry";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/AxiosInstance";
const Account = () => {
  const infoRef = useRef(null);
  const inquiryRef = useRef(null);
  const deleteRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const focusSection = location.state?.focusSection;

    const target =
      focusSection === "info"
        ? infoRef.current
        : focusSection === "inquiry"
        ? inquiryRef.current
        : focusSection === "delete"
        ? deleteRef.current
        : null;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => target?.focus?.(), 400);
    }
  }, [location]);

  // 🔥 회원 탈퇴 요청
  const handleWithdraw = async () => {
    if (
      window.confirm(
        "정말 회원 탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        await axiosInstance.post("/member/withdraw");

        // ✅ 로컬 토큰 제거
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        alert("회원 탈퇴가 완료되었습니다.");
        navigate("/"); // 홈으로 이동
      } catch (err) {
        console.error("회원 탈퇴 실패:", err);
        alert("회원 탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="Account">
      <h2>계정 및 보안</h2>

      <section tabIndex={-1} ref={infoRef} className="account-section">
        <MyInfo />
      </section>

      <section tabIndex={-1} ref={inquiryRef} className="account-section">
        <Inquiry />
      </section>

      <button
        ref={deleteRef}
        tabIndex={-1}
        className="delete-btn"
        onClick={handleWithdraw}
        aria-label="회원 탈퇴"
      >
        회원 탈퇴
      </button>
    </div>
  );
};

export default Account;
