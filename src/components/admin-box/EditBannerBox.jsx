import { useState } from "react";
import "./EditBannerBox.css";

const EditBannerBox = () => {
    // 👉 초기 상태 (Dashboard에 있던 이벤트/미디어 더미 데이터)
    const [banners, setBanners] = useState([
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
    ]);

    const [mediaList, setMediaList] = useState([
        { videoUrl: "https://www.youtube.com/watch?v=5MWT_doo68k" },
        {
            videoUrl:
                "https://www.youtube.com/watch?v=HOoRnv3lA0k&list=RDHOoRnv3lA0k&start_radio=1",
        },
    ]);

    // 🔹 배너 추가
    const addBanner = () => {
        setBanners([
            ...banners,
            { title: "새 배너", description: "", link: "" },
        ]);
    };

    // 🔹 배너 수정
    const updateBanner = (index, field, value) => {
        const newBanners = [...banners];
        newBanners[index][field] = value;
        setBanners(newBanners);
    };

    // 🔹 배너 삭제
    const deleteBanner = (index) => {
        setBanners(banners.filter((_, i) => i !== index));
    };

    // 🔹 미디어 추가
    const addMedia = () => {
        setMediaList([...mediaList, { videoUrl: "" }]);
    };

    // 🔹 미디어 수정
    const updateMedia = (index, value) => {
        const newMediaList = [...mediaList];
        newMediaList[index].videoUrl = value;
        setMediaList(newMediaList);
    };

    // 🔹 미디어 삭제
    const deleteMedia = (index) => {
        setMediaList(mediaList.filter((_, i) => i !== index));
    };

    return (
        <div className="EditBannerBox">
        

            {/* 배너 수정 영역 */}
            <section className="edit-section">
                <h3>📢 이벤트 배너</h3>
                {banners.map((banner, idx) => (
                    <div key={idx} className="edit-card">
                        <input
                            type="text"
                            placeholder="배너 제목"
                            value={banner.title}
                            onChange={(e) =>
                                updateBanner(idx, "title", e.target.value)
                            }
                        />
                        <textarea
                            placeholder="배너 설명"
                            value={banner.description}
                            onChange={(e) =>
                                updateBanner(
                                    idx,
                                    "description",
                                    e.target.value
                                )
                            }
                        />
                        <input
                            type="text"
                            placeholder="배너 링크"
                            value={banner.link}
                            onChange={(e) =>
                                updateBanner(idx, "link", e.target.value)
                            }
                        />
                        <button
                            className="delete-btn"
                            onClick={() => deleteBanner(idx)}
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </section>

            {/* 미디어 수정 영역 */}
            <section className="edit-section">
                <h3>🎥 미디어 영상</h3>
                {mediaList.map((media, idx) => (
                    <div key={idx} className="edit-card">
                        <input
                            type="text"
                            placeholder="YouTube URL"
                            value={media.videoUrl}
                            onChange={(e) => updateMedia(idx, e.target.value)}
                        />
                        <button
                            className="delete-btn"
                            onClick={() => deleteMedia(idx)}
                        >
                            삭제
                        </button>
                    </div>
                ))}
                
            </section>

            <section className="save-section">
                <button
                    onClick={() => {
                        console.log("✅ 저장된 배너:", banners);
                        console.log("✅ 저장된 미디어:", mediaList);
                        alert("저장 완료! (현재는 콘솔에 출력됨)");
                    }}
                >
                    저장하기
                </button>
            </section>
        </div>
    );
};

export default EditBannerBox;
