import "./FriendModal.css";
import InputBox from "./InputBox";
import Reddot from "./Reddot";
import "./modals/Modal.css";
import {
    searchFriendByNickname,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
} from "./utils/friendApi";
import { X } from "lucide-react";
import { useState } from "react";

const FriendModal = ({
    setOpenModal,
    requestMemberList,
    fetchMyFriendInfo,
    setHasFriendrequest,
    setRequestMemberList,
}) => {
    const [result, setResult] = useState(null);
    const [resultMessage, setResultMessage] = useState("");
    const [isFriendError, setIsFriendError] = useState(false); // ✅ 성공/실패 메시지 구분
    const [activeTab, setActiveTab] = useState("send");
    const [nickname, setNickname] = useState("");

    const handleSearch = async () => {
        try {
            const data = await searchFriendByNickname(nickname.trim());
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
            setResultMessage("✅ 친구 추가 요청이 전송되었습니다.");
            setIsFriendError(false);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "친구 요청 중 오류가 발생했습니다.";
            setResultMessage(`❌ ${message}`);
            setIsFriendError(true);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setResult(null);
        setResultMessage("");
    };

    const handleAccept = async (idToAccept) => {
        try {
            await acceptFriendRequest(idToAccept);
            setRequestMemberList((prev) =>
                prev.filter((request) => request.id !== idToAccept),
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
                prev.filter((request) => request.id !== idToDecline),
            );
        } catch (error) {
            console.error("친구 요청 거절 실패:", error);
        }
    };

    return (
        <div className="Modal">
            <div className="Overlay">
                <div className="container">
                    <div className="header">
                        <h3>🖐️ 친구 추가</h3>
                        <button
                            className="request-tap-btn"
                            onClick={() => handleTabChange("send")}
                        >
                            검색
                        </button>
                        <button
                            className="request-tap-btn"
                            onClick={() => {
                                handleTabChange("receive");
                                setHasFriendrequest(false);
                            }}
                        >
                            받은요청
                            <Reddot count={requestMemberList.length} />
                        </button>
                        <button
                            className="exit-btn"
                            onClick={() => setOpenModal(false)}
                        >
                            <X />
                        </button>
                    </div>

                    {activeTab === "send" ? (
                        <div>
                            <div className="search-box">
                                <InputBox
                                    state={nickname}
                                    setStateFunction={setNickname}
                                    onClickFunction={handleSearch}
                                    placeholder="닉네임으로 친구를 찾아보세요"
                                />
                                {resultMessage && (
                                    <p
                                        className={`friend-message ${
                                            isFriendError ? "error" : "success"
                                        }`}
                                    >
                                        {resultMessage}
                                    </p>
                                )}
                            </div>
                            <div className="request-container">
                                {result && (
                                    <>
                                        <div className="search-result-profile">
                                            <img
                                                src={
                                                    result.profileThumbnails ||
                                                    "/default-profile.png"
                                                }
                                                alt="프로필"
                                                className="profile-img"
                                            />
                                            <p>{result.nickName}</p>
                                        </div>
                                        <button
                                            className="request-btn"
                                            onClick={handleAddFriend}
                                        >
                                            +요청
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="requests-box">
                            {requestMemberList.length > 0 ? (
                                requestMemberList.map((request, index) => (
                                    <div
                                        className="request-container"
                                        key={index}
                                    >
                                        <div className="search-result-profile">
                                            <img
                                                src={
                                                    request.profileThumbnails ||
                                                    "/default-profile.png"
                                                }
                                                alt="프로필"
                                                className="profile-img"
                                            />
                                            <span>{request.nickName}</span>
                                        </div>
                                        <div>
                                            <button
                                                className="request-btn accept"
                                                onClick={() =>
                                                    handleAccept(request.id)
                                                }
                                            >
                                                수락
                                            </button>
                                            |
                                            <button
                                                className="request-btn decline"
                                                onClick={() =>
                                                    handleDecline(request.id)
                                                }
                                            >
                                                거절
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>친구요청이 없습니다.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendModal;
