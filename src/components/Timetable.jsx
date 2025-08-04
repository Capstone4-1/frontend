import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 navigate 추가
import axiosInstance from "./utils/AxiosInstance";
import "./Timetable.css";

const Timetable = ({ refreshTrigger, onCreditChange }) => {
  const navigate = useNavigate(); // 👈 navigate Hook
  const days = ["월", "화", "수", "목", "금"];
  const hours = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const fetchLectures = async () => {
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
                id: lec.id, // 👈 lectureId 포함시킴
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
    };

    fetchLectures();
  }, [onCreditChange]);

  const getBlock = (day, hour) =>
    blocks.find((b) => b.day === day && b.hour === hour);

  const handleDoubleClick = (block) => {
    navigate(`/main/study-dashboard/${block.id}`); // ✅ 정확한 경로

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
                        cursor: block ? "pointer" : "default", // 포인터 추가
                      }}
                      onDoubleClick={() => block && handleDoubleClick(block)} // 👈 더블클릭 이벤트
                    >
                      {block && (
                        <div className="block-content">
                          <div className="lecture-title">{block.title}</div>
                          <div className="lecture-detail">
                            {block.professor} {block.room}
                          </div>
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
    </div>
  );
};

export default Timetable;
