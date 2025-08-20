import { useSearchParams } from "react-router-dom";
import AdminPanel from "../components/AdminPanel";
import RolesBox from "../components/admin-box/RolesBox";
import PostManageBox from "../components/admin-box/PostManageBox";
import "./AdminPage.css";
import StatsBox from "../components/admin-box/StatsBox";
import AdminInquiries from "../components/admin-box/AdminInquiries";

const AdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedMenu = searchParams.get("menu") || "ROLES";

  // 메뉴 선택 시 URL 업데이트
  const handleSelectMenu = (menu) => {
    setSearchParams({ menu });
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "ROLES":
        return <RolesBox />;
      case "POSTS":
        return <PostManageBox />;
      case "통계":
        return <StatsBox/>;
      case "문의":
        return <AdminInquiries/>
      case "공지":
        return <div>공지사항 관리</div>;
      default:
        return <div>선택된 메뉴 없음</div>;
    }
  };

  return (
    <div className="AdminPage">
      <aside className="aside">
        <AdminPanel onSelect={handleSelectMenu} />
      </aside>

      <div className="content-container">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
