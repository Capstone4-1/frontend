import Bellbox from "./BellBox";
import Friends from "./Friends";
import "./Header.css";
import MailBox from "./MailBox";
import MobileMenu from "./MobileMenu";
import MyProfile from "./Myprofile";
import Sidebar from "./Sidebar";
import axiosInstance from "./utils/AxiosInstance";
import { UserContext } from "./utils/UserContext";
import { Menu } from "lucide-react";
import { useContext, useEffect, useState, useRef } from "react";
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
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [newMailCount, setNewMailCount] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const bodyScrollYRef = useRef(0);

    const openSidebar = () => setSidebarOpen(true);
    const closeSidebar = () => setSidebarOpen(false);

    const handleLogout = async () => {
        try {
            await axiosInstance.post("member/logout");
            localStorage.clear();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
            window.location.href = "/login";
        }
    };

    const profileMenuItems = [
        { label: "마이 페이지", onClick: () => navigate("/mypage") },
        { label: "로그아웃", onClick: handleLogout },
    ];

    const goToAdminPage = () => navigate("/admin");

    // 서버에서 알림/메일 확인
    const fetchNotices = async () => {
        try {
            const res = await axiosInstance.get(`/member/my-notices`);
            if (res.status === 200) setNotices(res.data.notices);
        } catch (error) {
            console.error("검색 실패:", error);
        }
    };

    const fetchMail = async () => {
        try {
            const res = await axiosInstance.get("/mail/check-new");
            if (res.status === 200) setNewMailCount(res.data.newMailCount);
        } catch (error) {
            console.error("메일 확인 실패:", error);
        }
    };

    // 스크롤 & 리사이즈
    useEffect(() => {
        fetchNotices();
        fetchMail();

        const handleResize = () => setIsMobile(window.innerWidth <= 767);

        const handleScroll = (event) => {
            if (mobileMenuOpen) return;
            const windowScrolled =
                window.scrollY > 0 || document.documentElement.scrollTop > 0;
            const targetScrolled = event?.target?.scrollTop > 0;
            setIsScrolled(Boolean(windowScrolled || targetScrolled));
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll, { passive: true });
        document.addEventListener("scroll", handleScroll, {
            passive: true,
            capture: true,
        });

        handleScroll();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("scroll", handleScroll, {
                capture: true,
            });
        };
    }, [mobileMenuOpen]);

    // 모바일 메뉴 열림 시 스크롤 잠금
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
        const prevHtml = { overscrollBehavior: html.style.overscrollBehavior };

        body.style.position = "fixed";
        body.style.top = `-${bodyScrollYRef.current}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
        html.style.overscrollBehavior = "none";

        return () => {
            Object.assign(body.style, prevBody);
            html.style.overscrollBehavior = prevHtml.overscrollBehavior;
            window.scrollTo(0, bodyScrollYRef.current);
        };
    }, [mobileMenuOpen]);

    // GNB 메뉴 링크 정의 (중복 제거)
    const gnbData = [
        {
            label: "공지사항",
            basePath: "/main/community/notice",
            subMenus: [
                {
                    title: "전체 공지사항",
                    desc: "모든 공지를 한곳에서 확인해요.",
                    icon: <FcAdvertising />,
                    to: "#",
                },
                {
                    title: "학교 공지사항",
                    desc: "교내 공지사항이에요.",
                    icon: <FcGraduationCap />,
                    to: "/main/community/notice_univ",
                },
                {
                    title: "학과 공지사항",
                    desc: "교내 공지사항이에요.",
                    icon: <FcGraduationCap />,
                    to: "/main/community/notice_dept",
                },
                {
                    title: "조교알림",
                    desc: "조교가 올린 학과 공지에요.",
                    icon: <FcManager />,
                    to: "/main/community/notice",
                },
            ],
        },
        {
            label: "커뮤니티",
            basePath: "/main/community/free",
            subMenus: [
                {
                    title: "인기 게시판",
                    desc: "지금 가장 인기있는 글들이에요.",
                    icon: <FcRating />,
                    to: "/main/community/popular",
                },
                {
                    title: "자유 게시판",
                    desc: "자유롭게 이야기를 나눠보세요.",
                    icon: <FcCollaboration />,
                    to: "/main/community/free",
                },
                {
                    title: "비밀 게시판",
                    desc: "하고 싶은 말, 익명으로 털어놔요.",
                    icon: <FcLock />,
                    to: "/main/community/secret",
                },
                {
                    title: "후기 게시판",
                    desc: "다양한 후기를 공유하는 곳이에요.",
                    icon: <FcSms />,
                    to: "/main/community/review",
                },
            ],
        },
        {
            label: "장터",
            basePath: "/main/community/market",
            subMenus: [
                {
                    title: "책 장터",
                    desc: "중고 책을 사고 팔 수 있어요.",
                    icon: <FcPaid />,
                    to: "/main/community/market",
                },
            ],
        },
        {
            label: "스터디룸",
            basePath: "/main/study-dashboard",
            subMenus: [],
        },
    ];

    const renderGnb = () =>
        gnbData.map((menu, idx) => (
            <div key={idx} className="tooltip-area">
                <div className="tooltip-label">
                    <Link
                        to={menu.basePath}
                        className={`gnb-title ${location.pathname.startsWith(menu.basePath) ? "on" : ""}`}
                    >
                        {menu.label}
                    </Link>
                </div>
                {menu.subMenus.length > 0 && (
                    <div className="tooltip">
                        <div className="gnb-sub">
                            {menu.subMenus.map((sub, subIdx) => (
                                <Link
                                    key={subIdx}
                                    to={sub.to}
                                    className="submenu-item"
                                >
                                    <div className="submenu-icon">
                                        {sub.icon}
                                    </div>
                                    <div className="submenu-content">
                                        <div className="submenu-title">
                                            {sub.title}
                                        </div>
                                        <div className="submenu-desc">
                                            {sub.desc}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        ));

    return (
        <div className={`header ${isScrolled ? "shadow" : ""}`}>
            <div className="header-container">
                <div className="header-inner">
                    {!isMobile && (
                        <button className="menu-btn" onClick={openSidebar}>
                            <Menu size={24} />
                        </button>
                    )}
                    <Link to="/main" className="logo-btn">
                        <img src="/icons/logo.svg" alt="모아이 로고" />
                    </Link>
                    {!isMobile && <div className="gnb">{renderGnb()}</div>}
                </div>

                {/* 헤더 우측 */}
                <div className="header-inner">
                    <div className="header-wrap">
                        <div className="btn-wrap">
                            <Friends />
                        </div>
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
                                        profileImageUrl={
                                            user?.profileThumbnails
                                        }
                                    />
                                </button>
                                <div className="profile-menu-list-area">
                                    <ul className="profile-menu-list">
                                        {profileMenuItems.map((item, index) => (
                                            <li
                                                key={index}
                                                className={`profile-menu-item ${index === profileMenuItems.length - 1 ? "logout" : ""}`}
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

                <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
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
