import React, { useEffect, useState } from "react";
import "./MyFavorites.css";
import axiosInstance from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { getBoardLabel } from "../utils/boardUtils";

const FAVORITES_URL = "/post/like";
const PAGE_SIZE = 5; // ✅ 페이지당 개수

// YYYY. M. D
const formatDotDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d)) return "";
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;
};

const MyFavorites = ({ onItemClick = () => {}, onUnfavorite = () => {} }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [unlikingId, setUnlikingId] = useState(null);

  const [page, setPage] = useState(0);        
  const [totalPages, setTotalPages] = useState(1); 
  const navigate = useNavigate();

  const normalizePost = (raw) => ({
    id: raw?.id,
    title: raw?.title ?? "(제목 없음)",
    excerpt: raw?.excerpt ?? "",
    author: raw?.writerNickname ?? "익명",
    createdAt: raw?.createdDate ?? null,
    likeCount: typeof raw?.likeCount === "number" ? raw.likeCount : null,
    board: raw?.boardType ?? "기타",
  });

  // 목록 조회
  const fetchFavorites = async (pageNum = 0) => {
    try {
      setLoading(true);
      setErrMsg("");

      const res = await axiosInstance.get(FAVORITES_URL, {
       
        params: { page: pageNum, size: PAGE_SIZE },
      });

      const d = res?.data ?? {};
      const rows = Array.isArray(d.likes) ? d.likes : [];
      setItems(rows.map(normalizePost));

      const tp =
        typeof d.totalPages === "number" && d.totalPages > 0
          ? d.totalPages
          : typeof d.totalElements === "number"
          ? Math.max(1, Math.ceil(d.totalElements / PAGE_SIZE))
          : 
            1;
      setTotalPages(tp);

      setPage(pageNum);
    } catch (error) {
      console.error("좋아요한 게시물 불러오기 실패:", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "좋아요한 게시물을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
      setErrMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(0);
  }, []);

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

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="MyFavorites">
      <h2>좋아요 한 게시물</h2>

      <div className="favorites-card">
        {loading ? (
          <div className="empty-state">불러오는 중...</div>
        ) : errMsg ? (
          <div className="empty-state favorites-error">{errMsg}</div>
        ) : items.length === 0 ? (
          <div className="favorites-empty">
            <p className="empty-title">좋아요한 게시물이 없습니다.</p>
            <p className="empty-desc">마음에 드는 글에 ♥를 눌러 보관해 보세요.</p>
          </div>
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
                  {p.excerpt && <p className="favorite-excerpt">{p.excerpt}</p>}
                  {(p.author || p.createdAt || p.likeCount != null || p.board) && (
                    <span className="favorite-meta">
                      {p.author && `@${p.author}`}
                      {p.createdAt && ` • ${formatDotDate(p.createdAt)}`}
                      {typeof p.likeCount === "number" && ` • ♥ ${p.likeCount}`}
                      {p.board && ` • ${getBoardLabel(p.board)}`}
                    </span>
                  )}
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

      <div className="pager-bottom">
        <button
          type="button"
          className={`pager-arrow ${!canPrev ? "disabled" : ""}`}
   
          disabled={!canPrev}
          onClick={(e) => {
            e.preventDefault();
            if (canPrev) fetchFavorites(page - 1);
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
            if (canNext) fetchFavorites(page + 1);
          }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default MyFavorites;
