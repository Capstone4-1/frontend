import "./BookMarketBoard.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./utils/AxiosInstance";

const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price || 0) + " 원";
};

const BookMarketBoard = ({ boardType, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const PAGE_SIZE = 10;

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

    useEffect(() => {
        if (posts.length === 0) return;

        const intervalId = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % posts.length);
                setFade(true);
            }, 300);
        }, 8000);

        return () => clearInterval(intervalId);
    }, [posts]);

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

    const currentPost = posts[currentIndex];

    return (
        <section className="BookMarketBoard">
            <Link
                to={`/main/community/${boardType.toLowerCase()}`}
                className="more-link"
            >
                {/* <h4 className="title">{title}</h4> */}
            </Link>

            <div
                className={`info-container single ${
                    fade ? "fade-in" : "fade-out"
                }`}
            >
                <Link
                    className="post-link"
                    to={`/main/community/${currentPost.boardType.toLowerCase()}/post/${
                        currentPost.id
                    }`}
                >
                    <div key={currentPost.id} className="book-post">
                        <img
                            src={
                                currentPost.thumbNailUrl ||
                                "/icons/no-img-text.png"
                            }
                            alt="책 이미지"
                            style={{
                                width: 200,
                                height: 250,
                                objectFit: "cover",
                                borderRadius: 8,
                            }}
                        />
                        <div className="post-info">
                            <h4>{currentPost.title}</h4>
                            <p className="price">
                                {formatPrice(currentPost.price)}
                            </p>
                            <div className="meta-info">
                                <span className="writer">
                                    {currentPost.writerNickname}
                                </span>
                                <span className="date">
                                    {currentPost.createdDate?.slice(0, 10)}
                                </span>
                                <span className="comments">
                                    댓글: {currentPost.commentCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="nav-button-group">
                <button
                    className="mini-button"
                    onClick={() => {
                        setFade(false);
                        setTimeout(() => {
                            setCurrentIndex(
                                (prev) =>
                                    (prev - 1 + posts.length) % posts.length
                            );
                            setFade(true);
                        }, 300);
                    }}
                >
                    ◀
                </button>
                <button
                    className="mini-button"
                    onClick={() => {
                        setFade(false);
                        setTimeout(() => {
                            setCurrentIndex(
                                (prev) => (prev + 1) % posts.length
                            );
                            setFade(true);
                        }, 300);
                    }}
                >
                    ▶
                </button>
            </div>
        </section>
    );
};

export default BookMarketBoard;
