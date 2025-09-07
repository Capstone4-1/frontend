import { createPortal } from "react-dom";
import "./ProfileModal.css";
import { ROLE_TITLES_MAP } from "../utils/RoleUtils";


const getRoleIcon = (roles) => {
    if (roles.includes("PROFESSOR")) return "👑";
    if (roles.includes("MANAGER")) return "😄";
    if (roles.includes("ADMIN")) return "🔧";
    if (roles.includes("SYSTEM")) return "🤖";
    if (roles.includes("STUDENT")) return "🎓";
    return null;
};

const ProfileModal = ({
    userInfo,
    onClose,
    onAddFriend,
    onRemoveFriend,
    friendMessage,
    isFriendError,
}) => {
    if (!userInfo) return null;

    return createPortal(
        <div className="ProfileModal">
            <div className="ProfileModal__overlay" onClick={onClose}>
                <div className="ProfileModal__content" onClick={(e) => e.stopPropagation()}>
                    <div className="ProfileModal__header">
                        <img
                            src={userInfo.profileThumbnails || "/default-profile.png"}
                            alt="프로필"
                            className="ProfileModal__profile-img"
                        />
                        <div className="ProfileModal__name-block">
                            <h3>
                                {userInfo.nickname}
                                {getRoleIcon(userInfo.roles) && (
                                    <span
                                        className="role-icon"
                                        title={userInfo.roles
                                            .map((r) => ROLE_TITLES_MAP[r])
                                            .filter(Boolean)
                                            .join(", ")}
                                    >
                                        {getRoleIcon(userInfo.roles)}
                                    </span>
                                )}
                            </h3>
                            <span className="ProfileModal__username">{userInfo.email}</span>
                        </div>
                    </div>

                    <div className="ProfileModal__body">
                        <p><strong>소개:</strong> {userInfo.intro || "소개 정보가 없습니다."}</p>
                        {userInfo.roles.some(role => ROLE_TITLES_MAP[role]) && (
                            <div className="user-roles">
                                <strong>권한:</strong>
                                {userInfo.roles
                                    .filter(role => ROLE_TITLES_MAP[role])
                                    .map((role) => (
                                        <span className={`role-badge role-${role.toLowerCase()}`} key={role}>
                                            {ROLE_TITLES_MAP[role]}
                                        </span>
                                    ))}
                            </div>
                        )}
                        <div className="modal-actions">
                            {userInfo.isFriend ? (
                                <button className="remove-friend-button" onClick={onRemoveFriend}>
                                    친구 삭제
                                </button>
                            ) : (
                                <button className="action-button" onClick={onAddFriend}>
                                    친구 추가
                                </button>
                            )}
                            <button className="action-button">쪽지 보내기</button>
                        </div>

                        {friendMessage && (
                            <p className={`friend-message ${isFriendError ? "error" : "success"}`}>
                                {friendMessage}
                            </p>
                        )}
                    </div>

                    <div className="ProfileModal__footer">
                        <button onClick={onClose}>닫기</button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProfileModal;
