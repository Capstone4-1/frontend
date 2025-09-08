import { useEffect, useState } from "react";
import "./AdminInquiries.css";
import axiosInstance from "../utils/AxiosInstance";
import InquiryDetail from "./InquiryDetail";
import { getCategoryLabel } from "../utils/InquiryUtils";

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const stateParam = filter === "처리중" ? "PROCESSING" : filter === "완료" ? "COMPLETED" : null;
      const res = await axiosInstance.get("/inquiries", {
        params: { page, size: 10, state: stateParam },
      });
      setInquiries(res.data._embedded?.inquiryDtoList ?? []);
      setTotalPages(res.data.page?.totalPages ?? 1);
    } catch (err) {
      console.error("문의 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filter, page]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const handleComplete = async (inquiryId, answer) => {
    await axiosInstance.post(`/inquiry/${inquiryId}/complete`, { answer });
    fetchInquiries();
    setSelectedInquiry(null);
  };

  const handleGrantRole = async (userId, role) => {
    try {
      await axiosInstance.post(`/admin/grant-role?userId=${userId}&role=${role}`);
      alert(`${role} 권한이 부여되었습니다.`);
      fetchInquiries();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "권한 부여 실패");
      fetchInquiries();
    }
  };

  const filtered = inquiries.filter(
    (inq) =>
      inq.title.includes(search) ||
      (inq.userName?.includes(search) ?? false)
  );

  return (
    <div className="AdminInquiries">
      <div className="list-panel">
        <h2>📬 문의 내역</h2>

        <div className="controls">
          <div className="status-filter">
            {["전체", "처리중", "완료"].map((s) => (
              <button
                key={s}
                className={filter === s ? "active" : ""}
                onClick={() => { setPage(0); setFilter(s); }}
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

        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>작성자</th>
                  <th>제목</th>
                  <th>카테고리</th>
                  <th>상태</th>
                  <th>접수 날짜</th>
                  <th>응답 날짜</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((inq) => (
                    <tr key={inq.id} className="inquiry-row" onClick={() => setSelectedInquiry(inq)}>
                      <td>{inq.userName || "-"}</td>
                      <td>{inq.title}</td>
                      <td>{getCategoryLabel(inq.category)}</td>
                      <td className={inq.state === "PROCESSING" ? "pending" : "completed"}>
                        {inq.state === "PROCESSING" ? "처리중" : "완료"}
                      </td>
                      <td>{formatDateTime(inq.createdAt)}</td>
                      <td>{formatDateTime(inq.completeDateTime)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>조회된 문의가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>◀ 이전</button>
              <span>{page + 1} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))} disabled={page + 1 >= totalPages}>다음 ▶</button>
            </div>
          </>
        )}
      </div>

      <div className="detail-panel">
        {selectedInquiry ? (
          <InquiryDetail
            inquiry={selectedInquiry}
            onBack={() => setSelectedInquiry(null)}
            onComplete={handleComplete}
            onGrantRole={handleGrantRole}
            formatDateTime={formatDateTime}
          />
        ) : (
          <div className="empty-detail">문의 항목을 선택하세요.</div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;
