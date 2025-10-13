import { Link } from "react-router-dom";
import "./AdminPanel.css";
import { useContext } from "react";
import { UserContext } from "./utils/UserContext";
const AdminPanel = ({ onSelect }) => {

  const { hasRole } = useContext(UserContext)

  const isAdmin = hasRole("ADMIN");
   return (
    <div className="AdminPanel">
      <Link to="/main" className="home-link">❮ HOME</Link>

      <h3>관리자 메뉴</h3>
      <button onClick={() => onSelect("STATUS")}>사이트 통계</button>
      <button onClick={() => onSelect("POSTS")}>게시글, 댓글 관리</button>
      <button onClick={() => onSelect("BANNER")}>배너 관리</button>

      {/* 회원 관리 - 관리자만 활성화 */}
      <button
        onClick={() => isAdmin && onSelect("ROLES")}
        disabled={!isAdmin}
      >
        회원 관리
      </button>

      {/* 문의 내역 - 관리자만 활성화 */}
      <button
        onClick={() => isAdmin && onSelect("INQUIRY")}
        disabled={!isAdmin}
      >
        문의 내역
      </button>
    </div>
  );
};

export default AdminPanel;
