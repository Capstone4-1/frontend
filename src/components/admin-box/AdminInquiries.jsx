// AdminInquiries.jsx
import { useState } from "react";
import "./AdminInquiries.css";

const dummyInquiries = [
  { id: 1, user: "홍길동", title: "로그인 문제", status: "처리중", date: "2025-08-20" },
  { id: 2, user: "김철수", title: "게시글 작성 오류", status: "완료", date: "2025-08-19" },
  { id: 3, user: "이영희", title: "비밀번호 초기화 요청", status: "처리중", date: "2025-08-18" },
  { id: 4, user: "박민수", title: "알림 수신 문제", status: "완료", date: "2025-08-17" },
  { id: 5, user: "최지훈", title: "프로필 사진 업로드 실패", status: "처리중", date: "2025-08-16" },
];

const AdminInquiries = () => {
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");

  const filtered = dummyInquiries.filter((inq) => {
    return (filter === "전체" || inq.status === filter) &&
           (inq.title.includes(search) || inq.user.includes(search));
  });

  return (
    <div className="AdminInquiries">
      <h2>📬 문의 내역</h2>

      {/* 필터 & 검색 */}
      <div className="controls">
        <div className="status-filter">
          {["전체", "처리중", "완료"].map((s) => (
            <button
              key={s}
              className={filter === s ? "active" : ""}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="작성자 또는 제목 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 문의 목록 */}
      <table>
        <thead>
          <tr>
            <th>작성자</th>
            <th>제목</th>
            <th>상태</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((inq) => (
            <tr key={inq.id}>
              <td>{inq.user}</td>
              <td>{inq.title}</td>
              <td className={inq.status === "완료" ? "completed" : "pending"}>
                {inq.status}
              </td>
              <td>{inq.date}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>조회된 문의가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInquiries;
