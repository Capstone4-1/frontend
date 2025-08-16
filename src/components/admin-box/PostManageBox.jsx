import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/AxiosInstance";
import "./PostManageBox.css";

const PostManageBox = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, commentsRes] = await Promise.all([
          axiosInstance.get("/admin/today-posts"),
          axiosInstance.get("/admin/today-comments"),
        ]);
        setPosts(postsRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error("❌ 데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeletePost = (id) => setPosts((prev) => prev.filter((p) => p.id !== id));
  const handleDeleteComment = (id) => setComments((prev) => prev.filter((c) => c.id !== id));

  const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    return d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();
  };

  const todayPosts = posts.filter((p) => isToday(p.createdDate));
  const todayComments = comments.filter((c) => isToday(c.createdDate));

  const filteredPosts = posts.filter((p) =>
    searchType === "title"
      ? (p.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        p.content?.toLowerCase().includes(searchKeyword.toLowerCase()))
      : p.writerNickname?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const filteredComments = comments.filter((c) =>
    searchType === "title"
      ? c.content?.toLowerCase().includes(searchKeyword.toLowerCase())
      : c.writerNickname?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  if (loading) return <p>⏳ 불러오는 중...</p>;

  const goToPost = (boardType, postId) => {
    navigate(`/main/community/${boardType}/post/${postId}`);
  };

  return (
    <div className="PostManageBox">
      <h2>게시글 및 댓글 관리</h2>

      {/* 검색바 */}
      <div className="search-bar">
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="title">제목 / 내용</option>
          <option value="author">작성자</option>
        </select>
        <input
          type="text"
          placeholder="검색어 입력"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      {/* 오늘 게시글 / 댓글 */}
      <div className="content-grid">
        <div className="panel">
          <h3>오늘 등록된 게시글 ({todayPosts.length})</h3>
          <ul>
            {todayPosts.map((post) => (
              <li key={post.id} onClick={() => goToPost(post.boardType, post.id)} className="clickable-item">
                <div className="info">
                  <strong>{post.title}</strong>
                  <span className="board-type">[{post.boardType}]</span>
                  <span>- {post.writerNickname}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePost(post.id);
                  }}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>오늘 등록된 댓글 ({todayComments.length})</h3>
          <ul>
            {todayComments.map((comment) => (
              <li key={comment.id} onClick={() => goToPost(comment.boardType, comment.postId)} className="clickable-item">
                <div className="info">
                  <span>{comment.content}</span>
                  <span className="board-type">[{comment.boardType}]</span>
                  <span>- {comment.writerNickname}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteComment(comment.id);
                  }}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 검색 결과 */}
      {searchKeyword && (
        <div className="search-result">
          <h3>검색 결과</h3>

          <div className="panel">
            <h4>게시글 검색 결과 ({filteredPosts.length})</h4>
            <ul>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <li key={post.id} onClick={() => goToPost(post.boardType, post.id)} className="clickable-item">
                    <div className="info">
                      <strong>{post.title}</strong>
                      <span className="board-type">[{post.boardType}]</span>
                      <span>- {post.writerNickname}</span>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post.id);
                      }}
                    >
                      삭제
                    </button>
                  </li>
                ))
              ) : (
                <p>일치하는 게시글이 없습니다.</p>
              )}
            </ul>
          </div>

          <div className="panel">
            <h4>댓글 검색 결과 ({filteredComments.length})</h4>
            <ul>
              {filteredComments.length > 0 ? (
                filteredComments.map((comment) => (
                  <li
                    key={comment.id}
                    className="clickable-item"
                    onClick={() => goToPost(comment.boardType, comment.postId)}
                  >
                    <div className="info">
                      <span>{comment.content}</span>
                      <span className="board-type">[{comment.boardType}]</span>
                      <span>- {comment.writerNickname}</span>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteComment(comment.id);
                      }}
                    >
                      삭제
                    </button>
                  </li>
                ))
              ) : (
                <p>일치하는 댓글이 없습니다.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManageBox;
