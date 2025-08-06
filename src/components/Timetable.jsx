import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./utils/AxiosInstance";
import "./Timetable.css";

const Timetable = ({ onCreditChange }) => {
  const navigate = useNavigate();
  const days = ["월", "화", "수", "목", "금"];
  const hours = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [blocks, setBlocks] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchLectures = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/lecture-room/mark");
      const lectures = res.data?.markedLecture ?? [];

      const scheduleBlocks = [];
      let totalCredits = 0;

      lectures.forEach((lec) => {
        const schedules = lec.schedules;
        if (!schedules || !Array.isArray(schedules)) return;

        schedules.forEach(({ dow, startTime, endTime }) => {
          const dayMap = {
            MONDAY: "월",
            TUESDAY: "화",
            WEDNESDAY: "수",
            THURSDAY: "목",
            FRIDAY: "금",
          };
          const dayKor = dayMap[dow];

          const duration = endTime - startTime;
          totalCredits += duration;

          for (let i = startTime; i < endTime; i++) {
            const classHour = (i - 8).toString();
            if (!hours.includes(classHour)) continue;
            scheduleBlocks.push({
              id: lec.id,
              day: dayKor,
              hour: classHour,
              title: lec.title,
              professor: lec.professorName || "",
              room: lec.room || "",
              color: lec.themeColor || "#ccc",
            });
          }
        });
      });

      setBlocks(scheduleBlocks);
      if (onCreditChange) {
        onCreditChange(totalCredits);
      }
    } catch (err) {
      console.error("시간표 로딩 실패:", err);
    }
  }, [onCreditChange]);

  useEffect(() => {
    fetchLectures();

    const handler = () => {
      fetchLectures();
    };

    window.addEventListener("favoritesUpdated", handler);

    return () => {
      window.removeEventListener("favoritesUpdated", handler);
    };
  }, [fetchLectures]);

  const getBlock = (day, hour) =>
    blocks.find((b) => b.day === day && b.hour === hour);

  const handleDoubleClick = (block) => {
    navigate(`/main/study-dashboard/${block.id}`);
  };

  const handleDeleteClick = (lecture) => {
    setSelectedLecture(lecture);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLecture) return;
    try {
      await axiosInstance.delete("/lecture-room/mark", {
        params: { lectureRoomId: selectedLecture.id },
      });
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch (err) {
      console.error("즐겨찾기 해제 실패:", err);
    } finally {
      setShowDeleteModal(false);
      setSelectedLecture(null);
    }
  };

  return (
    <div className="timetable-wrapper">
      <table className="timetable">
        <thead>
          <tr>
            <th></th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {hours.map((hour, hourIndex) => {
            const displayTime = `${parseInt(hour) + 8}시`;
            return (
              <tr key={hour}>
                <td className="time-cell">{hour}교시</td>
                {days.map((day) => {
                  const block = getBlock(day, hour);
                  const isMerged = (() => {
                    if (hourIndex > 0) {
                      const prevBlock = getBlock(day, hours[hourIndex - 1]);
                      return (
                        prevBlock &&
                        block &&
                        prevBlock.title === block.title
                      );
                    }
                    return false;
                  })();

                  if (isMerged) return null;

                  let spanCount = 1;
                  for (let i = hourIndex + 1; i < hours.length; i++) {
                    const nextBlock = getBlock(day, hours[i]);
                    if (nextBlock && block && nextBlock.title === block.title) {
                      spanCount++;
                    } else {
                      break;
                    }
                  }

                  return (
                    <td
                      key={`${day}-${hour}`}
                      className={`timetable-cell ${block ? "active" : ""}`}
                      rowSpan={spanCount}
                      style={{
                        backgroundColor: block?.color || "transparent",
                        cursor: block ? "pointer" : "default",
                        position: "relative",
                      }}
                      onDoubleClick={() => block && handleDoubleClick(block)}
                    >
                      {block && (
                        <div
                          className="block-content"
                          onMouseEnter={(e) =>
                            e.currentTarget.classList.add("hovered")
                          }
                          onMouseLeave={(e) =>
                            e.currentTarget.classList.remove("hovered")
                          }
                        >
                          <div className="lecture-title">{block.title}</div>
                          <div className="lecture-detail">
                            {block.professor} {block.room}
                          </div>
                          <button
                            className="delete-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(block);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="time-cell">{displayTime}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>강의를 삭제하시겠습니까?</p>
            <button onClick={handleConfirmDelete}>확인</button>
            <button onClick={() => setShowDeleteModal(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
