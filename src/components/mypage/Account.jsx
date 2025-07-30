import { useContext, useEffect, useRef } from "react";
import "./Account.css";
import { UserContext } from "../utils/UserContext";
import MyInfo from "./MyInfo";
import { useLocation } from "react-router-dom";

const Account = () => {
  const infoRef = useRef(null);
  const accountRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const focusSection = location.state?.focusSection;
    if (!focusSection) return;

    const scrollTarget = focusSection === "info" ? infoRef : accountRef;

    if (scrollTarget.current) {
      // 부드럽게 스크롤
      scrollTarget.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        scrollTarget.current?.focus();
      }, 400);
    }
  }, [location]);

  return (
    <div className="Account">
      <h2>계정 및 보안</h2>

      <nav className="account-nav">
       
      </nav>

      <section tabIndex={-1} ref={infoRef} className="account-section">
        <MyInfo />
      </section>

      <section tabIndex={-1} ref={accountRef} className="account-section">
        <h3>계정 관리</h3>
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
      </section>
    </div>
  );
};

export default Account;
