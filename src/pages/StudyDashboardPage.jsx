import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Panel from "../components/Panel";
import MyLectureList from "../components/MyLectureList"; 
import "./StudyDashboardPage.css";

const StudyDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSubPage = location.pathname !== "/main/study-dashboard";

  return (
    <div className="StudyDashboardPage">
      <Header title={"스터디룸"} />
      <div className="Panel-Dashboard-Container">
        <div className="Panel-container">
          <Panel mode="study" />
        </div>
        <div className="Dashboard-container">
          {isSubPage ? <Outlet /> : <MyLectureList />} 
        </div>
      </div>
    </div>
  );
};

export default StudyDashboardPage;
