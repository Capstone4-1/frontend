import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import axiosInstance from "../utils/AxiosInstance";
import "./BasicBoardBox.css";
import { getBoardLabel } from "../utils/boardUtils";
import SearchBar from "../SearchBar";
import { UserContext } from "../utils/UserContext";
import { toast } from "sonner";
import PostStats from "../post/PostStats"; // 추가

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
  const { user, hasRole } = useContext(UserContext);
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
  

  const handleSearch = ({ filter, query }) => {
    setSearchParams({ filter, query });
    fetchData(0, filter, query);
  };

  const handleWriteButtonClick = () => {
    const normalizedBoardType = boardType.toUpperCase();
    console.log(user.roles);
    let requiredRole = "STUDENT";
    if (normalizedBoardType === "NOTICE") requiredRole = "MANAGER";
    if (normalizedBoardType === "NOTICE_UNIV" || normalizedBoardType === "NOTICE_DEPT") requiredRole = "SYSTEM";
    if (normalizedBoardType === "NOTICE_SC" ) requiredRole = "STUDENT_COUNCIL";
    if (!hasRole(requiredRole)) {
      toast.error("글쓰기 권한이 없습니다");
      return;
    }
    handleWriteClick();
  };

  return (
    <div className="FreeBoardBox">
      <div className="free-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 className="Free-title"><b>{boardTitle}</b></h1>
          
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
                {post.imageUrls && (
                  <img
                    src={post.thumbNailUrl}
                    alt="썸네일"
                    className="free-thumbnail"
                    loading="lazy"
                  />
                )}
                <div className="free-list-content">
                  <Link
                    to={`/main/community/${post.boardType.toLowerCase()}/post/${post.id}`}
                    className="free-link"
                  >
                    <div className="free-title-line">
                      <div className="free-title-wrapper">
                        <h3 className="free-title">{post.title}</h3>
                      </div>
                    </div>
                  </Link>
                  <div className="meta-area">
                    <div className="free-author-date">
                      {post.boardType === "SECRET" ? "익명" : post.writerNickname} |{" "}
                      {formatDateTime(post.createdDate)}
                    </div>
                    {/* PostStats 적용 */}
                    <PostStats
                      likeCount={post.likeCount}
                      commentCount={post.commentCount}
                      viewCount={post.viewCount}
                    />
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
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={i === currentPage ? "active-page" : ""}
              >
                {i + 1}
              </button>
            );
          }

          if (endPage < totalPages - 1) pageButtons.push(<span key="end-ellipsis">...</span>);

          return pageButtons;
        })()}
        {postData.currentPage < postData.totalPages - 1 && (
          <button onClick={() => handlePageChange(postData.currentPage + 1)}>다음 &gt;</button>
        )}
        {postData.currentPage < postData.totalPages - 3 && (
          <button onClick={() => handlePageChange(postData.totalPages - 1)}>&raquo; 마지막</button>
        )}
      </div>
    </div>
  );
};

export default BasicBoardBox;
