import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import axiosInstance from "../components/utils/AxiosInstance";
import { getBoardLabel } from "../components/utils/boardUtils";

import "./WritePage.css";
import {
  FileImage,
  Paperclip,
  Link as LinkIcon,
  AArrowUp,
  AArrowDown,
  Palette,
} from "lucide-react"; 
import { toast } from "sonner";

const WritePage = () => {
  const { boardType, postId } = useParams();
  const isEditMode = !!postId;
  const label = getBoardLabel(boardType);
  const navigate = useNavigate();

  const [selectedBoard, setSelectedBoard] = useState(null);
  const [title, setTitle] = useState("");
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const colorInputRef = useRef(null);

  useEffect(() => {
    if (boardType) {
      setSelectedBoard({
        value: boardType.toUpperCase(),
        label: getBoardLabel(boardType),
      });

      if (boardType.toUpperCase() === "NOTICE" && !isEditMode) {
        setTitle((prev) => (prev.startsWith("<전학년>") ? prev : `<전학년> ${prev}`));
      }
    }
  }, [boardType, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      axiosInstance
        .get(`/post/${postId}`)
        .then((res) => {
          const postData = res.data.dto;
          setTitle(postData.title);
          if (editorRef.current) editorRef.current.innerHTML = postData.content;
          if (postData.boardType && postData.boardType !== selectedBoard?.value) {
            setSelectedBoard({
              value: postData.boardType,
              label: getBoardLabel(postData.boardType.toLowerCase()),
            });
          }
        })
        .catch((err) => {
          console.error("게시글 불러오기 실패", err);
          toast.error("게시글을 불러오는데 실패했습니다.");
        });
    }
  }, [isEditMode, postId, selectedBoard]);

  const applyStyle = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
  };

  /* HTML 삽입 */
  const insertHTML = (html) => {
    editorRef.current.focus();
    document.execCommand("insertHTML", false, html);
  };

  /* 글자 색상 적용 */
  const applyColor = (color) => {
    document.execCommand("foreColor", false, color);
    editorRef.current.focus();
  };

  /* 이미지 업로드 */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await axiosInstance.get("/aws/S3/presign", {
        params: { filename: file.name, contentType: file.type },
      });
      const { uploadUrl, fileUrl } = res.data;

      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
          Authorization: undefined,
        },
      });

      const imgTag = `<img src="${fileUrl}" alt="${file.name}" style="max-width: 500px; width: 100%; height: auto; margin: 8px 0;" />`;
      insertHTML(imgTag);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      toast.error("이미지 업로드 실패: 콘솔 로그를 확인하세요.");
    }
  };

  /* 파일 업로드 */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileTag = `<a href="#" style="color: #3498db;">📎 ${file.name}</a>`;
    insertHTML(fileTag);
  };

  /* 게시글 등록*/
  const handleSubmit = async () => {
    const content = editorRef.current.innerHTML.trim();
    if (!selectedBoard || !title.trim() || !content) {
      toast.warning("게시판, 제목, 내용을 모두 입력해 주세요.");
      return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const firstImg = tempDiv.querySelector("img");
    const imageUrls = firstImg ? firstImg.src : null;

    try {
      if (isEditMode) {
        const res = await axiosInstance.put(`/post/post-up/${postId}`, {
          boardType: selectedBoard.value,
          title,
          content,
          imageUrls,
        });
        if (res.status === 200) {
          navigate(`/main/community/${selectedBoard.value.toLowerCase()}`);
        } else {
          toast.error("수정 실패. 다시 시도해주세요.");
        }
      } else {
        const res = await axiosInstance.post("/post/post-up", {
          boardType: selectedBoard.value,
          title,
          content,
          imageUrls,
        });
        if (res.status === 200 || res.status === 201) {
          navigate(`/main/community/${selectedBoard.value.toLowerCase()}`);
        } else {
          toast.error("등록 실패. 다시 시도해주세요.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "서버 에러 발생");
    }
  };

  /* 글자 크기 변경 */
const changeFontSize = (delta) => {
  const selection = window.getSelection();
  if (!selection.rangeCount || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  let targetNode = range.startContainer.parentElement;

  // 현재 선택된 글자의 폰트 크기
  const currentSize =
    parseFloat(window.getComputedStyle(targetNode).fontSize) || 16;

  if (targetNode.tagName === "SPAN") {
    targetNode.style.fontSize = `${currentSize + delta}px`;
  } else {
    const span = document.createElement("span");
    span.style.fontSize = `${currentSize + delta}px`;
    range.surroundContents(span);
  }
  editorRef.current.focus();
};
  const increaseFontSize = () => changeFontSize(2);
  const decreaseFontSize = () => changeFontSize(-2);

  /* 링크 삽입 */
  const applyLink = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) {
      toast.warning("먼저 링크로 만들 텍스트를 드래그하세요.");
      return;
    }
    const url = prompt("링크 주소를 입력하세요 (https:// 포함)");
    if (!url || !/^https?:\/\//.test(url)) {
      toast.warning("올바른 링크 형식을 입력해 주세요 (https://...)");
      return;
    }
    const range = selection.getRangeAt(0);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = selection.toString();

    link.style.color = "#1a73e8"; // 기본 파란색
    link.style.textDecoration = "underline";
    link.style.cursor = "pointer";

    range.deleteContents();
    range.insertNode(link);
    editorRef.current.focus();
  };

  return (
    <div className="WritePage">
      <div className="write-layout">
        <div className="write-main">
          <h2 className="write-title">
            [{selectedBoard?.label}] 게시글 {isEditMode ? "수정" : "작성"}
          </h2>

          <div className="write-section">
            <div className="write-box">
              <input
                type="text"
                className="write-input"
                placeholder="제목을 입력해 주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="editor-box flat">
              {/* === 툴바 1: 파일/링크 === */}
              <div className="toolbar-row flat">
                <button
                  title="사진"
                  className="toolbar-button"
                  onClick={() => imageInputRef.current.click()}
                >
                  <FileImage size={24} />
                  <span className="toolbar-label">사진</span>
                </button>
                <button
                  title="파일"
                  className="toolbar-button"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Paperclip size={24} />
                  <span className="toolbar-label">파일</span>
                </button>
                <button title="링크" className="toolbar-button" onClick={applyLink}>
                  <LinkIcon size={24} />
                  <span className="toolbar-label">링크</span>
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

              {/* === 툴바 2: 서식 === */}
              <div className="toolbar-row flat">
                <button title="굵게" onClick={() => applyStyle("bold")}>
                  <b>B</b>
                </button>
                <button title="기울임" onClick={() => applyStyle("italic")}>
                  <i>I</i>
                </button>
                <button title="밑줄" onClick={() => applyStyle("underline")}>
                  <u>U</u>
                </button>

                <label className="color-picker-label">
                  <Palette size={18} color="#333" />
                  <input
                    ref={colorInputRef}
                    type="color"
                    className="hidden-color-input"
                    onChange={(e) => applyColor(e.target.value)}
                  />
                </label>

                <button title="글자 키우기" onClick={increaseFontSize}>
                  <AArrowUp size={20} />
                </button>
                <button title="글자 줄이기" onClick={decreaseFontSize}>
                  <AArrowDown size={20} />
                </button>
              </div>

              <hr className="divider" />

              {/* === 본문 입력 === */}
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
              {isEditMode ? "수정 완료" : "등록"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritePage;
