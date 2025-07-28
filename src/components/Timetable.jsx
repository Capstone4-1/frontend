import React, { useEffect, useState } from "react";
import axiosInstance from "./utils/AxiosInstance";
import "./Timetable.css";

const Timetable = ({ refreshTrigger }) => { 
  const days = ["월", "화", "수", "목", "금"];
  const hours = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await axiosInstance.get("/lecture-room/mark");
        const lectures = res.data?.markedLecture ?? [];

        const scheduleBlocks = [];

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

            for (let i = startTime; i < endTime; i++) {
              const classHour = (i - 8).toString(); // 9시 = 1교시
              if (!hours.includes(classHour)) continue;
              scheduleBlocks.push({
                day: dayKor,
                hour: classHour,
                title: lec.title,
                color: lec.themeColor || "#ccc",
              });
            }
          });
        });

        setBlocks(scheduleBlocks);
      } catch (err) {
        console.error("시간표 로딩 실패:", err);
      }
    };

    fetchLectures();
  }, []); 

  const getBlock = (day, hour) =>
    blocks.find((b) => b.day === day && b.hour === hour);

  return (
    <div className="timetable-wrapper">
      <table className="timetable">
        <thead>
          <tr>
            <th></th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="time-cell">{hour}</td>
              {days.map((day) => {
                const block = getBlock(day, hour);
                return (
                  <td
                    key={`${day}-${hour}`}
                    className="timetable-cell"
                    title={block?.title || ""}
                    style={{
                      backgroundColor: block?.color || "transparent",
                      color: block ? "white" : "inherit",
                      fontWeight: block ? "bold" : "normal",
                      cursor: block ? "pointer" : "default",
                    }}
                  >
                    {/* 텍스트는 툴팁으로만 표시 */}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
