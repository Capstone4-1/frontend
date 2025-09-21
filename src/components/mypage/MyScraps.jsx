import React, { useEffect, useState } from "react";
import "./MyScraps.css";
import axiosInstance from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { getBoardLabel } from "../utils/boardUtils";
import { Bookmark } from "lucide-react"; 

const SCRAPS_URL = "/post/scraps";
const PAGE_SIZE = 5;

// YYYY. M. D
const formatDotDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d)) return "";
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;
};

const MyScraps = ({ onItemClick = () => {}, onUnscrap = () => {} }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [unscrapingId, setUnscrapingId] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const normalizePost = (raw) => ({
    id: raw?.postId ?? raw?.id,
    title: raw?.title ?? "(제목 없음)",
    excerpt: raw?.excerpt ?? raw?.content ?? "",
    author: raw?.authorName ?? raw?.writerNickname ?? "익명",
    createdAt: raw?.createdAt ?? raw?.createdDate ?? null,
    likeCount: typeof raw?.likeCount === "number" ? raw.likeCount : null,
    board: raw?.boardName ?? raw?.boardType ?? "기타",
  });

  // 목록 조회
  const fetchScraps = async (pageNum = 0) => {
    try {
      setLoading(true);
      setErrMsg("");

      const res = await axiosInstance.get(SCRAPS_URL, {
        params: { page: pageNum, size: PAGE_SIZE },
      });

      const d = res?.data ?? {};
      const rows = Array.isArray(d.scraps) ? d.scraps : [];
      setItems(rows.map(normalizePost));

      const tp =
        typeof d.totalPages === "number" && d.totalPages > 0
          ? d.totalPages
          : typeof d.totalElements === "number"
          ? Math.max(1, Math.ceil(d.totalElements / PAGE_SIZE))
          : 1;
      setTotalPages(tp);
      setPage(pageNum);
    } catch (error) {
      console.error("스크랩한 게시물 불러오기 실패:", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "스크랩한 게시물을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
      setErrMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScraps(0);
  }, []);

  // 게시물 이동
  const goPost = (p) => {
    if (!p.id || !p.board) {
      alert("게시물 정보를 찾을 수 없어요.");
      return;
    }
    const bt = String(p.board).toLowerCase();
    const url = `/main/community/${encodeURIComponent(bt)}/post/${encodeURIComponent(p.id)}`;
    navigate(url, { state: { from: "my-scraps" } });
    onItemClick(p);
  };

  // 스크랩 해제 
  const handleUnscrap = async (e, p) => {
    e.stopPropagation();
    if (!p.id || unscrapingId) return;

    try {
      setUnscrapingId(p.id);
      await axiosInstance.post(`/post/${p.id}/unScrap`);
      setItems((prev) => prev.filter((it) => it.id !== p.id));
      onUnscrap(p.id);
    } catch (err) {
      console.error("스크랩 해제 실패:", err);
      alert("스크랩을 해제하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setUnscrapingId(null);
    }
  };

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="MyScraps">
      <h2>스크랩 한 게시물</h2>

      <div className="scraps-card">
        {loading ? (
          <div className="empty-state">불러오는 중...</div>
        ) : errMsg ? (
          <div className="empty-state scraps-error">{errMsg}</div>
        ) : items.length === 0 ? (
          <div className="scraps-empty">
            <p className="empty-title">스크랩한 게시물이 없습니다.</p>
            <p className="empty-desc">
              마음에 드는 글에{" "}
              <Bookmark
                size={14}
                style={{ verticalAlign: "middle" }}
                aria-label="북마크"
                title="북마크"
              />
              를 눌러 보관해 보세요.
            </p>
          </div>
        ) : (
          <ul className="scraps-list">
            {items.map((p) => (
              <li
                key={p.id}
                className="scrap-item"
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
                <div className="scrap-content">
                  <p className="scrap-title">{p.title}</p>
                  {p.excerpt && <p className="scrap-excerpt">{p.excerpt}</p>}
                  {(p.author || p.createdAt || p.likeCount != null || p.board) && (
                    <span className="scrap-meta">
                      {p.author && `@${p.author}`}
                      {p.createdAt && ` • ${formatDotDate(p.createdAt)}`}
                      {typeof p.likeCount === "number" && ` • ♥ ${p.likeCount}`}
                      {p.board && ` • ${getBoardLabel(p.board)}`}
                    </span>
                  )}
                </div>

                <button
                  className="unscrap-btn"
                  title="스크랩 해제"
                  aria-label="스크랩 해제"
                  onClick={(e) => handleUnscrap(e, p)}
                  disabled={unscrapingId === p.id}
                >
                  {unscrapingId === p.id ? "해제 중..." : "해제"}
                </button>

                <span className="scrap-chevron">›</span>
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
            if (canPrev) fetchScraps(page - 1);
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
            if (canNext) fetchScraps(page + 1);
          }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default MyScraps;
