import "./LectureCard.css";
import { Link } from "react-router-dom";

const LectureCard = ({ lecture }) => {
  return (
    <Link
      to={`/main/study-dashboard/${lecture.id}`}
      className="lecture-card"
      state={{ lecture }}
      style={{ borderLeft: `5px solid ${lecture.themeColor}` }}
    >
      <div className="lecture-card-main">
        <h3 className="lecture-title">{lecture.title}</h3>
        
        <p className="lecture-meta">
          {lecture.grade}학년 {lecture.semester}학기
        </p>
        <p className="lecture-professor">
          {lecture.professorName} 교수님
        </p>
        <p className="lecture-intro">
          {lecture.intro ? lecture.intro : "강의 소개가 없습니다."}
        </p>
      </div>

      <div className="marked-count">
        담은 수: <strong>{lecture.markedCount}</strong>명
      </div>
    </Link>
  );
};

export default LectureCard;
