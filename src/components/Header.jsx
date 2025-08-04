import "./Header.css";
import { LogOut, Menu } from "lucide-react";
import Bellbox from "./BellBox";
import MailBox from "./MailBox";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
            <div className="header-container">
                <div className="header-inner">
                    <button className="menu-btn" onClick={openSidebar}>
                        {" "}
                        <Menu size={24} />
                    </button>
                    <Link to="/main" className="logo-btn">
                        <img src="/icons/logo.svg" alt="모아이 로고" />
                    </Link>
                    <div className="gnb">
                        <div className="gnb-inner">
                            <div className="tooltip-area">
                                <div className="tooltip-label">
                                    <Link
                                        className={`gnb-title ${
                                            location.pathname ===
                                                "/main/community/notice_c" ||
                                            location.pathname ===
                                                "/main/community/notice"
                                                ? "on"
                                                : ""
                                        }`}
                                    >
                                        공지사항
                                    </Link>
                                </div>
                                <div className="tooltip">
                                    <div className="gnb-sub">
                                        <Link className="submenu-item">
                                            <div className="submenu-icon icon-blue" />
                                            <div className="submenu-content">
                                                <div className="submenu-title">
                                                    전체 공지사항
                                                </div>
                                                <div className="submenu-desc">
                                                    모든 공지를 한곳에서
                                                    확인해요.
                                                </div>
                                            </div>
                                        </Link>
                                        <Link
                                            to="/main/community/notice_c"
                                            className="submenu-item"
                                        >
                                            <div className="submenu-icon icon-green" />
                                            <div className="submenu-content">
                                                <div className="submenu-title">
                                                    공지사항
                                                </div>
                                                <div className="submenu-desc">
                                                    교내 공지사항이에요.
                                                </div>
                                            </div>
                                        </Link>
                                        <Link
                                            to="/main/community/notice"
                                            className="submenu-item"
                                        >
                                            <div className="submenu-icon icon-yellow" />
                                            <div className="submenu-content">
                                                <div className="submenu-title">
                                                    조교알림
                                                </div>
                                                <div className="submenu-desc">
                                                    조교가 올린 학과 공지에요.
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="tooltip-area">
                                <div className="tooltip-label">
                                    <Link
                                        to="/main/community/free"
                                        className={`gnb-title ${
                                            location.pathname ===
                                                "/main/community/popular" ||
                                            location.pathname ===
                                                "/main/community/free" ||
                                            location.pathname ===
                                                "/main/community/secret" ||
                                            location.pathname ===
                                                "/main/community/review"
                                                ? "on"
                                                : ""
                                        }`}
                                    >
                                        커뮤니티
                                    </Link>
                                </div>
                                <div className="tooltip">
                                    <div className="gnb-sub">
                                        <Link
                                            to="/main/community/popular"
                                            className="submenu-item"
                                        >
                                            <div className="submenu-icon icon-blue" />
                                            <div className="submenu-content">
                                                <div className="submenu-title">
                                                    인기 게시판
                                                </div>
                                                <div className="submenu-desc">
                                                    지금 가장 인기있는
                                                    글들이에요.
                                                </div>
                                            </div>
                                        </Link>
                                        <Link
                                            to="/main/community/free"
                                            className="submenu-item"
                                        >
                                            <div className="submenu-icon icon-green" />
                                            <div className="submenu-content">
                                                <div className="submenu-title">
                                                    자유 게시판
                                                </div>
                                                <div className="submenu-desc">
                                                    자유롭게 이야기를
                                                    나눠보세요.
                                                </div>
                                            </div>
                                        </Link>
                                        <Link
                                            to="/main/community/secret"
                                            className="submenu-item"
                                        >
                                            <div className="submenu-icon icon-yellow" />
                                            <div className="submenu-content">
                                                <div className="submenu-title">
                                                    비밀 게시판
                                                </div>
                                                <div className="submenu-desc">
                                                    하고 싶은 말, 익명으로
                                                    털어놔요.
                                                </div>
                                            </div>
                                        </Link>
                                        <Link
                                            to="/main/community/review"
                                            className="submenu-item"
                                        >
                                            <div className="submenu-icon icon-purple" />
                                            <div className="submenu-content">
                                                <div className="submenu-title">
                                                    후기 게시판
                                                </div>
                                                <div className="submenu-desc">
                                                    다양한 후기를 공유하는
                                                    곳이에요.
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="tooltip-area">
                                <div className="tooltip-label">
                                    <Link
                                        to="/main/community/market"
                                        className={`gnb-title ${
                                            location.pathname ===
                                            "/main/community/market"
                                                ? "on"
                                                : ""
                                        }`}
                                    >
                                        장터
                                    </Link>
                                </div>
                                <div className="tooltip">
                                    <div className="gnb-sub">
                                        <Link
                                            to="/main/community/market"
                                            className="submenu-item"
                                        >
                                            <div className="submenu-icon icon-blue" />
                                            <div className="submenu-content">
                                                <div className="submenu-title">
                                                    책 장터
                                                </div>
                                                <div className="submenu-desc">
                                                    중고 책을 사고 팔 수 있어요.
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="tooltip-area">
                                <div className="tooltip-label">
                                    <Link
                                        to="/main/study-dashboard"
                                        className={`gnb-title ${
                                            location.pathname.startsWith(
                                                "/main/study-dashboard"
                                            )
                                                ? "on"
                                                : ""
                                        }`}
                                    >
                                        스터디룸
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <h2 style={{ marginLeft: "10px" }}>{title}</h2> */}
                </div>
                <div className="header-inner">
                    <div className="header-space">
                        <div className="util-box">
                            {user?.roles?.includes("ADMIN") && (
                                <button onClick={goToAdminPage}>
                                    관리자 페이지
                                </button>
                            )}
                            {!isMobile && (
                                <Bellbox
                                    notices={notices}
                                    setNotices={setNotices}
                                />
                            )}
                            {!isMobile && (
                                <MailBox newMailCount={newMailCount} />
                            )}
                        </div>
                        <button
                            className="logout-btn"
                            title="로그아웃"
                            onClick={handleLogout}
                        >
                            <LogOut />
                        </button>
                    </div>
                </div>
                <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />{" "}
            </div>
        </div>
    );
}

export default Header;
