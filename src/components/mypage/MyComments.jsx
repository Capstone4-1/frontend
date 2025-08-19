// Mypage - 내가 쓴 댓글 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyComments.css";
import axiosInstance from "../utils/AxiosInstance";

const MyComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const res = await axiosInstance.get("/post/my-comments", {
          params: { page: 0, pageSize: 10 },
        });
        setComments(res?.data?.posts || []);
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
        setErrMsg("댓글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleClick = (c) => {
    const postId = c?.postId;
    const boardType = c?.boardType;
    if (!postId || !boardType) {
      console.warn("필수 값 누락:", { postId, boardType, comment: c });
      alert("이 댓글의 게시판/게시물 정보를 찾을 수 없어요.");
      return;
    }
    const bt = String(boardType).toLowerCase();
    const url = `/main/community/${encodeURIComponent(bt)}/post/${encodeURIComponent(postId)}?commentId=${encodeURIComponent(c.id)}`;
    navigate(url, { state: { from: "my-comments", highlightCommentId: c.id } });
  };

  const onKey = (e, c) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(c);
    }
  };

  return (
    <div className="MyComments">
      <h2>작성한 댓글</h2>

      <div className="comments-card">
        {loading ? (
          <div className="empty-state">불러오는 중...</div>
        ) : errMsg ? (
          <div className="empty-state">{errMsg}</div>
        ) : comments.length === 0 ? (
          <div className="empty-state">아직 작성한 댓글이 없어요.</div>
        ) : (
          <ul className="comments-list">
            {comments.map((c) => (
              <li
                key={c.id}
                className="comment-item"
                role="button"
                tabIndex={0}
                onClick={() => handleClick(c)}
                onKeyDown={(e) => onKey(e, c)}
                aria-label={`게시물로 이동: ${c?.content?.slice(0, 30) || ""}`}
                title="게시물로 이동"
              >
                <div className="comment-content">
                  <p className="comment-text">{c.content}</p>
                  <span className="comment-meta">
                    {c.writerNickname ? `@${c.writerNickname}` : ""}
                    {c.createdDate
                      ? ` • ${new Date(c.createdDate).toLocaleDateString()}`
                      : ""}
                    {typeof c.likeCount === "number" ? ` • ♥ ${c.likeCount}` : ""}
                    {c.boardType ? ` • ${c.boardType}` : ""}
                  </span>
                </div>
                <span className="comment-chevron">›</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyComments;
