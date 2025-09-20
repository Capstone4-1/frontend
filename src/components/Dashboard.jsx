import BookMarketBoard from "./BookMarketBoard";
import DailyMenu from "./DailyMenu";
import "./Dashboard.css";
import HelpGuide from "./HelpGuide";
import InfoBox from "./InfoBox";
import MainBanner from "./MainBanner";
import MediaBox from "./MediaBox";
import QuickLinks from "./QuickLinks";
import { BookOpenCheck, Megaphone, Coffee } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // 👉 더미 데이터 (학생회 이벤트용)
    const eventBanners = [
        {
            title: "학생회 간식 나눔 🎉",
            description:
                "이번 주 금요일 오후 2시, 도서관 앞 광장에서 진행됩니다.<br/>선착순 200명!",
            link: "https://school-event.com/snack",
        },
        {
            title: "동아리 홍보주간",
            description:
                "관심 있는 동아리를 직접 만나보세요!<br/>학생회관 앞 잔디밭에서 진행됩니다.",
            link: "https://school-event.com/club",
        },
        {
            title: "체육대회 참가 신청 🏃‍♂️",
            description:
                "올해 체육대회 신청 접수를 시작합니다.<br/>신청 마감: 9월 25일",
            link: "https://school-event.com/sports",
        },
    ];

    return (
        <div className="Dashboard">
            <div className="Content-container">
                <div className="main-container">
                    <QuickLinks />
                    {/* 공지사항 / 커뮤니티 영역 */}
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

                    <div className="div-area">
                        <div className="banner-area">
                            <h1 className="title">
                                <Megaphone /> 학생회 이벤트
                            </h1>
                            <section className="banner-list">
                                <ul>
                                    {eventBanners.map((event, idx) => (
                                        <li key={idx}>
                                            <MainBanner
                                                title={event.title}
                                                description={event.description}
                                                image={event.image}
                                                link={event.link}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        <div className="media-list">
                            <MediaBox videoUrl="https://www.youtube.com/watch?v=5MWT_doo68k" />
                            <MediaBox videoUrl="https://www.youtube.com/watch?v=HOoRnv3lA0k&list=RDHOoRnv3lA0k&start_radio=1" />
                        </div>
                    </div>
                    {/* 학생회 / 배너 영역 */}

                    {/* 중고책 장터 */}
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

                    {/* 오늘의 식단 */}
                    <section>
                        <header className="header-area">
                            <h1 className="title">
                                <Coffee /> 오늘의 식단을 확인하세요
                            </h1>
                        </header>
                        <div className="daily-area desktop-only">
                            <DailyMenu selectedDate={selectedDate} />
                        </div>
                    </section>

                    <HelpGuide/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
