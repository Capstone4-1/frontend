import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Timetable from "../components/Timetable";
import StudyNavi from "../components/StudyNavi";
import "./StudyDashboardPage.css";

const StudyDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const [credit, setCredit] = useState(0);

  const handleCreditChange = (newCredit) => {
    setCredit(newCredit);
  };

  return (
    <div className="StudyDashboardPage">
      <Header title={"시간표"} />
      <div className="DashboardLayout">
        <div className="TimetableSection">
          <Timetable onCreditChange={handleCreditChange} />
        </div>
        <div className="SidePanelSection">
          <select className="SemesterSelect">
            <option>2025년 2학기</option>
          </select>
          <div className="CreditInfoBox">
            <div className="Title">시간표</div>
            <div className="SubInfo">
              <span className="Credit">{credit} 학점</span>
            </div>
          </div>
          <StudyNavi />
        </div>
        <div className="ContentSection">  {/* ✅ 오른쪽 컨텐츠 영역 추가 */}
          <Outlet />  {/* ✅ 이거 필수 */}
        </div>
      </div>
    </div>
  );
};

export default StudyDashboardPage;
