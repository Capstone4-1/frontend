import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, MessageCircle } from "lucide-react";
import axiosInstance from "../utils/AxiosInstance";
import "./MarketBox.css";
import SearchBar from "../SearchBar";
import { UserContext } from "../utils/UserContext"; // ✅ 권한 체크용
import { toast } from "sonner"; // ✅ 알림
import PostStats from "../post/PostStats";


const MarketBox = ({ boardType = "market", setShowUploadModal }) => {
  const boardTitle = "장터";
  const { hasRole } = useContext(UserContext); // ✅ 현재 로그인 사용자 권한 확인

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [searchParams, setSearchParams] = useState({ filter: "title", query: "" });

  // ✅ 게시글 불러오기
  const fetchPosts = async (page = 0, filter = searchParams.filter, query = searchParams.query) => {
    try {
      const res = await axiosInstance.get("/post", {
        params: { boardType, page, size: 10, filter, query },
      });

      const { pageResponse, isMarked } = res.data;
      setPosts(pageResponse?.posts || []);
      setCurrentPage(pageResponse?.currentPage || 0);
      setTotalPages(pageResponse?.totalPages || 0);
      setIsFavorited(isMarked);
    } catch (err) {
      console.error("❌ 게시글 로딩 실패:", err);
    }
  };

  const handlePageChange = (page) => {
    fetchPosts(page);
  };
  

  // ✅ 검색
  const handleSearch = ({ filter, query }) => {
    setSearchParams({ filter, query });

    fetchPosts(0, filter, query); 
  };

  // ✅ 물품 등록 버튼 클릭 시 권한 체크
  const handleUploadClick = () => {
    if (!hasRole("STUDENT")) {
      toast.error("물품 등록은 학생 이상만 가능합니다");
      return;
    }
    setShowUploadModal(true);
  };

  useEffect(() => {
    setSearchParams({ filter: "title", query: "" });

    fetchPosts(0, "title", ""); 
  }, [boardType]);

  return (
    <div className="MarketBox">
      <div className="market-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 className="Free-title"><b>{boardTitle}</b></h1>
        </div>
      </div>

      {/* ✅ 권한 체크 후 물품 등록 */}
      <div>

        <button className="create-btn" onClick={handleUploadClick}>
          물품 등록
        </button>
      </div>

      {/* 게시글 목록 */}
      <div className="market-grid">
        {posts.length === 0 ? (
          <p className="empty-message">등록된 물품이 없습니다.</p>
        ) : (
          posts.map((post) => {
            const likeCnt = post.likeCount ?? post.likes ?? post.heartCount ?? 0;
            const commentCnt = post.commentCount ?? post.comments ?? 0;

            return (
              <div key={post.id} className="market-item">
                <Link to={`/main/community/market/post/${post.id}`}>
                  <img
                    src={post.thumbNailUrl || "/icons/no-img-text.png"}
                    alt="썸네일"
                    className="market-thumbnail"
                  />
                  <div className="market-info">
                    <h3 className="market-title">{post.title}</h3>
                    <p className="price">
                      {post.price != null ? `${post.price.toLocaleString()}원` : "가격 미정"}
                    </p>

                    <div className="market-meta">
  <span className="writer">{post.writerNickname}</span>
  <PostStats
    likeCount={likeCnt}
    commentCount={commentCnt}
    viewCount={post.viewCount}
  />
</div>

<div className="market-bottom">
  <span className="market-date">{post.createdDate?.slice(0, 10)}</span>
</div>

                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>

      <SearchBar onSearch={handleSearch} />

      {totalPages > 1 && (
        <div className="pagination">
          {currentPage > 2 && <button onClick={() => handlePageChange(0)}>&laquo; 처음</button>}
          {currentPage > 0 && <button onClick={() => handlePageChange(currentPage - 1)}>&lt; 이전</button>}


          {(() => {
            const startPage = Math.max(0, currentPage - 2);
            const endPage = Math.min(totalPages - 1, currentPage + 2);
            const pageButtons = [];
            if (startPage > 0) pageButtons.push(<span key="start-ellipsis">...</span>);

            for (let i = startPage; i <= endPage; i++) {
              pageButtons.push(
                <button key={i} onClick={() => handlePageChange(i)} className={currentPage === i ? "active-page" : ""}>
                  {i + 1}
                </button>
              );
            }
            if (endPage < totalPages - 1) pageButtons.push(<span key="end-ellipsis">...</span>);
            return pageButtons;
          })()}

          {currentPage < totalPages - 1 && <button onClick={() => handlePageChange(currentPage + 1)}>다음 &gt;</button>}
          {currentPage < totalPages - 3 && <button onClick={() => handlePageChange(totalPages - 1)}>&raquo; 마지막</button>}

        </div>
      )}
    </div>
  );
};

export default MarketBox;
