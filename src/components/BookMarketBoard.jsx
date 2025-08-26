import "./BookMarketBoard.css";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./utils/AxiosInstance";

const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price || 0) + " 원";
};

const BookMarketBoard = ({ boardType, title }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(1);
    const [isAnimating, setIsAnimating] = useState(true);

    const VISIBLE_COUNT = 4;
    const PAGE_SIZE = 12;

    const fetchPosts = useCallback(async () => {
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
    }, [boardType]);

    useEffect(() => {
        if (boardType) {
            fetchPosts();
        }
    }, [boardType, fetchPosts]);

    const totalPages = Math.max(1, Math.ceil(posts.length / VISIBLE_COUNT));

    // 자동 롤링 (호버 시 일시정지)
    useEffect(() => {
        if (loading) return;
        if (posts.length === 0) return;
        if (totalPages <= 1) return;
        if (isHovered) return;

        const intervalId = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, posts.length, totalPages, isHovered]);

    // 데이터/페이지 변경 시 인덱스 초기화 (무한 루프용)
    useEffect(() => {
        if (totalPages > 0) {
            setIsAnimating(false);
            setCurrentIndex(1);
            const id = requestAnimationFrame(() => setIsAnimating(true));
            return () => cancelAnimationFrame(id);
        }
    }, [totalPages]);

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

    // 페이지 배열 생성
    const pages = Array.from({ length: totalPages }, (_, pageIndex) =>
        posts.slice(
            pageIndex * VISIBLE_COUNT,
            pageIndex * VISIBLE_COUNT + VISIBLE_COUNT
        )
    );

    // 무한 루프용 확장 페이지 (앞뒤 클론)
    const extendedPages =
        pages.length > 0 ? [pages[pages.length - 1], ...pages, pages[0]] : [];

    const handleTransitionEnd = () => {
        if (currentIndex === 0) {
            setIsAnimating(false);
            setCurrentIndex(totalPages);
            setTimeout(() => setIsAnimating(true), 0);
        } else if (currentIndex === totalPages + 1) {
            setIsAnimating(false);
            setCurrentIndex(1);
            setTimeout(() => setIsAnimating(true), 0);
        }
    };

    const handlePrev = () => {
        if (posts.length === 0) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => prev - 1);
    };

    const handleNext = () => {
        if (posts.length === 0) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => prev + 1);
    };

    return (
        <section className="BookMarketBoard">
            <div
                className="slider-viewport"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className="slider-track"
                    style={{
                        transform: `translateX(-${
                            (currentIndex * 100) / (extendedPages.length || 1)
                        }%)`,
                        transition: isAnimating
                            ? "transform 0.4s ease"
                            : "none",
                        width: `${(extendedPages.length || 1) * 100}%`,
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {extendedPages.map((pagePosts, idx) => (
                        <div
                            className="slider-page"
                            key={idx}
                            style={{
                                width: `${100 / (extendedPages.length || 1)}%`,
                            }}
                        >
                            {pagePosts.map((post) => (
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
                                        <span className="title">
                                            {post.title}
                                        </span>
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
                        </div>
                    ))}
                </div>
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
