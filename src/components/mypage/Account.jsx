// 계정 및 보안
import { useEffect, useRef } from "react";
import "./Account.css";
import MyInfo from "./MyInfo";
import CommunityRules from "./CommunityRules";
import { useLocation } from "react-router-dom";

const Account = () => {
  const infoRef = useRef(null);
  const rulesRef = useRef(null);
  const deleteRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const focusSection = location.state?.focusSection;

    const target =
      focusSection === "info" ? infoRef.current :
      focusSection === "rules" ? rulesRef.current :
      focusSection === "delete" ? deleteRef.current :
      null;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => target?.focus?.(), 400);
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

      <section
        tabIndex={-1}
        ref={rulesRef}
        className="account-section"
        aria-label="커뮤니티 이용규칙"
      >
        <CommunityRules />
      </section>

      <button
        ref={deleteRef}
        tabIndex={-1}
        className="delete-btn"
        onClick={() => {
          if (window.confirm("정말 회원 탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
          }
        }}
        aria-label="회원 탈퇴"
      >
        회원 탈퇴
      </button>
    </div>
  );
};

export default Account;
