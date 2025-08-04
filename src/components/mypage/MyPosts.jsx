import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import "./MyPosts.css";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = async () => {
    try {
      const res = await axiosInstance.get("post/my-posts", {
        params: { pageSize: 8 }, // 필요시 변경 가능
      });
      setPosts(res.data.posts || []); // posts 키에 글 배열이 있다고 가정
    } catch (error) {
      console.error("내 글 목록 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  if (loading) return <div className="MyPosts">불러오는 중...</div>;

  return (
    <div className="MyPosts">
      <h2>내가 쓴 글</h2>
      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              onClick={() => alert(`포스트 ${post.id} 클릭됨!`)}
            >
              {post.title}
            </div>
          ))
        ) : (
          <div className="no-posts">작성한 글이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
