// 나의 활동
import { useEffect, useRef } from "react";
import "./MyActivity.css";
import MyComments from "./MyComments";
import MyPosts from "./MyPosts";
import MyFavorites from "./MyFavorites";
import { useLocation } from "react-router-dom";

const MyActivity = () => {
  const commentsRef = useRef(null);
  const postsRef = useRef(null);
  const favoritesRef = useRef(null); 

  const location = useLocation();

  useEffect(() => {
    const focusSection = location.state?.focusSection;
    if (!focusSection) return;

    let scrollTarget = null;
    if (focusSection === "comments") scrollTarget = commentsRef.current;
    else if (focusSection === "posts") scrollTarget = postsRef.current;
    else if (focusSection === "favorites") scrollTarget = favoritesRef.current; 

    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        scrollTarget?.focus();
      }, 400);
    }
  }, [location]);

  return (
    <div className="MyActivity">
      <h2>나의 활동</h2>

      <section ref={commentsRef} tabIndex={-1} className="activity-section">
        <MyComments />
      </section>

      <section ref={postsRef} tabIndex={-1} className="activity-section">
        <MyPosts />
      </section>

      <section ref={favoritesRef} tabIndex={-1} className="activity-section">
        <MyFavorites />
        </section>


      <section className="activity-section">
        <h3>기타 활동 1</h3>
        <p>임의의 추가 활동 내용입니다.</p>
      </section>

      <section className="activity-section">
        <h3>기타 활동 2</h3>
        <p>임의의 추가 활동 내용입니다.</p>
      </section>
    </div>
  );
};

export default MyActivity;
