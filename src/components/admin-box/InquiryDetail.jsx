import { useState } from "react";
import "./InquiryDetail.css";
import { getCategoryLabel } from "../utils/InquiryUtils";

const InquiryDetail = ({
  inquiry,
  onBack,
  onProcess,
  onComplete,
  onGrantRole,
  formatDateTime,
}) => {
  const [answer, setAnswer] = useState(inquiry.reply || ""); // 기존 답변 있으면 초기값
  const [roleGranted, setRoleGranted] = useState(false);

  const handleGrantRoleClick = async () => {
    await onGrantRole(inquiry.userId, inquiry.targetRole);
    setRoleGranted(true);
  };

  return (
    <div className="inquiry-detail">
      <button className="inquiry-detail-backBtn" onClick={onBack}>
        ← 뒤로가기
      </button>

      <h3 className="inquiry-detail-title">{inquiry.title}</h3>

      <div className="inquiry-detail-info">
        <p><strong>작성자:</strong> {inquiry.userName}</p>
        <p><strong>카테고리:</strong> {getCategoryLabel(inquiry.category)}</p>
        {inquiry.category === "ROLE_REQUEST" && (
          <p><strong>요청 권한:</strong> {inquiry.targetRole}</p>
        )}
        <p><strong>내용:</strong> {inquiry.content}</p>
        <p><strong>상태:</strong> {inquiry.state === "PROCESSING" ? "처리중" : "완료"}</p>
        <p><strong>등록일:</strong> {formatDateTime(inquiry.createdAt)}</p>
        {inquiry.completeDateTime && (
          <p><strong>완료일:</strong> {formatDateTime(inquiry.completeDateTime)}</p>
        )}
      </div>

      <div className="inquiry-detail-reply">
        {inquiry.state === "PROCESSING" ? (
          <textarea
            className="inquiry-detail-textarea"
            placeholder="답변 내용을 입력하세요..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        ) : (
          inquiry.reply && (
            <div className="inquiry-detail-complete-reply">
              <strong>답변:</strong>
              <p>{inquiry.reply}</p>
              {inquiry.responderNickname && (
                <p className="inquiry-detail-responder">
                  <em>답변자: {inquiry.responderNickname}</em>
                </p>
              )}
            </div>
          )
        )}
      </div>

      <div className="inquiry-detail-actions">
        {inquiry.state === "PROCESSING" && (
          <button
            className="inquiry-detail-btn complete-btn"
            onClick={() => onComplete(inquiry.id, answer)}
          >
            완료 처리
          </button>
        )}

        {inquiry.state === "PROCESSING" && inquiry.category === "ROLE_REQUEST" && (
          <button
            className={`inquiry-detail-btn grant-btn ${roleGranted ? "disabled" : ""}`}
            onClick={handleGrantRoleClick}
            disabled={roleGranted}
          >
            {roleGranted ? "권한 부여 완료" : `${inquiry.targetRole} 권한 부여`}
          </button>
        )}
      </div>
    </div>
  );
};

export default InquiryDetail;
