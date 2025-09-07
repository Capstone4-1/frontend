// components/PostTag.jsx
import "./PostTag.css";
import { boardConfig } from "./utils/boardUtils";
boardConfig

// boardConfig 기반으로 tagStyles 생성
const tagStyles = boardConfig.reduce((acc, board) => {
  acc[board.type] = { label: board.tagLabel, color: board.color };
  return acc;
}, {});

const PostTag = ({ type }) => {
  if (!type) return null;

  const tag = tagStyles[type.toUpperCase()]; // 대소문자 안전 처리
  if (!tag) return null;

  return (
    <span className="PostTag" style={{ backgroundColor: tag.color }}>
      {tag.label}
    </span>
  );
};

export default PostTag;
