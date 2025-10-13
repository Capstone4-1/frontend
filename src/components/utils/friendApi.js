import axiosInstance from "./AxiosInstance";


export const searchFriendByStudentId = async (studentId) => {
    const res = await axiosInstance.get(`/friend/search?studentId=${studentId}`);
    return res.data;
};

export const searchFriendByNickname = async (nickname) => {
    const res = await axiosInstance.get(`/friend/search?nickname=${nickname}`);
    return res.data;
};

export const sendFriendRequest = async (id) => {
    const res = await axiosInstance.post("/friend/add-friend", { id }); // 다시 id로
    return res.data;
};

export const acceptFriendRequest = async (idToAccept) => {
    const res = await axiosInstance.post("/friend/accept-friend", { idToAccept });
    return res.data;
};

export const declineFriendRequest = async (idToDecline) => {
    const res = await axiosInstance.post("/friend/decline-friend", { idToDecline });
    return res.data;
};

export const getRequestFriendList = async () => {
    const res = await axiosInstance.get("/friend/request-friend-list");
    return res.data.requestMemberList;
};

export const getMyFriends = async () => {
    const res = await axiosInstance.get("/friend/my-friends");
    return res.data.acceptMemberDtoList;
};

export const removeFriend = async (targetId) => {
    const res = await axiosInstance.delete(`/friend/${targetId}`);
    return res.data;
};