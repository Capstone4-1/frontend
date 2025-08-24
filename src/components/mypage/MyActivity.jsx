// 나의 활동
import { useEffect, useRef } from "react";
import "./MyActivity.css";
import MyComments from "./MyComments";
import MyPosts from "./MyPosts";
import MyFavorites from "./MyFavorites";
import MyScraps from "./MyScraps";
import { useLocation } from "react-router-dom";

const MyActivity = () => {
  const commentsRef = useRef(null);
  const postsRef = useRef(null);
  const favoritesRef = useRef(null);
  const scrapsRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    const focusSection = location.state?.focusSection;
    if (!focusSection) return;

    const refMap = {
      comments: commentsRef,
      posts: postsRef,
      favorites: favoritesRef,
      scraps: scrapsRef,
    };

    const target = refMap[focusSection]?.current;
    if (!target) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    target.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });

    const timer = setTimeout(() => target?.focus?.(), prefersReduced ? 0 : 300);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="MyActivity">
      <h2>나의 활동</h2>

      <section
        ref={commentsRef}
        id="comments"
        tabIndex={-1}
        className="activity-section"
        aria-label="작성한 댓글 섹션"
      >
        <MyComments />
      </section>

      <section
        ref={postsRef}
        id="posts"
        tabIndex={-1}
        className="activity-section"
        aria-label="작성한 글 섹션"
      >
        <MyPosts />
      </section>

      <section
        ref={favoritesRef}
        id="favorites"
        tabIndex={-1}
        className="activity-section"
        aria-label="좋아요 한 게시물 섹션"
      >
        <MyFavorites />
      </section>

      <section
        ref={scrapsRef}
        id="scraps"
        tabIndex={-1}
        className="activity-section"
        aria-label="스크랩 한 게시물 섹션"
      >
        <MyScraps />
      </section>
    </div>
  );
};

export default MyActivity;
