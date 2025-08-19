import React, { useEffect, useState } from "react";
import "./MyFavorites.css";
import axiosInstance from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

const MyFavorites = ({
  onItemClick = () => {},
  onUnfavorite = () => {},
  page = 0,
  pageSize = 10,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [unlikingId, setUnlikingId] = useState(null);
  const navigate = useNavigate();

  /** 응답 데이터 통일 처리 */
  const normalizePost = (raw) => ({
    id: raw?.postId ?? raw?.id,
    title: raw?.title ?? "(제목 없음)",
    excerpt: raw?.excerpt ?? raw?.content ?? "",
    author: raw?.authorName ?? raw?.writerNickname ?? "익명",
    createdAt: raw?.createdAt ?? raw?.createdDate ?? null,
    likeCount: raw?.likeCount ?? null,
    board: raw?.boardName ?? raw?.boardType ?? "기타",
  });

  // 목록 조회
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const res = await axiosInstance.get("/post/my-favorites", {
          params: { page, pageSize },
        });
        const list = (res?.data?.posts || []).map(normalizePost);
        setItems(list);
      } catch (error) {
        console.error("좋아요한 게시물 불러오기 실패:", error);
        setErrMsg("좋아요한 게시물을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [page, pageSize]);

  // 게시물 이동
  const goPost = (p) => {
    if (!p.id || !p.board) {
      alert("게시물 정보를 찾을 수 없어요.");
      return;
    }
    const bt = String(p.board).toLowerCase();
    const url = `/main/community/${encodeURIComponent(bt)}/post/${encodeURIComponent(p.id)}`;
    navigate(url, { state: { from: "my-favorites" } });
    onItemClick(p);
  };

  // 좋아요 취소
  const handleUnlike = async (e, p) => {
    e.stopPropagation();
    if (!p.id || unlikingId) return;

    try {
      setUnlikingId(p.id);
      await axiosInstance.post(`/post/${p.id}/unlike`);
      setItems((prev) => prev.filter((it) => it.id !== p.id));
      onUnfavorite(p.id);
    } catch (err) {
      console.error("좋아요 취소 실패:", err);
      alert("좋아요를 취소하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setUnlikingId(null);
    }
  };

  return (
    <div className="MyFavorites">
      <h2>좋아요 한 게시물</h2>

      <div className="favorites-card">
        {loading ? (
          <div className="empty-state">불러오는 중...</div>
        ) : errMsg ? (
          <div className="empty-state">{errMsg}</div>
        ) : items.length === 0 ? (
          <div className="empty-state">아직 좋아요한 게시물이 없어요.</div>
        ) : (
          <ul className="favorites-list">
            {items.map((p) => (
              <li
                key={p.id}
                className="favorite-item"
                role="button"
                tabIndex={0}
                onClick={() => goPost(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goPost(p);
                  }
                }}
                aria-label={`게시물로 이동: ${p.title}`}
                title="게시물로 이동"
              >
                <div className="favorite-content">
                  <p className="favorite-title">{p.title}</p>
                  {p.excerpt && (
                    <p className="favorite-excerpt">{p.excerpt}</p>
                  )}
                  <span className="favorite-meta">
                    @{p.author}
                    {p.createdAt && ` • ${new Date(p.createdAt).toLocaleDateString()}`}
                    {typeof p.likeCount === "number" && ` • ♥ ${p.likeCount}`}
                    {p.board && ` • ${p.board}`}
                  </span>
                </div>

                <button
                  className="unfavorite-btn"
                  title="좋아요 취소"
                  aria-label="좋아요 취소"
                  onClick={(e) => handleUnlike(e, p)}
                  disabled={unlikingId === p.id}
                >
                  {unlikingId === p.id ? "취소 중..." : "취소"}
                </button>

                <span className="favorite-chevron">›</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;
