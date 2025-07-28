import "./StudyNavi.css";
import { Link } from "react-router-dom";
import { LayoutDashboard, Search } from "lucide-react";

const StudyNavi = () => {
  
  return (
    <div className="StudyNavi">
      <Link to="/main/study-dashboard" className="study-link">
        <LayoutDashboard size={18} style={{ marginRight: "6px" }} />
        학습 대시보드로 돌아가기
      </Link>
      <Link to="/main/study-dashboard/lectures" className="study-link">
        <Search size={18} style={{ marginRight: "6px" }} />
        강의실 찾아보기
      </Link>
    </div>
  );
};

export default StudyNavi;
