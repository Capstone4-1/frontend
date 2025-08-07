import { useState } from "react";
import AdminPanel from "../components/AdminPanel";
import "./AdminPage.css";
import RolesBox from "../components/admin-box/RolesBox";
import PostManageBox from "../components/admin-box/PostManageBox";
const AdminPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("ROLES");

  const renderContent = () => {
    switch (selectedMenu) {
      case "ROLES":
        return <RolesBox />
      case "POSTS":
        return <PostManageBox/>
      case "통계":
        return <div>사이트 통계 보기</div>;
      case "문의":
        return <div>문의 내역 확인</div>;
      case "공지":
        return <div>공지사항 관리</div>;
        case "ACCEPT":
        return <div>권한요청 승인</div>;
      default:
        return <div>선택된 메뉴 없음</div>;
    }
  };

  return (
    <div className="AdminPage">
      <aside className="aside">
        <AdminPanel onSelect={setSelectedMenu} />
      </aside>

      <div className="content-container">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
