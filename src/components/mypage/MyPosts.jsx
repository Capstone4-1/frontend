import "./MyPosts.css";

const dummyPosts = [
  {
    id: 1,
    title: "React에서 상태 관리하기",
  },
  {
    id: 2,
    title: "Spring Boot와 JWT 인증",
  },
  {
    id: 3,
    title: "프론트엔드에서 API 호출 최적화",
  },
];

const MyPosts = () => {
  return (
    <div className="MyPosts">
      <h2>내가 쓴 글</h2>
      <div className="posts-list">
        {dummyPosts.map((post) => (
          <div
            key={post.id}
            className="post-card"
            onClick={() => alert(`포스트 ${post.id} 클릭됨!`)}
          >
            {post.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
