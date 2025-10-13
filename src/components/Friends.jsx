import FriendModal from "./FriendModal";
import "./Friends.css";
import Reddot from "./Reddot";
import { getRequestFriendList, getMyFriends } from "./utils/friendApi";
import { Users } from "lucide-react";
import { useState, useEffect } from "react";

// 모듈화한 API 사용

// const dummyFriends = [
//   {
//     id: 1,
//     nickName: "Alice",
//     profileThumbnails: "https://i.pravatar.cc/100?img=1",
//   },
//   {
//     id: 2,
//     nickName: "Bob",
//     profileThumbnails: "https://i.pravatar.cc/100?img=2",
//   },
//   {
//     id: 3,
//     nickName: "Charlie",
//     profileThumbnails: "https://i.pravatar.cc/100?img=3",
//   },
//   {
//     id: 4,
//     nickName: "David",
//     profileThumbnails: "https://i.pravatar.cc/100?img=4",
//   },
//   {
//     id: 5,
//     nickName: "Eve",
//     profileThumbnails: "https://i.pravatar.cc/100?img=5",
//   },
//   {
//     id: 6,
//     nickName: "Frank",
//     profileThumbnails: "https://i.pravatar.cc/100?img=6",
//   },
//   {
//     id: 7,
//     nickName: "Grace",
//     profileThumbnails: "https://i.pravatar.cc/100?img=7",
//   },
//   {
//     id: 8,
//     nickName: "Heidi",
//     profileThumbnails: "https://i.pravatar.cc/100?img=8",
//   },
//   {
//     id: 9,
//     nickName: "Ivan",
//     profileThumbnails: "https://i.pravatar.cc/100?img=9",
//   },
//   {
//     id: 10,
//     nickName: "Judy",
//     profileThumbnails: "https://i.pravatar.cc/100?img=10",
//   },
// ];

const Friends = () => {
    const [openModal, setOpenModal] = useState(false);
    const [hasFriendRequest, setHasFriendrequest] = useState(false);
    const [requestMemberList, setRequestMemberList] = useState([]);
    const [myFriendList, setMyFriendList] = useState([]);

    // 요청 친구 목록 불러오기
    const fetchRequestFriendInfo = async () => {
        try {
            const data = await getRequestFriendList();
            setRequestMemberList(data || []);
            setHasFriendrequest(data.length > 0);
        } catch (error) {
            console.error("요청 목록 가져오기 실패:", error);
            setHasFriendrequest(false);
        }
    };

    // 내 친구 목록 불러오기
    const fetchMyFriendInfo = async () => {
        try {
            const data = await getMyFriends();
            setMyFriendList(data || []);
        } catch (error) {
            console.error("친구 목록 가져오기 실패:", error);
        }
    };

    // 초기 실행
    useEffect(() => {
        fetchRequestFriendInfo();
        fetchMyFriendInfo();
    }, []);

    return (
        <div className="Friends">
            <button className="header-btn" onClick={() => setOpenModal(true)}>
                <Users />
                <Reddot count={requestMemberList.length} />
            </button>

            {openModal && (
                <FriendModal
                    setOpenModal={setOpenModal}
                    hasFriendRequest={hasFriendRequest}
                    setHasFriendrequest={setHasFriendrequest}
                    requestMemberList={requestMemberList}
                    setRequestMemberList={setRequestMemberList}
                    fetchMyFriendInfo={fetchMyFriendInfo}
                    myFriendList={myFriendList}
                    // myFriendList={dummyFriends}
                />
            )}
        </div>
    );
};

export default Friends;
