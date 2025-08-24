import React, { useEffect, useState } from "react";
import "./MyScraps.css";
import axiosInstance from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

const MyScraps = ({
  onItemClick = () => {},
  onUnscrap = () => {},
  page = 0,
  pageSize = 10,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [unscrapingId, setUnscrapingId] = useState(null);
  const navigate = useNavigate();

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
    const fetchScraps = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const res = await axiosInstance.get("/post/my-scraps", {
          params: { page, pageSize },
        });
        const list = (res?.data?.posts || []).map(normalizePost);
        setItems(list);
      } catch (error) {
        console.error("스크랩한 게시물 불러오기 실패:", error);
        setErrMsg("스크랩한 게시물을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };
    fetchScraps();
  }, [page, pageSize]);

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
      await axiosInstance.post(`/post/${p.id}/unscrap`);
      setItems((prev) => prev.filter((it) => it.id !== p.id));
      onUnscrap(p.id);
    } catch (err) {
      console.error("스크랩 해제 실패:", err);
      alert("스크랩을 해제하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setUnscrapingId(null);
    }
  };

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
            <p className="empty-desc">나중에 다시 보고 싶은 글을 스크랩해 보세요.</p>
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
                  <span className="scrap-meta">
                    @{p.author}
                    {p.createdAt && ` • ${new Date(p.createdAt).toLocaleDateString()}`}
                    {typeof p.likeCount === "number" && ` • ♥ ${p.likeCount}`}
                    {p.board && ` • ${p.board}`}
                  </span>
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
    </div>
  );
};

export default MyScraps;
