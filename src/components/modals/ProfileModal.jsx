import { useState } from "react";
import { createPortal } from "react-dom";
import { ROLE_DEFS } from "../utils/RoleUtils";
import RoleTag from "../RoleTag";
import LockModal from "./LockModal";
import Exit from "../buttons/Exit";
import "./Modal.css";

const getRoleDefs = (roles) =>
  ROLE_DEFS.filter((role) => roles.includes(role.key));

const getRoleIcon = (roles) => {
  if (roles.includes("SYSTEM")) return "🤖";
  if (roles.includes("ADMIN")) return "🔧";
  if (roles.includes("PROFESSOR")) return "👑";
  if (roles.includes("MANAGER")) return "😄";
  if (roles.includes("STUDENT_COUNCIL")) return "🎖️";
  if (roles.includes("STUDENT")) return "🎓";
  return null;
};

const ProfileModal = ({ userInfo, onClose, onAddFriend, friendMessage, isFriendError }) => {
  const [showLockModal, setShowLockModal] = useState(false);
  if (!userInfo) return null;

  const roleDefs = getRoleDefs(userInfo.roles);

  return createPortal(
    <div className="ProfileModalWrapper">
      <div className="ProfileModalOverlay" onClick={onClose} />
      <div className="ProfileModalContainer">

        {/* Header */}
        <div className="ProfileModalHeader">
          <div className="ProfileModalAvatarBlock">
            <img
              src={userInfo.profileThumbnails || "/default-profile.png"}
              alt="프로필"
              className="ProfileModalAvatar"
            />
          </div>

          <div className="ProfileModalNameBlock">
            <h3 className="ProfileModalNickname">
              {userInfo.nickname}
              {getRoleIcon(userInfo.roles) && (
                <span className="ProfileModalRoleIcon">{getRoleIcon(userInfo.roles)}</span>
              )}
            </h3>
            <span className="ProfileModalUsername">{userInfo.email}</span>
          </div>

          {/* Exit 버튼 */}
          <Exit onClose={onClose} className="ProfileModalExit" />
        </div>

        {/* Body */}
        <div className="ProfileModalBody">
          <p className="ProfileModalIntro">
            <strong>소개:</strong> {userInfo.intro || "소개 정보가 없습니다."}
          </p>

          {roleDefs.length > 0 && (
            <div className="ProfileModalRoles">
              {userInfo.roles.map((role) => (
                <RoleTag key={role} role={role} />
              ))}
            </div>
          )}

          <div className="ProfileModalActions">
            {!userInfo.isFriend && (
              <button className="ProfileModalBtn" onClick={onAddFriend}>
                친구 추가
              </button>
            )}
            <button className="ProfileModalBtn" onClick={() => setShowLockModal(true)}>
              쪽지 보내기
            </button>
          </div>

          {friendMessage && (
            <p className={`ProfileModalMessage ${isFriendError ? "error" : "success"}`}>
              {friendMessage}
            </p>
          )}
        </div>
      </div>

      <LockModal isOpen={showLockModal} onClose={() => setShowLockModal(false)} />
    </div>,
    document.body
  );
};

export default ProfileModal;
