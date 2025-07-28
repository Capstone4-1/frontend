import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./utils/AxiosInstance";
import "./MyLectureList.css";

const MyLectureList = () => {
  const [lectureList, setLectureList] = useState([]);

  useEffect(() => {
  const fetchFavorites = async () => {
    try {
      const res = await axiosInstance.get("/lecture-room/mark");
      console.log("✅ 즐겨찾기 응답:", res.data);
      const favorites = res.data?.markedLecture ?? [];

      // ✅ 정렬 추가
      favorites.sort((a, b) => {
        if (a.grade !== b.grade) {
          return a.grade - b.grade;
        }
        return a.semester - b.semester;
      });

      setLectureList(favorites);
    } catch (error) {
      console.error("❌ 즐겨찾기 강의 불러오기 실패:", error);
      setLectureList([]);
    }
  };

  fetchFavorites();

  const handleUpdate = () => fetchFavorites();
  window.addEventListener("favoritesUpdated", handleUpdate);
  return () => window.removeEventListener("favoritesUpdated", handleUpdate);
}, []);


  return (
    <div className="lecture-card-grid">
      {lectureList.length > 0 ? (
        lectureList.map((lec) => (
          <Link
            to={`/main/study-dashboard/${lec.id}`}
            key={lec.id}
            className="lecture-card"
            style={{ borderLeft: `6px solid ${lec.themeColor || "#3366cc"}` }}
          >
            <div className="lecture-info">
              <h3>{lec.title}</h3>
              <p>{lec.professorName} 교수님</p>
              <p>{lec.grade}학년 {lec.semester}학기</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="no-lecture">즐겨찾기한 강의가 없습니다.</p>
      )}
    </div>
  );
};

export default MyLectureList;
