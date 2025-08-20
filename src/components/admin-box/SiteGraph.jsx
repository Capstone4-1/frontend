import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./SiteGraph.css";

const dummyData = {
  daily: [
    { date: "08-14", visitors: 120, posts: 12, comments: 30 },
    { date: "08-15", visitors: 98, posts: 15, comments: 28 },
    { date: "08-16", visitors: 150, posts: 18, comments: 40 },
    { date: "08-17", visitors: 200, posts: 22, comments: 55 },
    { date: "08-18", visitors: 180, posts: 19, comments: 48 },
    { date: "08-19", visitors: 220, posts: 25, comments: 60 },
    { date: "08-20", visitors: 170, posts: 20, comments: 42 },
  ],
  weekly: [
    { date: "1주차", visitors: 800, posts: 60, comments: 150 },
    { date: "2주차", visitors: 950, posts: 72, comments: 180 },
    { date: "3주차", visitors: 700, posts: 55, comments: 140 },
    { date: "4주차", visitors: 1100, posts: 80, comments: 200 },
  ],
  monthly: [
    { date: "3월", visitors: 3000, posts: 250, comments: 600 },
    { date: "4월", visitors: 4200, posts: 280, comments: 720 },
    { date: "5월", visitors: 3900, posts: 270, comments: 650 },
    { date: "6월", visitors: 4800, posts: 300, comments: 750 },
    { date: "7월", visitors: 5200, posts: 330, comments: 820 },
    { date: "8월", visitors: 4500, posts: 310, comments: 700 },
  ],
};

const SiteGraph = () => {
  const [range, setRange] = useState("daily");
  const [data, setData] = useState(dummyData.daily);

  useEffect(() => {
    setData(dummyData[range]);
  }, [range]);

  return (
    <div className="SiteGraph">
      <h2>📊 활동 통계</h2>

      {/* 필터 버튼 */}
      <div className="range-selector">
        <button className={range === "daily" ? "active" : ""} onClick={() => setRange("daily")}>일별</button>
        <button className={range === "weekly" ? "active" : ""} onClick={() => setRange("weekly")}>주간</button>
        <button className={range === "monthly" ? "active" : ""} onClick={() => setRange("monthly")}>월간</button>
      </div>

      {/* 📈 활동 그래프 */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={0} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="visitors" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} name="방문자" />
            <Line type="monotone" dataKey="posts" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} name="게시글" />
            <Line type="monotone" dataKey="comments" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="댓글" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 요약 정보 */}
      <div className="stats-summary">
        <div className="stat-item">
          <span className="label">총 방문자</span>
          <span className="value">{data.reduce((sum, d) => sum + d.visitors, 0).toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="label">총 게시글</span>
          <span className="value">{data.reduce((sum, d) => sum + d.posts, 0).toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="label">총 댓글</span>
          <span className="value">{data.reduce((sum, d) => sum + d.comments, 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SiteGraph;
