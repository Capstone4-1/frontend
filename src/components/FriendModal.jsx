import "./FriendModal.css";
import InputBox from "./InputBox";
import ProfileTemplate from "./ProfileTemplate";
import ConfirmModal from "./modals/ConfirmModal";
import "./modals/Modal.css";
import {
    searchFriendByNickname,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
} from "./utils/friendApi";
import { X, UserX, UserPlus, Users, Search } from "lucide-react";
import { useState, useEffect } from "react";

const FriendModal = ({
    setOpenModal,
    requestMemberList,
    fetchMyFriendInfo,
    setRequestMemberList,
    myFriendList,
}) => {
    const [result, setResult] = useState(null);
    const [resultMessage, setResultMessage] = useState("");
    const [isFriendError, setIsFriendError] = useState(false);
    const [activeTab, setActiveTab] = useState("friends");
    const [nickname, setNickname] = useState("");
    const [filteredFriends, setFilteredFriends] = useState(myFriendList);
    const [confirmDeleteFriendId, setConfirmDeleteFriendId] = useState(null);

    useEffect(() => {
        setFilteredFriends(myFriendList);
    }, [myFriendList]);

    const handleNicknameChange = (value) => {
        setNickname(value);
        const keyword = value.trim().toLowerCase();
        if (!keyword) {
            setFilteredFriends(myFriendList);
            return;
        }
        const filtered = myFriendList.filter((friend) =>
            friend.nickName.toLowerCase().includes(keyword)
        );
        setFilteredFriends(filtered);
    };

    const handleSearch = async () => {
        const keyword = nickname.trim();
        if (!keyword) {
            setResultMessage("닉네임을 입력해주세요.");
            setIsFriendError(true);
            setResult(null);
            return;
        }
        try {
            const data = await searchFriendByNickname(keyword);
            setResult(data);
            setResultMessage("");
            setIsFriendError(false);
        } catch (error) {
            setResult(null);
            setResultMessage(error.response?.data?.message || "검색 실패");
            setIsFriendError(true);
        }
    };

    const handleAddFriend = async () => {
        try {
            await sendFriendRequest(result.id);
            setResult(null);
            setNickname("");
            setResultMessage("친구 추가 요청이 전송되었습니다.");
            setIsFriendError(false);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "친구 요청 중 오류가 발생했습니다.";
            setResultMessage(`❌ ${message}`);
            setIsFriendError(true);
        }
    };

    const handleAccept = async (idToAccept) => {
        try {
            await acceptFriendRequest(idToAccept);
            setRequestMemberList((prev) =>
                prev.filter((request) => request.id !== idToAccept)
            );
            fetchMyFriendInfo();
        } catch (error) {
            console.error("친구 수락 실패:", error);
        }
    };

    const handleDecline = async (idToDecline) => {
        try {
            await declineFriendRequest(idToDecline);
            setRequestMemberList((prev) =>
                prev.filter((request) => request.id !== idToDecline)
            );
        } catch (error) {
            console.error("친구 요청 거절 실패:", error);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            await removeFriend(friendId);
            setFilteredFriends((prev) => prev.filter((f) => f.id !== friendId));
            fetchMyFriendInfo();
        } catch (error) {
            console.error("친구 삭제 실패:", error);
        }
    };

    return (
        <div className="Modal FriendModal">
            <div className="Overlay">
                <div className="container card">
                    <div className="friend-modal-header" role="tablist">
                        <div
                            className={`tab ${activeTab === "friends" ? "active" : ""}`}
                            role="tab"
                            tabIndex="0"
                            onClick={() => setActiveTab("friends")}
                        >
                            <span>내 친구</span>
                        </div>
                        <div
                            className={`tab ${activeTab === "search" ? "active" : ""}`}
                            role="tab"
                            tabIndex="0"
                            onClick={() => {
                                setActiveTab("search");
                                setNickname("");
                                setResult(null);
                                setResultMessage("");
                            }}
                        >
                            <span>검색</span>
                        </div>
                        <div
                            className={`tab ${activeTab === "request" ? "active" : ""}`}
                            role="tab"
                            tabIndex="0"
                            onClick={() => {
                                setActiveTab("request");
                                setResultMessage("");
                            }}
                        >
                            <span>받은 요청</span>
                            {requestMemberList.length > 0 && (
                                <span className="badge primary">
                                    {requestMemberList.length}
                                </span>
                            )}
                        </div>
                        <button
                            className="exit-btn"
                            onClick={() => setOpenModal(false)}
                        >
                            <X />
                        </button>
                    </div>

                    {activeTab === "friends" && (
                        <>
                            <div className="section search-row">
                                <InputBox
                                    state={nickname}
                                    setStateFunction={handleNicknameChange}
                                    placeholder="내 친구 목록에서 검색"
                                />
                            </div>
                            <ul className="Friends-List">
                                {filteredFriends.length > 0 ? (
                                    filteredFriends.map((friend) => (
                                        <li key={friend.id} className="Friends-Item">
                                            <div className="friend-item-section">
                                                <ProfileTemplate
                                                    profileImageUrl={friend.profileThumbnails}
                                                    name={friend.nickName}
                                                    id={friend.id}
                                                />
                                                <button
                                                    className="btn btn--ghost"
                                                    onClick={() => setConfirmDeleteFriendId(friend.id)}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <UserX className="empty-icon" />
                                        <p className="empty-title">친구가 없습니다.</p>
                                        <p className="empty-desc">친구를 추가하거나 요청을 받아보세요.</p>
                                    </div>
                                )}
                            </ul>
                        </>
                    )}

                    {activeTab === "search" && (
                        <>
                            <div className="section search-row">
                                <InputBox
                                    state={nickname}
                                    setStateFunction={setNickname}
                                    onClickFunction={handleSearch}
                                    placeholder="닉네임으로 친구를 찾아보세요"
                                    buttonText="검색"
                                    icon={<Search />}
                                />
                            </div>
                            <div className="section--padded">
                                {resultMessage && (
                                    <p className={`friend-message ${isFriendError ? "error" : "success"}`}>
                                        {resultMessage}
                                    </p>
                                )}
                                <div className="requests-box">
                                    {result ? (
                                        <div className="request-container request-container--card">
                                            <div className="search-result-profile">
                                                <img
                                                    src={result.profileThumbnails || "/default-profile.png"}
                                                    alt="프로필"
                                                    className="profile-img"
                                                />
                                                <span className="nickname">{result.nickName}</span>
                                            </div>
                                            <div className="actions">
                                                <button
                                                    className="btn btn--primary"
                                                    onClick={handleAddFriend}
                                                >
                                                    <UserPlus size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                    요청
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        !resultMessage && (
                                            <div className="empty-wrapper">
                                                <div className="empty-state">
                                                    <Search className="empty-icon" />
                                                    <p className="empty-title">친구를 검색해 보세요.</p>
                                                    <p className="empty-desc">정확한 닉네임을 입력해야 찾을 수 있습니다.</p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "request" && (
                        <div className="requests-box">
                            {requestMemberList.length > 0 ? (
                                requestMemberList.map((request, index) => (
                                    <div className="request-container request-container--row" key={index}>
                                        <div className="search-result-profile">
                                            <img
                                                src={request.profileThumbnails || "/default-profile.png"}
                                                alt="프로필"
                                                className="profile-img"
                                            />
                                            <span className="nickname">{request.nickName}</span>
                                        </div>
                                        <div className="actions">
                                            <button
                                                className="btn btn--primary"
                                                onClick={() => handleAccept(request.id)}
                                            >
                                                수락
                                            </button>
                                            <button
                                                className="btn btn--ghost"
                                                onClick={() => handleDecline(request.id)}
                                            >
                                                거절
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <Users className="empty-icon" />
                                    <p className="empty-title">받은 친구 요청이 없습니다.</p>
                                    <p className="empty-desc">새로운 요청이 도착하면 여기에 표시됩니다.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {confirmDeleteFriendId && (
                <ConfirmModal
                    message="정말 이 친구를 삭제하시겠습니까?"
                    onConfirm={() => {
                        handleRemoveFriend(confirmDeleteFriendId);
                        setConfirmDeleteFriendId(null);
                    }}
                    onCancel={() => setConfirmDeleteFriendId(null)}
                />
            )}
        </div>
    );
};

export default FriendModal;