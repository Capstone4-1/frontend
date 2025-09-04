import React, { useState, useRef } from "react";
import axiosInstance from "../utils/AxiosInstance";
import axios from "axios";
import { toast } from "sonner";   
import "./MarketUploadModal.css";

const MarketUploadModal = ({ onClose }) => {
  const [imgFile, setImgFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadToS3 = async (file) => {
    const res = await axiosInstance.get("/aws/S3/presign", {
      params: { filename: file.name, contentType: file.type },
    });
    const { uploadUrl, fileUrl } = res.data;

    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type, Authorization: undefined },
    });

    return { fileUrl };
  };

  const handleFileSelected = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const { fileUrl } = await uploadToS3(file);
      setImgFile(file);
      setImgUrl(fileUrl);
    } catch (e) {
      console.error(e);
      toast.error("이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    await handleFileSelected(file);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    await handleFileSelected(file);
  };

  const handleSubmit = async () => {
    if (!title || !price || !description) {
      toast.error("모든 항목을 입력하세요.");  
      return;
    }
    try {
      const res = await axiosInstance.post("/post/post-up", {
        boardType: "MARKET",
        title,
        content: `<p>${description}</p>`.trim(),
        imageUrls: imgUrl ?? null,
        price: Number(price),
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("물품이 등록되었습니다.");  
        onClose();
        window.location.href = "/main/community/market";
      } else {
        toast.error("등록 실패. 다시 시도해주세요.");   
      }
    } catch (err) {
      console.error("등록 오류:", err);
      toast.error("서버 오류가 발생했습니다.");   
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container horizontal" role="dialog" aria-modal="true">
        {/* 왼쪽 이미지 영역 */}
        <div
          className={`left-box ${dragOver ? "dragover" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <button
            type="button"
            className="upload-area"
            onClick={() => inputRef.current?.click()}
            aria-label="이미지 업로드"
          >
            {imgUrl ? (
              <>
                <img src={imgUrl} alt="preview" className="preview-image" />
                <span className="overlay">사진 변경</span>
              </>
            ) : uploading ? (
              <div className="skeleton" />
            ) : (
              <div className="placeholder">
                {/* Plus 아이콘 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p>이미지 업로드</p>
                <small>클릭 또는 드래그앤드롭</small>
              </div>
            )}
          </button>

          <input
            ref={inputRef}
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>

        {/* 오른쪽 입력 영역 */}
        <div className="right-box">
          <h2>📚 물품 등록</h2>

          <label>
            물품 이름
            <input
              type="text"
              placeholder="예) 토익 교재 세트"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label>
            가격 (원)
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="예) 15000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>

          <label>
            설명
            <textarea
              placeholder="상태, 사용 기간, 거래 방법 등을 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="modal-buttons">
            <button onClick={handleSubmit} disabled={uploading}>
              {uploading ? "업로드 중..." : "등록"}
            </button>
            <button onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketUploadModal;
