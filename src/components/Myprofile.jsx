import "./Myprofile.css";
import { useState, useRef, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { Camera } from "lucide-react";
import axiosInstance from "./utils/AxiosInstance";
import { UserContext } from "./utils/UserContext";

const MyProfile = ({ profileImageUrl }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const menuRef = useRef(null);
  const { user, setUser } = useContext(UserContext);

  // 최초에 이미지 동기화
  useEffect(() => {
    const url = profileImageUrl ?? user?.profileImageUrl;
    if (url) {
      setSelectedImage(url);
    }
  }, [profileImageUrl, user?.profileImageUrl]);

  const toggleMenu = () => {
    setShowProfileMenu((prev) => !prev);
    setShowEditOptions(false);
  };

  const handleProfileView = () => {
    setShowProfileModal(true);
    setShowProfileMenu(false);
    document.body.classList.add("profile-open"); 
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    document.body.classList.remove("profile-open");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      handleImageSelect(file);
    }
    setShowProfileMenu(false);
    setShowEditOptions(false);
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    handleImageSelect(null);
    setShowProfileMenu(false);
    setShowEditOptions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("profile-open"); 
    };
  }, [showProfileMenu]);

  const handleImageSelect = async (file) => {
    const MAX_FILE_SIZE = 4 * 1024 * 1024;
    try {
      if (!file) {
        const res = await axiosInstance.delete("/member/delete-profile-image");
        if (res.data?.imageUrl) {
          setUser((prev) => ({
            ...prev,
            profileImageUrl: res.data.imageUrl,
          }));
          setSelectedImage(res.data.imageUrl);
        }
        alert("프로필 이미지가 삭제되었습니다!");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert("이미지 크기는 4MB 이하만 가능합니다.");
        return;
      }
      const formData = new FormData();
      formData.append("profileImage", file);
      const res = await axiosInstance.post("/member/set-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.imageUrl) {
        setUser((prev) => ({
          ...prev,
          profileImageUrl: res.data.imageUrl,
        }));
        setSelectedImage(res.data.imageUrl);
      }
      alert("프로필 이미지가 저장되었습니다!");
    } catch (err) {
      console.error("프로필 이미지 업로드 실패:", err);
      alert("프로필 이미지 저장에 실패했습니다.");
    }
  };

  return (
    <div className="profile-pic-container">
      {selectedImage ? (
        <img className="profile-pic" src={selectedImage} alt="프로필" />
      ) : (
        <div className="profile-pic empty">No Image</div>
      )}

      <Camera className="camera-icon" onClick={toggleMenu} />

      {showProfileMenu && (
        <div className="profile-menu" ref={menuRef}>
          {!showEditOptions ? (
            <>
              <div onClick={handleProfileView}>프로필 보기</div>
              <div onClick={() => setShowEditOptions(true)}>프로필 수정</div>
            </>
          ) : (
            <>
              <div onClick={openFilePicker}>라이브러리에서 선택</div>
              <div onClick={handleDeleteImage}>현재 사진 삭제</div>
            </>
          )}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* ✅ 모달을 포털로 렌더 */}
      {showProfileModal &&
        createPortal(
          <div className="profile-modal-backdrop" onClick={closeProfileModal}>
            <div
              className="profile-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImage ? (
                <img src={selectedImage} alt="프로필 확대" />
              ) : (
                <div className="profile-pic modal-empty">No Image</div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default MyProfile;
