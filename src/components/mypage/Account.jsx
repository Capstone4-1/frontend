import { useEffect, useRef } from "react";
import "./Account.css";
import MyInfo from "./MyInfo";
import { useLocation } from "react-router-dom";

const Account = () => {
  const infoRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const focusSection = location.state?.focusSection;
    if (focusSection === "info" && infoRef.current) {
      infoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        infoRef.current?.focus();
      }, 400);
    }
  }, [location]);

  return (
    <div className="Account">
      <h2>계정 및 보안</h2>

      <nav className="account-nav">
        {/* 네비 버튼 필요하면 여기에 추가 */}
      </nav>

      <section tabIndex={-1} ref={infoRef} className="account-section">
        <MyInfo />
      </section>

      {/* 계정 관리 박스 제거하고 그냥 버튼만 */}
      <button
        className="delete-btn"
        onClick={() => {
          if (window.confirm("정말 회원 탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            // 탈퇴 처리
          }
        }}
      >
        회원 탈퇴
      </button>
    </div>
  );
};

export default Account;
