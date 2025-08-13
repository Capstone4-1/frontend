// BellBox.jsx
import "./BellBox.css";
import { formatDistanceToNowStrict } from "date-fns";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Reddot from "./Reddot";
import axiosInstance from "./utils/AxiosInstance";
import { ko } from "date-fns/locale";

const getNoticeIcon = (type) => {
    switch (type) {
        case "comment":
            return "💬";
        case "like":
            return "❤️";
        case "friend":
            return "👤";
        case "notice":
            return "🔔";
        default:
            return "📢";
    }
};

const BellBox = ({ notices, setNotices }) => {
    const [isOpen, setIsOpen] = useState(false);
    const boxRef = useRef(null);
    const navigate = useNavigate();

    const handleNoticeClick = async (notice) => {
        try {
            await axiosInstance.post(`/notice/read/${notice.id}`);
            setNotices((prev) => prev.filter((n) => n.id !== notice.id));
            if (notice.targetUrl) navigate(notice.targetUrl);
        } catch (err) {
            console.error("알림 클릭 실패", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.post(`/notice/read/${id}`);
            setNotices((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        const ids = notices.map((n) => n.id);
        if (ids.length === 0) return;
        try {
            await axiosInstance.post(`/notice/read-all`, { noticeIds: ids });
            setNotices([]);
        } catch (err) {
            console.error("전체 읽기 실패", err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target))
                setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="BellBox" ref={boxRef}>
            <button
                className={`bell-btn header-btn ${notices.length > 0 ? "header-shake" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell />
                {notices.length > 0 && <Reddot count={notices.length} />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="notification-dropdown"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {notices.length > 0 && (
                            <div className="notification-header">
                                <span className="notification-title">알림</span>
                                <button
                                    className="read-all-btn"
                                    onClick={handleMarkAllAsRead}
                                >
                                    모두 읽기
                                </button>
                            </div>
                        )}

                        {notices.length > 0 ? (
                            <div className="notification-area">
                                <div className="notification-wrap">
                                    <ul className="notification-list">
                                        {notices
                                            .slice() // 원본 배열 훼손 방지
                                            .sort((a, b) => new Date(b.date) - new Date(a.date)) // 최신순 정렬
                                            .map((notice) => (
                                                <li
                                                    key={notice.id}
                                                    className={`notification-item ${notice.read ? "" : "unread"}`}
                                                >
                                                    <div className="notification-main">
                                                        <p
                                                            className="notification-content"
                                                            onClick={() => handleNoticeClick(notice)}
                                                        >
                                                            {getNoticeIcon(notice.type)} {notice.content}
                                                        </p>
                                                        <span className="notification-time">
                                                            {notice.date
                                                                ? formatDistanceToNowStrict(new Date(notice.date), { locale: ko }) + " 전"
                                                                : "방금 전"}
                                                        </span>
                                                    </div>
                                                    <button
                                                        className="notification-delete-btn"
                                                        onClick={() => handleDelete(notice.id)}
                                                    >
                                                        <X />
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="notification-empty">
                                새로운 알림이 없습니다.
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BellBox;
