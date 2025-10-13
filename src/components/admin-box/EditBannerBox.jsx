// EditBannerBox.jsx
import { useState, useEffect } from "react";
import "./EditBannerBox.css";
import axiosInstance from "../utils/AxiosInstance";
import HelpGuide from "../HelpGuide";

const EditBannerBox = () => {
  const [banners, setBanners] = useState([]);
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axiosInstance.get("/banners");
        setBanners(data.normalBanners.map(b => ({
          id: b.id,
          title: b.title || "",
          description: b.content || "",
          link: b.targetUrl || "",
        })));
        setMediaList(data.mediaBanners.map(m => ({
          id: m.id,
          videoUrl: m.targetUrl || "",
        })));
      } catch {
        alert("배너 조회 중 오류 😢");
      }
    };
    fetchBanners();
  }, []);

  const addBanner = () => {
    if (banners.length >= 6) return alert("배너는 최대 6개까지 추가 가능합니다.");
    setBanners([...banners, { title: "", description: "", link: "" }]);
  };
  const updateBanner = (i, field, value) => {
    const copy = [...banners];
    copy[i][field] = value;
    setBanners(copy);
  };
  const deleteBanner = async (i, id) => {
    if (id) await axiosInstance.delete(`/banners/${id}`).catch(() => alert("배너 삭제 실패 😢"));
    setBanners(banners.filter((_, idx) => idx !== i));
  };

  const addMedia = () => {
    if (mediaList.length >= 3) return alert("미디어는 최대 3개까지 추가 가능합니다.");
    setMediaList([...mediaList, { videoUrl: "" }]);
  };
  const updateMedia = (i, value) => {
    const copy = [...mediaList];
    copy[i].videoUrl = value;
    setMediaList(copy);
  };
  const deleteMedia = async (i, id) => {
    if (id) await axiosInstance.delete(`/banners/${id}`).catch(() => alert("미디어 삭제 실패 😢"));
    setMediaList(mediaList.filter((_, idx) => idx !== i));
  };

  const saveBanners = async () => {
    try {
      const payload = [
        ...banners.map((b, i) => ({
          title: b.title,
          content: b.description,
          targetUrl: b.link,
          bannerType: "NORMAL",
          displayOrder: i,
        })),
        ...mediaList.map((m, i) => ({
          title: null,
          content: null,
          targetUrl: m.videoUrl,
          bannerType: "MEDIA",
          displayOrder: i,
        })),
      ];
      const { data } = await axiosInstance.post("/banners", payload);
      alert(data.message);
    } catch {
      alert("서버 요청 중 오류 😢");
    }
  };

  return (
    <div className="EditBannerBox">
      <section className="edit-section">
        <div className="title-area">
          <h3>이벤트 배너</h3>
          <HelpGuide title="이벤트 배너" content={"제목, 내용, 링크 를 추가하여 배너를 생성하면 메인화면에 표시됩니다.(바로가기 링크는 선택사항) => 내용이 너무 길면 잘릴수있습니다."} />
        </div>
        {banners.map((b, i) => (
          <div key={i} className="edit-card">
            <input type="text" placeholder="배너 제목" value={b.title} onChange={e => updateBanner(i, "title", e.target.value)} />
            <textarea placeholder="배너 설명" value={b.description} onChange={e => updateBanner(i, "description", e.target.value)} />
            <input type="text" placeholder="배너 링크" value={b.link} onChange={e => updateBanner(i, "link", e.target.value)} />
            <button className="delete-btn" onClick={() => deleteBanner(i, b.id)}>삭제</button>
          </div>
        ))}
        <button className="add-btn" onClick={addBanner}>+ 배너 추가</button>
      </section>

      <section className="edit-section">

        <div className="title-area">
          <h3>미디어 영상</h3>
          <HelpGuide title="미디어 배너" content={"게시를 원하는 유튜브 영상 url을 붙여넣기하면 메인화면에 표시됩니다"} />
        </div>
        {mediaList.map((m, i) => (
          <div key={i} className="edit-card">
            <input type="text" placeholder="YouTube URL" value={m.videoUrl} onChange={e => updateMedia(i, e.target.value)} />
            <button className="delete-btn" onClick={() => deleteMedia(i, m.id)}>삭제</button>
          </div>
        ))}
        <button className="add-btn" onClick={addMedia}>+ 미디어 추가</button>
      </section>

      <section className="save-section">
        <button onClick={saveBanners}>저장하기</button>
      </section>
    </div>
  );
};

export default EditBannerBox;
