import { Link } from "react-router-dom";
import "./AdminPanel.css";

const AdminPanel = ({ onSelect }) => {
  return (
    <div className="AdminPanel">
      <Link to="/main" className="home-link">❮ HOME</Link>

      <h3>관리자 메뉴</h3>
      <button onClick={() => onSelect("ROLES")}>회원 관리</button>
      <button onClick={() => onSelect("POSTS")}>게시글, 댓글 관리</button>
      <button onClick={() => onSelect("통계")}>사이트 통계</button>
      <button onClick={() => onSelect("INQUIRY")}>문의 내역</button>
      <button onClick={() => onSelect("BANNER")}>배너 관리</button>

    </div>
  );
};

export default AdminPanel;
