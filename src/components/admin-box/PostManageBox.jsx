import { useState } from "react";
import "./PostManageBox.css";

const PostManageBox = () => {
  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");

  const todayDate = "2025-08-08";

  const initialPosts = [
    { id: 1, title: "학사일정 공지", author: "admin", date: "2025-08-08" },
    { id: 2, title: "자유게시판 질문", author: "student01", date: "2025-08-08" },
    { id: 3, title: "교내 행사 안내", author: "admin", date: "2025-08-08" },
    { id: 4, title: "동아리 모집", author: "clubleader", date: "2025-08-07" },
    { id: 5, title: "졸업 요건", author: "student02", date: "2025-08-08" },
  ];

  const initialComments = [
    { id: 1, content: "좋은 글 감사합니다.", author: "student11", date: "2025-08-08" },
    { id: 2, content: "질문 있어요", author: "student12", date: "2025-08-08" },
    { id: 3, content: "공유 감사합니다", author: "admin", date: "2025-08-08" },
    { id: 4, content: "공감합니다", author: "student14", date: "2025-08-07" },
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [comments, setComments] = useState(initialComments);

  const todayPosts = posts.filter((p) => p.date === todayDate);
  const todayComments = comments.filter((c) => c.date === todayDate);

  const handleDeletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeleteComment = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const filteredPosts = todayPosts.filter((p) =>
    searchType === "title"
      ? p.title.toLowerCase().includes(searchKeyword.toLowerCase())
      : p.author.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const filteredComments = todayComments.filter((c) =>
    searchType === "title"
      ? c.content.toLowerCase().includes(searchKeyword.toLowerCase())
      : c.author.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="PostManageBox">
      <h2>게시글 및 댓글 관리</h2>

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

      <div className="content-grid">
        <div className="panel">
          <h3>오늘 등록된 게시글 ({todayPosts.length})</h3>
          <ul>
            {todayPosts.map((post) => (
              <li key={post.id}>
                <div className="info">
                  <strong>{post.title}</strong> <span>- {post.author}</span>
                </div>
                <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>
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
              <li key={comment.id}>
                <div className="info">
                  <span>{comment.content}</span> <span>- {comment.author}</span>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteComment(comment.id)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {searchKeyword && (
        <div className="search-result">
          <h3>검색 결과</h3>

          <div className="panel">
            <h4>게시글 검색 결과 ({filteredPosts.length})</h4>
            <ul>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <li key={post.id}>
                    <div className="info">
                      <strong>{post.title}</strong> <span>- {post.author}</span>
                    </div>
                    <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>
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
                  <li key={comment.id}>
                    <div className="info">
                      <span>{comment.content}</span> <span>- {comment.author}</span>
                    </div>
                    <button className="delete-btn" onClick={() => handleDeleteComment(comment.id)}>
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
