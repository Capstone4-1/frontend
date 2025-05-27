import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../components/utils/AxiosInstance";
import axios from "axios";
import "./WritePage.css";
import "./LectureWritePage.css";


import {
  FileImage,
  Paperclip,
  Link as LinkIcon,
  AArrowUp,
  AArrowDown,
} from "lucide-react";

const tabList = ["질문", "후기", "자료실", "공지사항"];

const LectureWritePage = () => {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("질문");

  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const applyStyle = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
  };

  const insertHTML = (html) => {
    editorRef.current.focus();
    document.execCommand("insertHTML", false, html);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await axiosInstance.get("/api/aws/S3/presign", {
        params: { filename: file.name },
      });
      const { uploadUrl, fileUrl } = res.data;

      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      alert("✅ 업로드 성공!");
      const imgTag = `<img src="${fileUrl}" alt="${file.name}" style="max-width: 100%; margin: 8px 0;" />`;
      insertHTML(imgTag);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert("업로드 실패");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileTag = `<a href="#" style="color: #3498db;">📎 ${file.name}</a>`;
    insertHTML(fileTag);
  };

  const getFormData = () => {
    const title = document.querySelector(".write-input").value.trim();
    const content = editorRef.current.innerHTML.trim();
    return { title, content };
  };

  const handleSubmit = async () => {
    const { title, content } = getFormData();
    if (!title || !content) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/lecture-post", {
        lectureId,
        category: selectedTab,
        title,
        content,
      });

      if (res.status === 200 || res.status === 201) {
        alert("글이 등록되었습니다.");
        navigate(`/main/lecture/${lectureId}`);
      } else {
        alert("등록 실패. 다시 시도해주세요.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const applyLink = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) {
      alert("먼저 링크로 만들 텍스트를 드래그하세요.");
      return;
    }
    const url = prompt("링크 주소를 입력하세요 (https:// 포함)");
    if (!url || !/^https?:\/\//.test(url)) {
      alert("올바른 링크 형식을 입력해 주세요.");
      return;
    }
    const range = selection.getRangeAt(0);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = selection.toString();
    range.deleteContents();
    range.insertNode(link);
    editorRef.current.focus();
  };

  return (
    <div className="WritePage">
      <Header title="Community" />
      <div className="write-layout">
        <div className="write-main">
          <h2 className="write-title">강의 게시판 글쓰기</h2>

          <div className="tab-buttons" style={{ marginBottom: "16px" }}>
            {tabList.map((tab) => (
              <button
                key={tab}
                className={`tab-button ${selectedTab === tab ? "active-tab" : ""}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="write-section">
            <input
              type="text"
              className="write-input"
              placeholder="제목을 입력해 주세요."
            />

            <div className="editor-box flat">
              <div className="toolbar-row flat">
                <button onClick={() => imageInputRef.current.click()} title="사진">
                  <FileImage size={24} />
                </button>
                <button onClick={() => fileInputRef.current.click()} title="파일">
                  <Paperclip size={24} />
                </button>
                <button onClick={applyLink} title="링크">
                  <LinkIcon size={24} />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </div>

              <hr className="divider" />

              <div className="toolbar-row flat">
                <button onClick={() => applyStyle("bold")}><b>B</b></button>
                <button onClick={() => applyStyle("italic")}><i>I</i></button>
                <button onClick={() => applyStyle("underline")}><u>U</u></button>
                <button title="글자 키우기" onClick={() => applyStyle("increaseFontSize")}>
                  <AArrowUp size={20} />
                </button>
                <button title="글자 줄이기" onClick={() => applyStyle("decreaseFontSize")}>
                  <AArrowDown size={20} />
                </button>
              </div>

              <hr className="divider" />

              <div
                ref={editorRef}
                className="write-textarea editable"
                contentEditable={true}
                suppressContentEditableWarning={true}
              ></div>
            </div>
          </div>

          <div className="write-actions">
            <button className="submit-post" onClick={handleSubmit}>
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureWritePage;
