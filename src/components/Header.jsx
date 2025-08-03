import "./Header.css";
import { LogOut, Menu } from "lucide-react";
import Bellbox from "./BellBox";
import MailBox from "./MailBox";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./utils/AxiosInstance";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./utils/UserContext";
import Sidebar from "./Sidebar";

function Header({ title }) {
  const { user } = useContext(UserContext);
  const [notices, setNotices] = useState([]);
  const [newMailCount, setNewMailCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const goToAdminPage = () => navigate("/admin");

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/member/my-notices`);
      if (response.status === 200) {
        setNotices(response.data.notices);
      }
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  const checkMail = async () => {
    try {
      const response = await axiosInstance.get("/mail/check-new");
      if (response.status === 200) {
        setNewMailCount(response.data.newMailCount);
      }
    } catch (error) {
      console.error("메일 확인 실패:", error);
    }
  };

  useEffect(() => {
    handleSearch();
    checkMail();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 760);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="header">
      <button className="menu-btn" onClick={openSidebar}>
        <Menu size={30} />
      </button>
      <Link to="/main" className="logo_btn"></Link>
      <h2 style={{ marginLeft: "10px" }}>{title}</h2>
      <div className="header-space">
        <div className="util-box">
          {user?.roles?.includes("ADMIN") && (
            <button onClick={goToAdminPage}>관리자 페이지</button>
          )}
          {!isMobile && <Bellbox notices={notices} setNotices={setNotices} />}
          {!isMobile && <MailBox newMailCount={newMailCount} />}
        </div>
        <button className="logout-btn" title="로그아웃" onClick={handleLogout}>
          <LogOut />
        </button>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
    </div>
  );
}


export default Header;
