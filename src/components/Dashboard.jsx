import BookMarketBoard from "./BookMarketBoard";
import DailyMenu from "./DailyMenu";
import "./Dashboard.css";
import HelpGuide from "./HelpGuide";
import InfoBox from "./InfoBox";
import MainBanner from "./MainBanner";
import MediaBox from "./MediaBox";
import QuickLinks from "./QuickLinks";
import { BookOpenCheck, Megaphone, Coffee } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "./utils/AxiosInstance";

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventBanners, setEventBanners] = useState([]);
    const [mediaList, setMediaList] = useState([]);

    // 👉 서버에서 배너/미디어 조회
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const { data } = await axiosInstance.get("/banners");

                setEventBanners(
                    data.normalBanners.map((b) => ({
                        id: b.id,
                        title: b.title,
                        description: b.content,
                        link: b.targetUrl,
                    }))
                );

                setMediaList(
                    data.mediaBanners.map((m) => ({
                        id: m.id,
                        videoUrl: m.targetUrl,
                    }))
                );
            } catch (err) {
                console.error(err);
            }
        };

        fetchBanners();
    }, []);

    return (
        <div className="Dashboard">
            <div className="Content-container">
                <div className="main-container">
                    <QuickLinks />

                    {/* 공지사항 / 커뮤니티 */}
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

                    {/* 이벤트 배너 + 미디어 (조건부 렌더링) */}
                    {(eventBanners.length > 0 || mediaList.length > 0) && (
                        <div className="div-area">
                            {/* 이벤트 배너 영역 */}
                            {eventBanners.length > 0 && (
                                <div className="banner-area">
                                    <h1 className="title">
                                         학생회 이벤트
                                    </h1>
                                    <section className="banner-list">
                                        <ul>
                                            {eventBanners.map((event) => (
                                                <li key={event.id}>
                                                    <MainBanner
                                                        title={event.title}
                                                        description={event.description}
                                                        link={event.link}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                </div>
                            )}

                            {/* 미디어 영역 */}
                            {mediaList.length > 0 && (
                                <div className="media-list">
                                    {mediaList.map((m) => (
                                        <MediaBox key={m.id} videoUrl={m.videoUrl} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 중고책 장터 */}
                    <section className="div-area marketplace">
                        <header className="header-area">
                            <h1 className="title">
                                 중고책 사고팔기
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
                                 오늘의 식단을 확인하세요
                            </h1>
                        </header>
                        <div className="daily-area desktop-only">
                            <DailyMenu selectedDate={selectedDate} />
                        </div>
                    </section>

                    <HelpGuide />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
