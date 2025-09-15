import InputBox from "./InputBox";
import "./MailModal.css";
import "./modals/Modal.css";
import axiosInstance from "./utils/AxiosInstance";
import { searchFriendByNickname, getMyFriends } from "./utils/friendApi";
import { useState } from "react";

const MailModal = ({ setOpenModal, fetchChatRooms }) => {
    const [nickname, setNickname] = useState("");
    const [result, setResult] = useState(null);
    const [resultMessage, setResultMessage] = useState("");
    const [activeTab, setActiveTab] = useState("send");
    const [friendList, setFriendList] = useState([]);

    const handleSearch = async () => {
        try {
            const data = await searchFriendByNickname(nickname.trim());
            setResult(data);
            setResultMessage("");
        } catch (error) {
            console.error("검색 실패:", error);
            setResult(null);
            setResultMessage(
                error.response?.data?.message || "검색 중 오류 발생",
            );
        }
    };

    const handleTabChange = async (tab) => {
        setActiveTab(tab);
        if (tab === "receive") {
            try {
                const friendData = await getMyFriends();
                setFriendList(friendData || []);
            } catch (error) {
                console.error("친구 목록 가져오기 실패:", error);
                setFriendList([]);
            }
        }
    };

    const createMailRoom = async (targetId) => {
        try {
            await axiosInstance.post(`/mail/new?id=${targetId}`);
            alert("채팅방이 생성되었습니다.");
            fetchChatRooms();
            setOpenModal(false);
        } catch (error) {
            if (error.response?.status === 409) {
                alert("이미 같은 채팅방이 존재합니다.");
            } else {
                console.error("채팅방 생성 실패:", error);
                alert("채팅방 생성에 실패했습니다.");
            }
        }
    };

    return (
        <div className="Modal">
            <div className="Overlay">
                <div className="container">
                    <div className="header">
                        <h3>📝대화 추가</h3>
                        <button
                            className="request-tap-btn"
                            onClick={() => handleTabChange("send")}
                        >
                            검색
                        </button>
                        <button
                            className="request-tap-btn"
                            onClick={() => handleTabChange("receive")}
                        >
                            친구목록
                        </button>
                        <button
                            style={{
                                backgroundImage: "url('/icons/exit-image.svg')",
                            }}
                            className="exit-btn"
                            type="button"
                            onClick={() => setOpenModal(false)}
                        />
                    </div>

                    {activeTab === "send" ? (
                        <section>
                            <div className="search-box">
                                <InputBox
                                    state={nickname}
                                    setStateFunction={setNickname}
                                    onClickFunction={handleSearch}
                                    placeholder={"닉네임으로 친구를 찾아보세요"}
                                />
                                {resultMessage && (
                                    <p className="error-text">
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
                                            onClick={() =>
                                                createMailRoom(result.id)
                                            }
                                        >
                                            +채팅방 생성
                                        </button>
                                    </>
                                )}
                            </div>
                        </section>
                    ) : (
                        <div className="requests-box">
                            {friendList.length > 0 ? (
                                friendList.map((friend, index) => (
                                    <div
                                        className="request-container"
                                        key={index}
                                    >
                                        <div className="search-result-profile">
                                            <img
                                                src={
                                                    friend.profileThumbnails ||
                                                    "/default-profile.png"
                                                }
                                                alt="프로필"
                                                className="profile-img"
                                            />
                                            <span>{friend.nickName}</span>
                                        </div>
                                        <button
                                            className="request-btn"
                                            onClick={() =>
                                                createMailRoom(friend.id)
                                            }
                                        >
                                            +채팅방 생성
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>친구가 없습니다.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MailModal;
