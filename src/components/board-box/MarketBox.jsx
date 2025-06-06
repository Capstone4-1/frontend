import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import axiosInstance from "../utils/AxiosInstance";
import "./MarketBox.css";
import SearchBar from "../SearchBar";

const MarketBox = ({ boardType = "market", setShowUploadModal }) => {
  const boardTitle = "장터 게시판";

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [searchParams, setSearchParams] = useState({ filter: "title", query: "" });

  const fetchPosts = async (page = 0, filter = searchParams.filter, query = searchParams.query) => {
    try {
      const res = await axiosInstance.get("/api/post", {
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

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        await axiosInstance.delete("/api/post/favorites", {
          params: { boardType },
        });
      } else {
        await axiosInstance.post("/api/post/favorites", {
          boardName: boardTitle,
          boardType,
        });
      }
      setIsFavorited(!isFavorited);
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch (e) {
      console.error("❌ 즐겨찾기 토글 실패", e);
    }
  };

  const handleSearch = ({ filter, query }) => {
    setSearchParams({ filter, query });
    fetchPosts(0, filter, query); // 검색 시 첫 페이지로 이동
  };

  useEffect(() => {
    setSearchParams({ filter: "title", query: "" });
    fetchPosts(0, "title", ""); // 초기 전체 로딩
  }, [boardType]);

  return (
    <div className="MarketBox">
      <div className="market-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 className="Free-title">{boardTitle}</h1>
          <button
            onClick={toggleFavorite}
            title="즐겨찾기 추가/제거"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginLeft: "8px",
              padding: 0,
            }}
          >
            <Star size={20} fill={isFavorited ? "#facc15" : "none"} stroke="#f59e0b" />
          </button>
        </div>
      </div>

      <div>
        <button className="create-btn" onClick={setShowUploadModal}>
          물품 등록
        </button>
      </div>


      <div className="market-grid">
        {posts.length === 0 ? (
          <p className="empty-message">등록된 물품이 없습니다.</p>
        ) : (
          posts.map((post) => (
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
                    {post.price != null
                      ? `${post.price.toLocaleString()}원`
                      : "가격 미정"}
                  </p>
                  <div className="market-meta">
                    <span className="writer">{post.writerNickname}</span>
                    <span className="view-count">조회 {post.viewCount}</span>
                  </div>
                  <div className="market-date">
                    {post.createdDate?.slice(0, 10)}
                  </div>
                </div>
              </Link>
            </div>


          ))
        )}
      </div>
      <SearchBar onSearch={handleSearch} />
      {totalPages > 1 && (
        <div className="pagination">
          {/* << 처음 */}
          {currentPage > 2 && (
            <button onClick={() => handlePageChange(0)}>&laquo; 처음</button>
          )}

          {/* < 이전 */}
          {currentPage > 0 && (
            <button onClick={() => handlePageChange(currentPage - 1)}>
              &lt; 이전
            </button>
          )}

          {/* 페이지 번호들 */}
          {(() => {
            const startPage = Math.max(0, currentPage - 2);
            const endPage = Math.min(totalPages - 1, currentPage + 2);
            const pageButtons = [];

            if (startPage > 0) {
              pageButtons.push(<span key="start-ellipsis">...</span>);
            }

            for (let i = startPage; i <= endPage; i++) {
              pageButtons.push(
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={currentPage === i ? "active-page" : ""}
                >
                  {i + 1}
                </button>
              );
            }

            if (endPage < totalPages - 1) {
              pageButtons.push(<span key="end-ellipsis">...</span>);
            }

            return pageButtons;
          })()}

          {/* 다음 > */}
          {currentPage < totalPages - 1 && (
            <button onClick={() => handlePageChange(currentPage + 1)}>
              다음 &gt;
            </button>
          )}

          {/* >> 마지막 */}
          {currentPage < totalPages - 3 && (
            <button onClick={() => handlePageChange(totalPages - 1)}>
              &raquo; 마지막
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketBox;
