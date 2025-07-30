import { useEffect, useRef } from "react";
import "./MyActivity.css";
import MyComments from "./MyComments";
import MyPosts from "./MyPosts";
import { useLocation } from "react-router-dom";

const MyActivity = () => {
    const commentsRef = useRef(null);
    const postsRef = useRef(null);

    const location = useLocation();

    useEffect(() => {
        const focusSection = location.state?.focusSection;
        if (!focusSection) return;

        let scrollTarget = null;
        if (focusSection === "comments") scrollTarget = commentsRef.current;
        else if (focusSection === "posts") scrollTarget = postsRef.current;

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

            {/* 임의 데이터 샘플 섹션들 */}
            <section className="activity-section">
                <h3>좋아요 한 게시물</h3>
                <p>최근 좋아요 한 게시물 목록이 여기에 표시됩니다.</p>
            </section>

            <section className="activity-section">
                <h3>기타 활동 1</h3>
                <p>임의의 추가 활동 내용입니다.</p>
            </section>

            <section className="activity-section">
                <h3>기타 활동 2</h3>
                <p>임의의 추가 활동 내용입니다.</p>
            </section>

            <section ref={postsRef} tabIndex={-1} className="activity-section">
                <MyPosts />
            </section>
        </div>
    );
};

export default MyActivity;
