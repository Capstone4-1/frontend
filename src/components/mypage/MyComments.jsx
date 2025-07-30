import "./MyComments.css";

const dummyComments = [
  {
    id: 1,
    content: "이 컴포넌트는 상태 관리가 중요합니다.",
  },
  {
    id: 2,
    content: "JWT 인증 구현하는 방법 공유해요!",
  },
  {
    id: 3,
    content: "API 호출 최적화가 성능에 큰 영향을 줍니다.",
  },
   {
    id: 4,
    content: "API 호출 최적화가 성능에 큰 영향을 줍니다.",
  },
   {
    id: 5,
    content: "API 호출 최적화가 성능에 큰 영향을 줍니다.",
  },
   {
    id: 6,
    content: "API 호출 최적화가 성능에 큰 영향을 줍니다.",
  },
   {
    id: 7,
    content: "API 호출 최적화가 성능에 큰 영향을 줍니다.",
  },
  

];

const MyComments = () => {
  return (
    <div className="MyComments">
      <h2>내가 쓴 댓글</h2>
      <div className="comments-list">
        {dummyComments.map((comment) => (
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
