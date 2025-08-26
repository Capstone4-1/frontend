// Mypage - 내가 쓴 댓글 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyComments.css";
import axiosInstance from "../utils/AxiosInstance";

const PAGE_SIZE = 5; // ✅ 한 페이지 5개

const MyComments = () => {
  const [comments, setComments] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // ✅ 첫 진입 로딩
  const [errMsg, setErrMsg] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchComments = async (pageNum = 0, isFirst = false) => {
    try {
      if (isFirst) setInitialLoading(true);
      setErrMsg("");

      const res = await axiosInstance.get("/post/my-comments", {
        params: { page: pageNum, pageSize: PAGE_SIZE },
      });

      const d = res?.data ?? {};
      const list = d.posts || [];
      setComments(list);

      const tp =
        typeof d.totalPages === "number" && d.totalPages > 0
          ? d.totalPages
          : typeof d.totalElements === "number"
          ? Math.max(1, Math.ceil(d.totalElements / PAGE_SIZE))
          : 1;
      setTotalPages(tp);

      setPage(pageNum);
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
      setErrMsg("댓글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      if (isFirst) setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(0, true); // ✅ 처음엔 로딩 표시

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
    const url = `/main/community/${encodeURIComponent(bt)}/post/${encodeURIComponent(
      postId
    )}?commentId=${encodeURIComponent(c.id)}`;

    navigate(url, { state: { from: "my-comments", highlightCommentId: c.id } });
  };

  const onKey = (e, c) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(c);
    }
  };

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="MyComments">
      <h2>작성한 댓글</h2>

      <div className="comments-card">
        {initialLoading ? (

          <div className="empty-state">불러오는 중...</div>
        ) : errMsg ? (
          <div className="empty-state">{errMsg}</div>
        ) : comments.length === 0 ? (
          <div className="empty-state">아직 작성한 댓글이 없어요.</div>
        ) : (
          <>
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
                      {c.writerNickname && `@${c.writerNickname}`}
                      {c.targetNickname && ` → @${c.targetNickname}`}
                      {c.createdDate ? ` • ${new Date(c.createdDate).toLocaleDateString()}` : ""}
                      {typeof c.likeCount === "number" ? `` : ""}
                      {c.boardType ? ` • ${c.boardType}` : ""}
                    </span>
                  </div>
                  <span className="comment-chevron">›</span>
                </li>
              ))}
            </ul>

            <div className="pager-bottom">
              <button
                type="button"
                className={`pager-arrow ${!canPrev ? "disabled" : ""}`}
                disabled={!canPrev}
                onClick={(e) => {
                  e.preventDefault();
                  if (canPrev) fetchComments(page - 1);
                }}
              >
                {"<"}
              </button>

              <span className="pager-indicator">
                {page + 1} / {totalPages}
              </span>

              <button
                type="button"
                className={`pager-arrow ${!canNext ? "disabled" : ""}`}
                disabled={!canNext}
                onClick={(e) => {
                  e.preventDefault();
                  if (canNext) fetchComments(page + 1);
                }}
              >
                {">"}
              </button>
            </div>
          </>

        )}
      </div>
    </div>
  );
};

export default MyComments;
