import BookMarketBoard from "./BookMarketBoard";
import DailyMenu from "./DailyMenu";
import "./Dashboard.css";
import InfoBox from "./InfoBox";
import QuickLinks from "./QuickLinks";
import { BookOpenCheck } from "lucide-react";
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
                            <InfoBox
                                boardTypes={[
                                    "NOTICE",
                                    "NOTICE_SC",
                                    "NOTICE_UNIV",
                                    "NOTICE_DEPT",
                                ]}
                                title="공지사항"
                            />
                        </section>
                        <section className="inner-container">
                            <InfoBox
                                boardTypes={["FREE", "SECRET", "REVIEW"]}
                                title="커뮤니티"
                            />
                        </section>
                    </div>

                    <section className="div-area marketplace">
                        <header className="header-area">
                            <h1 className="title">
                                <BookOpenCheck /> 중고책 사고팔기
                            </h1>
                        </header>
                        <section className="content-area">
                            <BookMarketBoard title="장터" boardType="MARKET" />
                        </section>
                    </section>
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
