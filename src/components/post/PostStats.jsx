import { Eye, Heart, MessageCircleMore } from "lucide-react";
import "./PostStats.css";

const PostStats = ({ likeCount, commentCount, viewCount }) => {
  return (
    <div className="post-stats">
      <p className="like">
        <Heart />
        <span>{likeCount}</span>
      </p>
      <p className="comment">
        <MessageCircleMore />
        <span>{commentCount}</span>
      </p>
      <p className="view">
        <Eye />
        <span>{viewCount}</span>
      </p>
    </div>
  );
};

export default PostStats;