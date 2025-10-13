// src/components/InquiryForm.jsx
import { useState } from "react";
import "./InquiryForm.css";
import axiosInstance from "./utils/AxiosInstance";
import { InquiryCategories, buildInquiryPayload, isRoleRequest } from "./utils/InquiryUtils";
import { ROLE_DEFS } from "./utils/RoleUtils";
import { toast } from "sonner";

const InquiryForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [targetRole, setTargetRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const payload = buildInquiryPayload(title, content, category, targetRole);

      await axiosInstance.post("/inquiry", payload, { withCredentials: true });

      toast.success("문의가 정상적으로 제출되었습니다!");
      setTitle("");
      setContent("");
      setCategory("GENERAL");
      setTargetRole("");
    } catch (error) {
      console.error("문의 등록 실패:", error);
      toast.error("문의 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="InquiryForm-container">
      <h2 className="InquiryForm-title">문의하기</h2>
      <form className="InquiryForm-form" onSubmit={handleSubmit}>
        {/* 문의 유형 선택 */}
        <div className="InquiryForm-group">
          <label htmlFor="category">문의 유형</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {InquiryCategories.map((item) => (
              <option key={item.value} value={item.value} title={item.label || item.value}>
                {item.label || item.value}
              </option>
            ))}
          </select>
        </div>

        {/* 권한 요청일 때만 권한 선택 */}
        {isRoleRequest(category) && (
          <div className="InquiryForm-group">
            <label htmlFor="targetRole">요청할 권한</label>
            <select
              id="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              required
            >
              <option value="">권한 선택</option>
              {ROLE_DEFS.map((role) => (
                <option
                  key={role.value}
                  value={role.value}
                  title={role.title}
                >
                  {role.title} {/* 화면에는 한글 태그 표시 */}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 제목 */}
        <div className="InquiryForm-group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="문의 제목을 입력하세요"
            required
          />
        </div>

        {/* 내용 */}
        <div className="InquiryForm-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="문의 내용을 입력하세요"
            required
          />
        </div>

        <button type="submit" className="InquiryForm-submitBtn">
          제출하기
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;
