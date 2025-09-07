import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import axiosInstance from "../utils/AxiosInstance";
import "./BasicBoardBox.css";
import { getBoardLabel } from "../utils/boardUtils";
import SearchBar from "../SearchBar";
import { UserContext } from "../utils/UserContext";
import { toast } from "sonner";

const formatDateTime = (datetimeStr) => {
  if (!datetimeStr) return "";
  const date = new Date(datetimeStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
};

const BasicBoardBox = ({ boardType, handleWriteClick }) => {
  const { user, hasRole } = useContext(UserContext); // 수정: userRole → hasRole
  const [postData, setPostData] = useState({
    posts: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });
  const [marked, setMarked] = useState(false);
  const [searchParams, setSearchParams] = useState({ filter: "title", query: "" });

  const boardTitle = getBoardLabel(boardType);

  const fetchData = async (page = 0, filter = searchParams.filter, query = searchParams.query) => {
    try {
      const res = await axiosInstance.get("/post", {
        params: { boardType, page, size: postData.pageSize, filter, query },
      });
      const { pageResponse, isMarked } = res.data;
      setPostData({ ...pageResponse, pageSize: postData.pageSize });
      setMarked(isMarked);
    } catch (err) {
      console.error("❌ 게시글 로딩 실패:", err);
    }
  };

  useEffect(() => {
    setSearchParams({ filter: "title", query: "" });
    fetchData(0, "title", "");
  }, [boardType]);

  const handlePageChange = (page) => fetchData(page);

  const handleToggleFavorite = async () => {
    try {
      if (marked) {
        await axiosInstance.delete("/board/favorites", { params: { boardType } });
        setMarked(false);
      } else {
        await axiosInstance.post("/board/favorites", { boardType });
        setMarked(true);
      }
    } catch (e) {
      console.error("❌ 즐겨찾기 토글 실패", e);
    }
  };

  const handleSearch = ({ filter, query }) => {
    setSearchParams({ filter, query });
    fetchData(0, filter, query);
  };

  // 글쓰기 버튼 클릭 (권한 체크)
  const handleWriteButtonClick = () => {
    let requiredRole = "STUDENT"; // 기본
    if (boardType === "NOTICE") requiredRole = "ADMIN";
    if (boardType === "NOTICE_UNIV" || boardType === "NOTICE_DEPT") requiredRole = "SYSTEM";

    if (!hasRole(requiredRole)) {
      toast.error("글쓰기 권한이 없습니다")
      return;
    }

    handleWriteClick();
  };

  return (
    <div className="FreeBoardBox">
      <div className="free-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 className="Free-title">{boardTitle}</h1>
          <button
            onClick={handleToggleFavorite}
            style={{ background: "none", border: "none", cursor: "pointer", marginLeft: 8, padding: 0 }}
            title="즐겨찾기 추가/제거"
          >
            <Star size={20} fill={marked ? "#facc15" : "none"} stroke="#f59e0b" />
          </button>
        </div>
      </div>

      <div>
        <button className="create-btn" onClick={handleWriteButtonClick}>
          글쓰기
        </button>
      </div>

      <div className="free-list">
        {postData.posts.length === 0 ? (
          <p>게시글이 없습니다.</p>
        ) : (
          postData.posts.map((post) => (
            <div key={post.id} className="free-list-item">
              <div className="free-list-content-with-thumbnail">
                {post.imageUrls && <img src={post.thumbNailUrl} alt="썸네일" className="free-thumbnail" loading="lazy" />}
                <div className="free-list-content">
                  <Link to={`/main/community/${post.boardType.toLowerCase()}/post/${post.id}`} className="free-link">
                    <div className="free-title-line">
                      <div className="free-title-wrapper">
                        <h3 className="free-title">{post.title}</h3>
                      </div>
                      <div className="free-author-date">
                        {post.boardType === "SECRET" ? "익명" : post.writerNickname} | {formatDateTime(post.createdDate)}
                      </div>
                    </div>
                  </Link>
                  <div className="free-meta-line">
                    조회수: {post.viewCount} | ❤️ {post.likeCount} | 댓글 {post.commentCount}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="pagination">
        {postData.currentPage > 2 && <button onClick={() => handlePageChange(0)}>&laquo; 처음</button>}
        {postData.currentPage > 0 && <button onClick={() => handlePageChange(postData.currentPage - 1)}>&lt; 이전</button>}
        {(() => {
          const totalPages = postData.totalPages;
          const currentPage = postData.currentPage;
          const pageButtons = [];
          const startPage = Math.max(0, currentPage - 2);
          const endPage = Math.min(totalPages - 1, currentPage + 2);

          if (startPage > 0) pageButtons.push(<span key="start-ellipsis">...</span>);

          for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
              <button key={i} onClick={() => handlePageChange(i)} className={i === currentPage ? "active-page" : ""}>
                {i + 1}
              </button>
            );
          }

          if (endPage < totalPages - 1) pageButtons.push(<span key="end-ellipsis">...</span>);

          return pageButtons;
        })()}
        {postData.currentPage < postData.totalPages - 1 && <button onClick={() => handlePageChange(postData.currentPage + 1)}>다음 &gt;</button>}
        {postData.currentPage < postData.totalPages - 3 && <button onClick={() => handlePageChange(postData.totalPages - 1)}>&raquo; 마지막</button>}
      </div>
    </div>
  );
};

export default BasicBoardBox;
