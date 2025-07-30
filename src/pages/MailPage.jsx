import "./MailPage.css";
import Header from "../components/Header";
import MailSide from "../components/MailSide";
import { useRef, useState, useEffect } from "react";
import axiosInstance from "../components/utils/AxiosInstance";
import ChatBox from "../components/ChatBox";
import useChatDeque from "../components/hooks/useChatDeque";

const MailPage = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [message, setMessage] = useState("");
    const [chatRooms, setChatRooms] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const isFetchingRef = useRef(false);
    const isSendingRef = useRef(false); // ✅ 중복 전송 방지용
    const selectedRoomRef = useRef(null);

    const {
        messages: chatMessages,
        resetMessages,
        addOldMessages,
        addNewMessage,
    } = useChatDeque();

    useEffect(() => {
        selectedRoomRef.current = selectedRoom;
    }, [selectedRoom]);

    const handleLoadMore = (beforeId) => {
        const roomId = selectedRoomRef.current?.roomId;
        if (roomId && hasMore && !isFetchingRef.current) {
            fetchChatMessages(roomId, beforeId);
        }
    };

    const fetchChatRooms = async () => {
        try {
            const res = await axiosInstance.get("/mail/my-room");
            if (res.status === 200 && res.data.roomDtos) {
                setChatRooms(res.data.roomDtos);
            }
        } catch (err) {
            console.error("❌ 채팅방 목록 실패:", err);
        }
    };

    const fetchChatMessages = async (roomId, beforeId = null) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            const params = beforeId ? { beforeId, size: 20 } : { size: 20 };
            const response = await axiosInstance.get(`/mail/messages/${roomId}`, {
                params,
            });

            if (response.status === 200 && response.data.messages) {
                const ordered = response.data.messages.reverse();
                if (!beforeId) {
                    resetMessages(ordered);
                } else {
                    addOldMessages(ordered);
                }
                setHasMore(!response.data.last);
            }
        } catch (error) {
            console.error("채팅 메시지 불러오기 실패:", error);
        } finally {
            isFetchingRef.current = false;
        }
    };

    const handleSend = async () => {
        if (!message.trim() || isSendingRef.current) return;
        isSendingRef.current = true;
        try {
            const response = await axiosInstance.post(
                `/mail/send-mail/${selectedRoom.roomId}`,
                {
                    content: message,
                    partnerId: selectedRoom.partner.id,
                }
            );

            if (response.status === 200 && response.data.sentMessage) {
                addNewMessage(response.data.sentMessage);
            }

            setMessage("");
        } catch (error) {
            console.error("❌ 메시지 전송 실패:", error);
        } finally {
            isSendingRef.current = false;
        }
    };

    useEffect(() => {
        fetchChatRooms();
    }, []);

    useEffect(() => {
        if (selectedRoom) {
            resetMessages([]); // 🔥 메시지 초기화
            setHasMore(true);
            fetchChatMessages(selectedRoom.roomId);
        }
    }, [selectedRoom]);

    return (
        <div className="MailPage">
            <Header title="Chat-mail" />
            <div className="layout">
                <aside className="mail-side">
                    <MailSide
                        fetchChatRooms={fetchChatRooms}
                        chatRooms={chatRooms}
                        selectedFriend={selectedRoom}
                        setSelectedRoom={setSelectedRoom}
                    />
                </aside>
                <section className="chat-section">
                    {!selectedRoom ? (
                        <div className="no-friend-selected">
                            <img
                                className="no-select-img"
                                src="icons/no_select.png"
                                alt="No friend selected"
                            />
                        </div>
                    ) : (
                        <>
                            <ChatBox
                                selectedRoom={selectedRoom}
                                chatMessages={chatMessages}
                                hasMore={hasMore}
                                onLoadMore={handleLoadMore}
                            />
                            <div className="chat-input-box">
                                <input
                                    type="text"
                                    placeholder="메시지를 입력하세요..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); // ✅ 중복 전송 방지
                                            handleSend();
                                        }
                                    }}
                                />
                                <button onClick={handleSend}>전송</button>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default MailPage;
