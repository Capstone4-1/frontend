import "./MobileMenu.css";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import DailyMenu from "./DailyMenu"; // ✅ 메인에 쓰던 위젯 불러오기

function MobileMenu({ isOpen, onClose, user, onLogout, newMailCount }) {
  const [dietOpen, setDietOpen] = useState(false); // ✅ 식단 모달 상태

  return (
    <>
      <div
        className={`m-gnb ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="m-gnb-header">
          <Link to="/main" className="m-gnb-logo" onClick={onClose}>
            <img src="/icons/logo.svg" alt="로고" />
          </Link>
          <button className="m-gnb-close" aria-label="닫기" onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <div className="m-gnb-section" role="none">
          <Link
            to={user ? "/mypage" : "/login"}
            className="m-gnb-login"
            onClick={onClose}
          >
            {user ? "마이페이지" : "로그인"}
          </Link>
        </div>

        <div className="m-gnb-divider" />

        {/* 커뮤니티 */}
        <div className="m-gnb-group">
          <div className="m-gnb-group-title">커뮤니티</div>
          <Link to="/main/community/popular" className="m-gnb-item" onClick={onClose}>인기 게시판</Link>
          <Link to="/main/community/free" className="m-gnb-item" onClick={onClose}>자유 게시판</Link>
          <Link to="/main/community/secret" className="m-gnb-item" onClick={onClose}>비밀 게시판</Link>
          <Link to="/main/community/review" className="m-gnb-item" onClick={onClose}>후기 게시판</Link>
        </div>

        {/* 공지/장터 */}
        <div className="m-gnb-group">
          <div className="m-gnb-group-title">공지/장터</div>
          <Link to="/main/community/notice_c" className="m-gnb-item" onClick={onClose}>공지사항</Link>
          <Link to="/main/community/notice"   className="m-gnb-item" onClick={onClose}>조교알림</Link>
          <Link to="/main/community/market"   className="m-gnb-item" onClick={onClose}>책 장터</Link>

          {/* ✅ 링크 대신 버튼으로 교체 */}
          <button
            type="button"
            className="m-gnb-item"
            onClick={() => { onClose(); setDietOpen(true); }}
          >
            식단
          </button>
        </div>

        {/* 서비스 */}
        <div className="m-gnb-group">
          <div className="m-gnb-group-title">서비스</div>
          <Link to="/main/study-dashboard" className="m-gnb-item" onClick={onClose}>스터디룸</Link>
          <Link to="/chat-mail" className="m-gnb-item" onClick={onClose}>
            메일함{newMailCount > 0 ? ` (${newMailCount})` : ""}
          </Link>
          <Link className="m-gnb-item" onClick={onClose}>친구</Link>
        </div>

        {user && (
          <div className="m-gnb-actions">
            <button
              className="m-gnb-logout"
              onClick={() => {
                onClose();
                onLogout();
              }}
            >
              로그아웃
            </button>
          </div>
        )}
      </div>

      <div className={`m-gnb-backdrop ${isOpen ? "show" : ""}`} onClick={onClose} />

      {/* ✅ 식단 모달 */}
      {dietOpen && (
        <div className="diet-modal">
          <div className="diet-modal__header">
            <strong>식단</strong>
            <button onClick={() => setDietOpen(false)}>닫기</button>
          </div>
          <div className="diet-modal__body">
            <DailyMenu />
          </div>
        </div>
      )}
    </>
  );
}

export default MobileMenu;
