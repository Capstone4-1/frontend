import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Timetable from "../components/Timetable";
import StudyNavi from "../components/StudyNavi";
import LectureCategoryBox from "../components/board-box/LectureCategoryBox";
import "./StudyDashboardPage.css";

const StudyDashboardPage = () => {
    const [credit, setCredit] = useState(0);
    const [isLectureBoxVisible, setIsLectureBoxVisible] = useState(false); // ✅ 강의목록 표시 여부

    const handleCreditChange = (newCredit) => {
        setCredit(newCredit);
    };

    const toggleLectureBox = () => {
        setIsLectureBoxVisible(!isLectureBoxVisible);
    };

    return (
        <div className="StudyDashboardPage">
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
                    <StudyNavi onToggleLectureBox={toggleLectureBox} />
                </div>
                <div className="ContentSection">
                    <Outlet />
                </div>
            </div>
            {isLectureBoxVisible && (
                <div className="BottomLectureBox">
                    <LectureCategoryBox />
                </div>
            )}
        </div>
    );
};

export default StudyDashboardPage;
