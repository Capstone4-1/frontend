import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/AxiosInstance";
import "./PostDetail.css";
import CommentBox from "./CommentBox";
import ProfileTemplate from "../ProfileTemplate";
import MenuButton from "./MenuButton";
import { Heart } from "lucide-react";

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [childComments, setChildComments] = useState({});
    const [expandedReplies, setExpandedReplies] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const lastSubmitTime = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const res = await axiosInstance.get(`/post/${postId}`);
            setPost(res.data.dto);
        } catch (err) {
            console.error("❌ 게시글 상세 불러오기 실패:", err);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axiosInstance.get(`/post/${postId}/comments`);
            const commentList = res.data.comments || [];
            const sorted = [...commentList].sort(
                (a, b) => new Date(a.createdDate) - new Date(b.createdDate) // 최신 댓글이 아래로
            );
            setComments(sorted);
        } catch (err) {
            console.error("❌ 댓글 불러오기 실패:", err);
        }
    };

    const fetchReplies = async (parentId) => {
        try {
            const res = await axiosInstance.get(`/post/${parentId}/replies`);
            const replies = res.data.replies || [];
            setChildComments((prev) => ({ ...prev, [parentId]: replies }));
            setExpandedReplies((prev) => ({ ...prev, [parentId]: true }));
        } catch (err) {
            console.error("❌ 대댓글 불러오기 실패:", err);
        }
    };

    const toggleReplies = async (parentId) => {
        if (expandedReplies[parentId]) {
            setExpandedReplies((prev) => ({ ...prev, [parentId]: false }));
        } else {
            if (!childComments[parentId]) {
                await fetchReplies(parentId);
            } else {
                setExpandedReplies((prev) => ({ ...prev, [parentId]: true }));
            }
        }
    };

    const handleCommentLike = (commentId) => {
        setComments((prev) =>
            prev.map((c) =>
                c.id === commentId
                    ? {
                          ...c,
                          liked: !c.liked,
                          likes: (c.likes || 0) + (c.liked ? -1 : 1),
                      }
                    : c
            )
        );
    };

    const handlePostDelete = async () => {
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
        try {
            await axiosInstance.delete(`/post/${postId}`);
            navigate(`/main/community/${post.boardType.toLowerCase()}`);
        } catch (err) {
            console.error("❌ 게시글 삭제 실패:", err);
            alert("게시글 삭제 중 오류가 발생했습니다.");
        }
    };

    const handleCommentSubmit = async () => {
        const now = Date.now();
        if (
            !newComment.trim() ||
            isSubmitting ||
            now - lastSubmitTime.current < 1000
        )
            return;

        setIsSubmitting(true);
        lastSubmitTime.current = now;

        try {
            await axiosInstance.post(`/post/${postId}/comments`, {
                content: newComment,
            });
            setNewComment("");
            await fetchComments();
        } catch (err) {
            console.error("❌ 댓글 등록 실패:", err);
            alert("댓글 등록 실패");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReplySubmit = async (parentId) => {
        if (!replyContent.trim()) return;
        try {
            await axiosInstance.post(`/post/${postId}/comments`, {
                content: replyContent,
                parentId,
            });
            setReplyContent("");
            setReplyingTo(null);
            await fetchReplies(parentId);
        } catch (e) {
            console.error("답글 등록 실패:", e);
        }
    };

    const renderCommentTree = (comment) => (
        <CommentBox
            key={comment.id}
            comment={comment}
            boardType={post.boardType}
            handleCommentLike={handleCommentLike}
            onDeleteSuccess={(deletedId) => {
                setComments((prev) => prev.filter((c) => c.id !== deletedId));
                setChildComments((prev) => {
                    const updated = { ...prev };
                    Object.keys(updated).forEach((key) => {
                        updated[key] = updated[key].filter(
                            (r) => r.id !== deletedId
                        );
                    });
                    return updated;
                });
            }}
            onReplyClick={(id) => {
                setReplyingTo(id === replyingTo ? null : id);
                setReplyContent("");
            }}
            isReplying={replyingTo === comment.id}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            onSubmitReply={handleReplySubmit}
            showReplies={expandedReplies[comment.id]}
            onToggleReplies={() => toggleReplies(comment.id)}
        >
            {expandedReplies[comment.id] &&
                (childComments[comment.id] || []).map((child) => (
                    <div
                        key={child.id}
                        className="nested-reply"
                        style={{ marginLeft: "20px" }}
                    >
                        {renderCommentTree(child)}
                    </div>
                ))}
        </CommentBox>
    );

    if (!post)
        return <div className="PostDetail">게시글을 찾을 수 없습니다.</div>;

    return (
        <div className="PostDetail">
            <div className="post-title-with-like">
                <h2 className="post-title">{post.title}</h2>
                <div className="like-container">
                    <button
                        className={`like-toggle-button${liked ? " liked" : ""}`}
                        onClick={() => setLiked(!liked)}
                    >
                        <Heart
                            color={liked ? "#e74c3c" : "#aaa"}
                            fill={liked ? "#e74c3c" : "none"}
                        />
                    </button>
                    <span>{post.likeCount ?? 0}</span>
                    {post.isAuthor && (
                        <MenuButton
                            onEdit={() => {}}
                            onDelete={handlePostDelete}
                        />
                    )}
                </div>
            </div>

            <div className="post-meta">
                {post.boardType === "SECRET" ? (
                    <div className="anonymous-writer">익명</div>
                ) : (
                    <ProfileTemplate
                        profileImageUrl={post.writerProfileThumbnails}
                        name={post.writerNickname}
                        id={post.writerId}
                    />
                )}
                {post.createdDate?.slice(0, 10)} | 조회 {post.viewCount}
            </div>

            {post.boardType === "MARKET" ? (
                <div className="market-horizontal-layout">
                    <div className="market-image-box">
                        <img
                            src={post.imageUrls || "/icons/no-img-text.png"}
                            alt="상품 이미지"
                            className="market-main-image"
                        />
                    </div>
                    <div className="market-info-box">
                        <h3 className="market-title">{post.title}</h3>
                        <p className="market-price">
                            {post.price != null
                                ? `${post.price.toLocaleString()}원`
                                : "가격 미정"}
                        </p>
                        <div
                            className="market-description"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        ></div>
                    </div>
                </div>
            ) : (
                <>
                    {post.image_urls && (
                        <img
                            src={post.image_urls}
                            alt="썸네일"
                            className="post-image"
                        />
                    )}
                    <section className="post-content-box">
                        <div
                            className="post-content"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        ></div>
                    </section>
                </>
            )}

            <div className="comment-header-line">
                <span className="comment-header">
                    💬 댓글 {comments.length}
                </span>
            </div>

            <div className="comment-form">
                <input
                    type="text"
                    placeholder="댓글을 입력하세요"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCommentSubmit();
                        }
                    }}
                />
                <button onClick={handleCommentSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "작성 중..." : "작성"}
                </button>
            </div>

            <ul className="comment-list">
                {comments.map((c) => (
                    <li key={c.id} className="comment-item">
                        {renderCommentTree(c)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostDetail;
