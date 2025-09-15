import "./BookMarketBoard.css";
import axiosInstance from "./utils/AxiosInstance";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const formatPrice = (price) =>
  new Intl.NumberFormat("ko-KR").format(price || 0) + " 원";

const BookMarketBoard = ({ boardType, title }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isSnapping, setIsSnapping] = useState(false);
  const [canClick, setCanClick] = useState(true); // 버튼 연타 방지

  const PAGE_SIZE = 12;

  // 화면 크기에 따라 visibleCount 조정
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth <= 767 ? 2 : 4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 브라우저 focus/blur 처리
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) setIsAnimating(true);
      else setIsAnimating(false);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

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
    if (boardType) fetchPosts();
  }, [boardType, fetchPosts]);

  // posts 변경 시 슬라이더 초기화
  useEffect(() => {
    if (!loading && posts.length > 0) {
      setIsAnimating(false);
      setCurrentIndex(1);
      requestAnimationFrame(() => setIsAnimating(true));
    }
  }, [loading, posts]);

  const totalPages = Math.max(1, Math.ceil(posts.length / visibleCount));

  // 이전/다음 버튼
  const handlePrev = () => {
    if (!canClick || posts.length === 0 || isSnapping || !isAnimating) return;

    setCanClick(false);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setCanClick(true), 1000); // 1초 후 다시 클릭 가능
  };

  const handleNext = () => {
    if (!canClick || posts.length === 0 || isSnapping || !isAnimating) return;

    setCanClick(false);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setCanClick(true), 500); // 1초 후 다시 클릭 가능
  };

  // 자동 롤링
  useEffect(() => {
    if (
      loading ||
      posts.length === 0 ||
      totalPages <= 1 ||
      isHovered ||
      isSnapping ||
      !isAnimating
    )
      return;
    const intervalId = setInterval(() => handleNext(), 5000);
    return () => clearInterval(intervalId);
  }, [loading, posts.length, totalPages, isHovered, isSnapping, isAnimating]);

  // visibleCount 변경 시 currentIndex 재조정
  useEffect(() => {
    if (totalPages > 0) {
      setIsAnimating(false);
      setCurrentIndex(1);
      requestAnimationFrame(() => setIsAnimating(true));
    }
  }, [totalPages, visibleCount]);

  const handleTransitionEnd = () => {
    // 앞뒤 클론 페이지 snap 처리
    if (currentIndex === 0) {
      setIsSnapping(true);
      setIsAnimating(false);
      setCurrentIndex(totalPages);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
          setIsSnapping(false);
        });
      });
    } else if (currentIndex === totalPages + 1) {
      setIsSnapping(true);
      setIsAnimating(false);
      setCurrentIndex(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
          setIsSnapping(false);
        });
      });
    }
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

  // 페이지 배열 생성
  const pages = Array.from({ length: totalPages }, (_, pageIndex) =>
    posts.slice(pageIndex * visibleCount, pageIndex * visibleCount + visibleCount)
  );

  // 무한 루프용 확장 페이지 (앞뒤 클론)
  const extendedPages =
    pages.length > 0 ? [pages[pages.length - 1], ...pages, pages[0]] : [];

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
            transition: isAnimating ? "transform 0.4s ease" : "none",
            width: `${(extendedPages.length || 1) * 100}%`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedPages.map((pagePosts, idx) => (
            <div
              className="slider-page"
              key={`page-${idx}-${pagePosts[0]?.id || 0}`}
              style={{ width: `${100 / (extendedPages.length || 1)}%` }}
            >
              {pagePosts.map((post) => (
                <Link
                  key={post.id}
                  className="book-card"
                  to={`/main/community/${post.boardType.toLowerCase()}/post/${post.id}`}
                >
                  <span className="thumb">
                    <img
                      src={post.thumbNailUrl || "/icons/no-img-text.png"}
                      alt={post.title}
                    />
                  </span>
                  <span className="info">
                    <span className="title">{post.title}</span>
                    <span className="price">{formatPrice(post.price)}</span>
                    <span className="meta">
                      <span className="writer">{post.writerNickname}</span>
                      <span className="date">{post.createdDate?.slice(0, 10)}</span>
                      <span className="comments">댓글: {post.commentCount}</span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
        <button className="nav-arrow prev" onClick={handlePrev} aria-label="이전">
          ◀
        </button>
        <button className="nav-arrow next" onClick={handleNext} aria-label="다음">
          ▶
        </button>
      </div>
    </section>
  );
};

export default BookMarketBoard;
