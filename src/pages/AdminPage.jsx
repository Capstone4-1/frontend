import { useSearchParams } from "react-router-dom";
import AdminPanel from "../components/AdminPanel";
import RolesBox from "../components/admin-box/RolesBox";
import PostManageBox from "../components/admin-box/PostManageBox";
import "./AdminPage.css";
import StatsBox from "../components/admin-box/StatsBox";
import AdminInquiries from "../components/admin-box/AdminInquiries";
import EditBannerBox from "../components/admin-box/EditBannerBox";
import { UserContext } from "../components/utils/UserContext";

const AdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedMenu = searchParams.get("menu") || "STATUS";

  // 메뉴 선택 시 URL 업데이트
  const handleSelectMenu = (menu) => {
    setSearchParams({ menu });
  };

  const renderContent = () => {
    switch (selectedMenu) {

      case "STATUS":
        return <StatsBox />;
      case "ROLES":
        return <RolesBox />;
      case "POSTS":
        return <PostManageBox />;
      case "INQUIRY":
        return <AdminInquiries />
      case "BANNER":
        return <EditBannerBox />
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
