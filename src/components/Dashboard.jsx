import "./Dashboard.css";
import BookMarketBoard from "./BookMarketBoard";
import InfoBox from "./InfoBox";
import QuickLinks from "./QuickLinks";
import Friends from "./Friends";
import DailyMenu from "./DailyMenu";
import { useState } from "react";
const Dashboard = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div className="Dashboard">
      <div className="Content-container">
        <div className="main-container">
          <QuickLinks />
          <div className="div-area info-area">
            <section className="inner-container">
              <InfoBox boardTypes={["NOTICE", "NOTICE_C"]} title="공지사항" />
            </section>
            <section className="inner-container">
              <InfoBox
                boardTypes={["FREE", "SECRET", "REVIEW"]}
                title="커뮤니티"
              />
            </section>
          </div>
          
          <div className="div-area">
            <div className="left-half">
              <section className="inner-container">
                <Friends />
              </section>
            </div>
            <div className="right-half">
              <section className="inner-container">
                <BookMarketBoard title="장터" boardType="MARKET" />
              </section>
            </div>
          </div>
          <div className="daily-area">
            <DailyMenu selectedDate={selectedDate} /> 
          </div>
        </div>
        {/* <aside>
          <ul>
            <li>
              <div>첫 번째 메뉴sdfㄴㅇㄴㅇㅇㅇㅇㅇㅇㄹㅇㄴsdfsdsdfsd</div>
            </li>
            <li>
              <div>두 번째
                <br />
                <br /> 메ㄹㅇㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ뉴</div>
            </li>
          </ul>
        </aside> */}

      </div>
    </div>
  );
};

export default Dashboard;
