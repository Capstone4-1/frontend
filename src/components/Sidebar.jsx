import "./Sidebar.css";

import { X, User, Mail, LogOut, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // ✅ 추가

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="close-area">
                    <button
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        <X size={30} />
                    </button>
                </div>

                <div className="content-area">
                    <ul className="sidebar-menu">
                        {/* ✅ 마이페이지 */}
                        <li onClick={onClose}>
                            <Link to="/mypage" className="sidebar-link">
                                <User size={18} />
                                <span>마이페이지</span>
                            </Link>
                        </li>

                        {/* ✅ 관리자 페이지 */}
                        {/* ✅ 메일함 (chat-mail) */}
                        <li onClick={onClose}>
                            <Link to="/chat-mail" className="sidebar-link">
                                <Mail size={18} />
                                <span>메일함</span>
                            </Link>
                        </li>

                        {/* 로그아웃 */}
                        <li onClick={handleLogout}>
                            <LogOut size={18} />
                            <span>로그아웃</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* 백드롭 클릭 시 닫힘 */}
            <div
                className={`sidebar-backdrop ${isOpen ? "show" : ""}`}
                onClick={onClose}
            />
        </>
    );
};

export default Sidebar;
