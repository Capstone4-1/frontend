import "./Header.css";

import { Menu } from "lucide-react";
import Bellbox from "./BellBox";
import MailBox from "./MailBox";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./utils/AxiosInstance";
import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "./utils/UserContext";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import {
    FcAdvertising,
    FcGraduationCap,
    FcManager,
    FcRating,
    FcCollaboration,
    FcLock,
    FcSms,
    FcPaid,
} from "react-icons/fc";
import MyProfile from "./Myprofile";

function Header() {
    const { user } = useContext(UserContext);
    const [notices, setNotices] = useState([]);
    const [newMailCount, setNewMailCount] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const bodyScrollYRef = useRef(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    const openSidebar = () => setSidebarOpen(true);
    const closeSidebar = () => setSidebarOpen(false);

    const handleLogout = async () => {
        try {
            await axiosInstance.post("member/logout");

            // 로그아웃 성공 시 클라이언트 상태 정리
            localStorage.clear();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
            // 로그아웃 실패 시에도 강제 리다이렉트 할지, 사용자에게 알릴지는 선택
            window.location.href = "/login";
        }
    };

    const profileMenuItems = [
        {
            label: "마이 페이지",
            onClick: () => navigate("/mypage"),
        },
        {
            label: "로그아웃",
            onClick: handleLogout,
        },
    ];

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
            setIsMobile(window.innerWidth <= 767);
        };

        const computeScrolled = (event) => {
            if (mobileMenuOpen) {
                return;
            }
            const windowScrolled =
                window.scrollY > 0 ||
                document.documentElement.scrollTop > 0 ||
                document.body.scrollTop > 0;
            const targetScrolled =
                event &&
                event.target &&
                typeof event.target.scrollTop === "number" &&
                event.target.scrollTop > 0;
            setIsScrolled(Boolean(windowScrolled || targetScrolled));
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", computeScrolled, { passive: true });
        // 내부 스크롤 컨테이너 감지를 위해 캡처 단계에서 문서의 스크롤 이벤트도 수신
        document.addEventListener("scroll", computeScrolled, {
            passive: true,
            capture: true,
        });

        // 초기 상태 계산
        computeScrolled();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", computeScrolled);
            document.removeEventListener("scroll", computeScrolled, {
                capture: true,
            });
        };
    }, [mobileMenuOpen]);

    // 모바일 메뉴 열림 시 배경 스크롤 완전 잠금 (iOS 포함)
    useEffect(() => {
        if (!mobileMenuOpen) return;

        bodyScrollYRef.current =
            window.scrollY || document.documentElement.scrollTop || 0;

        const body = document.body;
        const html = document.documentElement;

        const prevBody = {
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            right: body.style.right,
            width: body.style.width,
            overflow: body.style.overflow,
        };
        const prevHtml = {
            overscrollBehavior: html.style.overscrollBehavior,
        };

        body.style.position = "fixed";
        body.style.top = `-${bodyScrollYRef.current}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
        html.style.overscrollBehavior = "none";

        return () => {
            body.style.position = prevBody.position;
            body.style.top = prevBody.top;
            body.style.left = prevBody.left;
            body.style.right = prevBody.right;
            body.style.width = prevBody.width;
            body.style.overflow = prevBody.overflow;
            html.style.overscrollBehavior = prevHtml.overscrollBehavior;
            window.scrollTo(0, bodyScrollYRef.current);
        };
    }, [mobileMenuOpen]);

    return (
        <div className={`header ${isScrolled ? "shadow" : ""}`}>
            <div className="header-container">
                <div className="header-inner">
                    {!isMobile && (
                        <button className="menu-btn" onClick={openSidebar}>
                            {" "}
                            <Menu size={24} />
                        </button>
                    )}
                    <Link to="/main" className="logo-btn">
                        <img src="/icons/logo.svg" alt="모아이 로고" />
                    </Link>
                    {!isMobile && (
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
                                                <div className="submenu-icon">
                                                    <FcAdvertising />
                                                </div>
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
                                                <div className="submenu-icon">
                                                    <FcGraduationCap />
                                                </div>
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
                                                <div className="submenu-icon">
                                                    <FcManager />
                                                </div>
                                                <div className="submenu-content">
                                                    <div className="submenu-title">
                                                        조교알림
                                                    </div>
                                                    <div className="submenu-desc">
                                                        조교가 올린 학과
                                                        공지에요.
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
                                                <div className="submenu-icon">
                                                    <FcRating />
                                                </div>
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
                                                <div className="submenu-icon">
                                                    <FcCollaboration />
                                                </div>
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
                                                <div className="submenu-icon">
                                                    <FcLock />
                                                </div>
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
                                                <div className="submenu-icon">
                                                    <FcSms />
                                                </div>
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
                                                <div className="submenu-icon">
                                                    <FcPaid />
                                                </div>
                                                <div className="submenu-content">
                                                    <div className="submenu-title">
                                                        책 장터
                                                    </div>
                                                    <div className="submenu-desc">
                                                        중고 책을 사고 팔 수
                                                        있어요.
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
                    )}
                </div>
                <div className="header-inner">
                    <div className="header-wrap">
                        <div className="btn-wrap">
                            <MailBox newMailCount={newMailCount} />
                        </div>
                        <div className="btn-wrap">
                            <Bellbox
                                notices={notices}
                                setNotices={setNotices}
                            />
                        </div>
                        {!isMobile && (
                            <div className="btn-wrap more-gap">
                                <button
                                    aria-label="프로필"
                                    className="header-btn profile"
                                >
                                    <MyProfile
                                        profileImageUrl={user?.profileImageUrl}
                                    />
                                </button>
                                <div className="profile-menu-list-area">
                                    <ul className="profile-menu-list">
                                        {profileMenuItems.map((item, index) => (
                                            <li
                                                key={index}
                                                className={`profile-menu-item ${
                                                    index ===
                                                    profileMenuItems.length - 1
                                                        ? "logout"
                                                        : ""
                                                }`}
                                                onClick={item.onClick}
                                            >
                                                <button className="profile-menu-btn">
                                                    {item.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        {isMobile && (
                            <div className="btn-wrap">
                                <button
                                    className="header-btn mobile-menu-btn"
                                    aria-label="모바일 메뉴 열기"
                                    onClick={() => setMobileMenuOpen(true)}
                                >
                                    {" "}
                                    <Menu />
                                </button>
                            </div>
                        )}
                    </div>
                    {user?.roles?.includes("ADMIN") && (
                        <div className="header-wrap">
                            <div className="btn-wrap">
                                <button
                                    className="admin-btn"
                                    onClick={goToAdminPage}
                                >
                                    관리자
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />{" "}
                <MobileMenu
                    isOpen={mobileMenuOpen}
                    onClose={() => setMobileMenuOpen(false)}
                    user={user}
                    onLogout={handleLogout}
                    newMailCount={newMailCount}
                />
            </div>
        </div>
    );
}

export default Header;
