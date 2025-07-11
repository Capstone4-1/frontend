import "./Dashboard.css";
import JobInfoBoard from "./JobInfoBoard";
import BookMarketBoard from "./BookMarketBoard";
import { House } from "lucide-react";
import LectureRoomCard from "./LectureRoomCard";
import InfoBox from "./InfoBox";

const Dashboard = () => {
  return (
    <div className="Dashboard">
      <div className="Content-container">
        <div className="main-container">
          

          <div>
            <section className="inner-container">
              <InfoBox boardTypes={["NOTICE", "NOTICE_C"]} title="공지사항" />
            </section>
          </div>

          <div className="div-area">
            <div className="left-half">
              <section className="inner-container">
                <LectureRoomCard />
              </section>
              <section className="inner-container">
                <LectureRoomCard />
              </section>
            </div>
            <div className="right-half">
              <section className="inner-container">
                <BookMarketBoard title="장터" boardType="MARKET" />
              </section>
            </div>
          </div>

          <div>
            <section className="inner-container">
              <InfoBox
                boardTypes={["FREE", "SECRET", "REVIEW"]}
                title="커뮤니티"
              />
            </section>
          </div>
        </div>

        {/* 오른쪽 사이드바 */}
        <div className="rightside-container">
          <JobInfoBoard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
