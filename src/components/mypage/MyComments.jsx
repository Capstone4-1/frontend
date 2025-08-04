import { useEffect, useState } from "react";
import "./MyComments.css";
import axiosInstance from "../utils/AxiosInstance";

const MyComments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get("/post/my-comments", {
          params: { page: 0, pageSize: 10 },
        });
        setComments(res.data.posts || []);
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
      }
    };
    fetchComments();
  }, []);

  return (
    <div className="MyComments">
      <h2>내가 쓴 댓글</h2>
      <div className="comments-list">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="comment-item"
            onClick={() => alert(`댓글 ${comment.id} 클릭됨!`)}
          >
            {comment.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyComments;
