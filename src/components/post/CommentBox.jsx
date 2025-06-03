import ProfileTemplate from "../ProfileTemplate";
import "./CommentBox.css";

const CommentBox = ({ comment, handleCommentLike, boardType }) => {
    const formattedDate = new Date(comment.createdDate).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return (
        <div className="CommentBox">
            <div className="profile-content-box">
                <div>
                    <div>
                        {boardType === "SECRET" ? (
                            <div className="anonymous-nickname">익명</div>
                        ) : (
                            <ProfileTemplate
                                profileImageUrl={comment.writerProfileImageUrl}
                                name={comment.writerNickname}
                                id={comment.writerId}
                            />
                        )}
                    </div>
                    <div>
                        <p className="comment-date">{formattedDate}</p>
                    </div>
                </div>
                <div className="content-box">
                    {comment.text || comment.content}
                    <p></p>
                </div>
            </div>

            <button
                className="comment-like-button"
                onClick={() => handleCommentLike(comment.id)}
            >
                {comment.liked ? "❤️" : "🤍"}
            </button>
        </div>
    );
};

export default CommentBox;
