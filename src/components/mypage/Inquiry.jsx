import { useNavigate } from "react-router-dom";
import "./Inquiry.css";

export default function Inquiry() {
  const navigate = useNavigate();

  const inquiries = [
    {
      id: 1,
      title: "로그인 오류 문의",
      content: "로그인이 되지 않습니다. 비밀번호 재설정도 시도했어요.",
      answer: "서버 점검으로 인한 일시적 오류였습니다. 현재 정상화되었습니다.",
      status: "완료",
      answerDate: "2025-09-05",
      inquiryDate: "2025-09-03",
    },
    {
      id: 2,
      title: "회원탈퇴 경로 문의",
      content: "회원탈퇴 메뉴 위치가 어디인가요?",
      answer: "",
      status: "처리중",
      answerDate: "",
      inquiryDate: "2025-09-04",
    },
    {
      id: 3,
      title: "문의 답변 알림",
      content: "답변이 등록되면 알림이 오나요?",
      answer: "앱 푸시와 이메일로 동시에 안내됩니다.",
      status: "완료",
      answerDate: "2025-09-06",
      inquiryDate: "2025-09-05",
    },
  ];

  const goDetail = (item) => navigate(`/inquiry/${item.id}`, { state: { item } });

  return (
    <div className="Inquiry">
      <h2>문의내역</h2>

      <div className="inquiry-table-wrap">
        <table className="inquiry-table" role="table">
          <thead>
            <tr>
              <th scope="col">제목</th>
              <th scope="col">내용</th>
              <th scope="col">답변</th>
              <th scope="col">상태</th>
              <th scope="col">문의날짜</th>
              <th scope="col">답변날짜</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((q) => (
              <tr
                key={q.id}
                className="inquiry-row"
                tabIndex={0}
                onClick={() => goDetail(q)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goDetail(q);
                  }
                }}
                aria-label={`${q.title} 상세로 이동`}
              >
                <td>{q.title}</td>
                <td className="truncate">{q.content}</td>
                <td className="truncate">{q.answer || "—"}</td>
                <td>
                  <span
                    className={`status-badge ${
                      q.status === "완료" ? "done" : "pending"
                    }`}
                  >
                    {q.status}
                  </span>
                </td>
                <td>{q.inquiryDate}</td>
                <td>{q.answerDate || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
