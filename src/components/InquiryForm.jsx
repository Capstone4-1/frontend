// src/components/InquiryForm.jsx
import { useState } from "react";
import axios from "axios"; // axios 설치 필요: npm install axios
import "./InquiryForm.css";
import axiosInstance from "./utils/AxiosInstance";

const InquiryForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/inquiry", 
        { title, content },
        { withCredentials: true } // JWT나 세션 인증 필요하면
      );

      alert(response.data.message || "문의가 정상적으로 제출되었습니다!");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("문의 등록 실패:", error);
      alert("문의 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="InquiryForm-container">
      <h2 className="InquiryForm-title">문의하기</h2>
      <form className="InquiryForm-form" onSubmit={handleSubmit}>
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
