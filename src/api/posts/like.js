import axiosInstance from "../../components/utils/AxiosInstance";

export const likePost = async (postId) => {
    const res = await axiosInstance.post(`/post/${postId}/like`);
    console.log("like.js에서 좋아요 성공:", res.data);
    return res.data;
};

export const unlikePost = async (postId) => {
    const res = await axiosInstance.post(`/post/${postId}/unlike`);
    return res.data;
};