import "./BookMarketBoard.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./utils/AxiosInstance";

const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price || 0) + " 원";
};

const BookMarketBoard = ({ boardType, title }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [fade, setFade] = useState(true);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const VISIBLE_COUNT = 4;
    const PAGE_SIZE = 12;

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(
                `/post/${boardType}/summary`,
                {
                    params: { pageSize: PAGE_SIZE },
                }
            );
            setPosts(response.data?.Posts || []);
        } catch (error) {
            console.error("마켓 게시글 요약 가져오기 실패:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (boardType) {
            fetchPosts();
        }
    }, [boardType]);

    const totalPages = Math.max(1, Math.ceil(posts.length / VISIBLE_COUNT));

    const handlePrev = () => {
        if (posts.length === 0) return;
        setFade(false);
        setTimeout(() => {
            setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
            setFade(true);
        }, 150);
    };

    const handleNext = () => {
        if (posts.length === 0) return;
        setFade(false);
        setTimeout(() => {
            setCurrentPage((prev) => (prev + 1) % totalPages);
            setFade(true);
        }, 150);
    };

    if (loading) {
        return (
            <section className="BookMarketBoard">
                <h3>{title}</h3>
                <p>불러오는 중...</p>
            </section>
        );
    }

    if (posts.length === 0) {
        return (
            <section className="BookMarketBoard">
                <h3>{title}</h3>
                <p>게시물이 없습니다.</p>
            </section>
        );
    }

    const startIndex = currentPage * VISIBLE_COUNT;
    const visiblePosts = posts.slice(startIndex, startIndex + VISIBLE_COUNT);

    return (
        <section className="BookMarketBoard">
            <div className={`grid-viewport ${fade ? "fade-in" : "fade-out"}`}>
                {visiblePosts.map((post) => (
                    <Link
                        key={post.id}
                        className="book-card"
                        to={`/main/community/${post.boardType.toLowerCase()}/post/${
                            post.id
                        }`}
                    >
                        <span className="thumb">
                            <img
                                src={
                                    post.thumbNailUrl ||
                                    "/icons/no-img-text.png"
                                }
                                alt={post.title}
                            />
                        </span>
                        <span className="info">
                            <span className="title">{post.title}</span>
                            <span className="price">
                                {formatPrice(post.price)}
                            </span>
                            <span className="meta">
                                <span className="writer">
                                    {post.writerNickname}
                                </span>
                                <span className="date">
                                    {post.createdDate?.slice(0, 10)}
                                </span>
                                <span className="comments">
                                    댓글: {post.commentCount}
                                </span>
                            </span>
                        </span>
                    </Link>
                ))}
                <button
                    className="nav-arrow prev"
                    onClick={handlePrev}
                    aria-label="이전"
                >
                    ◀
                </button>
                <button
                    className="nav-arrow next"
                    onClick={handleNext}
                    aria-label="다음"
                >
                    ▶
                </button>
            </div>
        </section>
    );
};

export default BookMarketBoard;
