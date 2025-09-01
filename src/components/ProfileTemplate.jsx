import { useState } from "react";
import "./ProfileTemplate.css";
import axiosInstance from "./utils/AxiosInstance";
import { sendFriendRequest } from "./utils/friendApi";
import ProfileModal from "./modals/ProfileModal";



const ProfileTemplate = ({ profileImageUrl, name, id }) => {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [friendMessage, setFriendMessage] = useState("");
  const [isFriendError, setIsFriendError] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const res = await axiosInstance.get(`/member/summary/${id}`);
      setUserInfo(res.data);
      setFriendMessage("");
      setIsFriendError(false);
      setShowModal(true);
    } catch (err) {
      console.error("❌ 유저 정보 불러오기 실패:", err);
      alert("사용자 정보를 불러올 수 없습니다.");
    }
  };

  const handleAddFriend = async () => {
    try {
      await sendFriendRequest(userInfo.id);
      setFriendMessage("✅ 친구 요청이 전송되었습니다.");
      setIsFriendError(false);
    } catch (error) {
      const message = error.response?.data?.message || "친구 요청 중 오류가 발생했습니다.";
      setFriendMessage(`❌ ${message}`);
      setIsFriendError(true);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await axiosInstance.delete(`/friend/${userInfo.id}`);
      setFriendMessage("✅ 친구가 삭제되었습니다.");
      setIsFriendError(false);
      setUserInfo((prev) => ({ ...prev, isFriend: false }));
    } catch (error) {
      setFriendMessage("❌ 친구 삭제 중 오류가 발생했습니다.");
      setIsFriendError(true);
    }
  };

  return (
    <div className="ProfileTemplate">
      <div className="ProfileTemplate__search-result" onClick={fetchUserInfo}>
        <img
          src={profileImageUrl || "/default-profile.png"}
          alt="프로필"
          className="ProfileTemplate__profile-img"
        />
        <span className="ProfileTemplate__profile-name">{name}</span>
      </div>

      {showModal && userInfo && (
        <ProfileModal
          userInfo={userInfo}
          onClose={() => setShowModal(false)}
          onAddFriend={handleAddFriend}
          onRemoveFriend={handleRemoveFriend}
          friendMessage={friendMessage}
          isFriendError={isFriendError}
        />
      )}
    </div>
  );
};

export default ProfileTemplate;
