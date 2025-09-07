// Mypage - 내가 쓴 글
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/AxiosInstance";
import { getBoardLabel } from "../utils/boardUtils";
import "./MyPosts.css";

const PAGE_SIZE = 5;

// YYYY. M. D 형태로 포맷 (예: 2025. 7. 22)
const formatDotDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d)) return "";
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;
};

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // 최초 로딩
  const [errMsg, setErrMsg] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  const fetchMyPosts = async (pageArg = 0, isInitial = false) => {
    try {
      if (isInitial) setLoading(true); // 최초 렌더링일 때만 로딩 표시
      setErrMsg("");

      const res = await axiosInstance.get("/post/my-posts", {
        params: { page: pageArg, pageSize: PAGE_SIZE },
      });

      const d = res?.data ?? {};
      setPosts(d.posts || []);
      setPage(typeof d.currentPage === "number" ? d.currentPage : pageArg);

      const tp =
        typeof d.totalPages === "number" && d.totalPages > 0
          ? d.totalPages
          : d.totalElements
          ? Math.max(1, Math.ceil(d.totalElements / PAGE_SIZE))
          : 1;

      setTotalPages(tp);
      setTotalElements(d.totalElements ?? (d.posts?.length ?? 0));
    } catch (e) {
      console.error("내 글 목록 불러오기 실패:", e);
      setErrMsg("내가 쓴 글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts(0, true); // 최초 마운트 시에만 로딩 ON
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goPost = (p) => {
    const postId = p?.id ?? p?.postId;
    const boardType = p?.boardType;
    if (!postId || !boardType) return alert("이 글의 게시판/게시물 정보를 찾을 수 없어요.");
    navigate(`/main/community/${String(boardType).toLowerCase()}/post/${postId}`);
  };

  if (loading) return <div className="MyPosts">불러오는 중...</div>;

  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  return (
    <div className="MyPosts">
      <h2>작성한 글</h2>

      <div className="posts-card">
        <ul className="posts-list">
          {errMsg ? (
            <li className="post-item empty">
              <div className="post-content">
                <p className="post-text">{errMsg}</p>
              </div>
            </li>
          ) : posts.length === 0 ? (
            <li className="post-item empty">
              <div className="post-content">
                <p className="post-text">작성한 글이 없습니다.</p>
              </div>
            </li>
          ) : (
            posts.map((post) => (
              <li
                key={post.id}
                className="post-item"
                role="button"
                tabIndex={0}
                onClick={() => goPost(post)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goPost(post)}
                aria-label={`게시물로 이동: ${post?.title?.slice(0, 40) || ""}`}
                title="게시물로 이동"
              >
                <div className="post-content">
                  <p className="post-text">{post.title}</p>
                  {(post.createdDate || post.boardType) && (
                    <span className="post-meta">
                      {post.createdDate ? formatDotDate(post.createdDate) : ""}
                      {post.boardType ? ` • ${getBoardLabel(post.boardType)}` : ""}
                    </span>
                  )}
                </div>
                <span className="post-chevron">›</span>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="pager-bottom">
        <button
          type="button"
          className={`pager-arrow ${!canPrev ? "disabled" : ""}`}
          disabled={!canPrev}
          onClick={(e) => {
            e.preventDefault();
            if (canPrev) fetchMyPosts(page - 1);
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
            if (canNext) fetchMyPosts(page + 1);
          }}
        >
          {">"}
        </button>
      </div>

    </div>
  );
};

export default MyPosts;
