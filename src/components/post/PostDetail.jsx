import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/AxiosInstance";
import "./PostDetail.css";
import CommentBox from "./CommentBox";
import ProfileTemplate from "../ProfileTemplate";
import MenuButton from "./MenuButton";
import { Heart, Check } from "lucide-react";

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(false); // 좋아요 여부
    const [likenum, setLikenum] = useState(0); // 좋아요 수
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [sortOrder, setSortOrder] = useState("oldest"); // 댓글 정렬. 'oldest' 또는 'newest'
    const [replyContent, setReplyContent] = useState("");
    const [childComments, setChildComments] = useState({}); // 대댓글 저장
    const [expandedReplies, setExpandedReplies] = useState({}); // 대댓글 확장 상태 저장
    const [isSubmitting, setIsSubmitting] = useState(false);
    const lastSubmitTime = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [postId]);

    // 게시글 상세 정보 불러오기
    const fetchPost = async () => {
        try {
            const res = await axiosInstance.get(`/post/${postId}`);
            const postData = res.data.dto;
            setPost(postData);
            setLikenum(postData.likeCount || 0);
            setLiked(postData.isLike || false);
        } catch (err) {
            console.error("❌ 게시글 상세 불러오기 실패:", err);
        }
    };

    const sortComments = (comments, order) => {
        return [...comments].sort((a, b) => {
            const dateA = new Date(a.createdDate);
            const dateB = new Date(b.createdDate);
            return order === "oldest" ? dateA - dateB : dateB - dateA;
        });
    };

    const fetchComments = async () => {
        try {
            const res = await axiosInstance.get(`/post/${postId}/comments`);
            const commentList = res.data.comments || [];
            const sorted = sortComments(commentList, sortOrder);
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

    // 답글 입력창을 열고, @닉네임을 자동 입력
    const handleReplyClick = (id, nickname) => {
        setReplyingTo(id);
        setReplyContent(`@${nickname} `);
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
                targetUrl: `/main/community/${post.boardType.toLowerCase()}/post/${post.id}`
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
        setIsSubmitting(true);
        try {
            await axiosInstance.post(`/post/${postId}/comments`, {
                content: replyContent,
                parentId,
                targetUrl: `/main/community/${post.boardType.toLowerCase()}/post/${
                    post.id
                }`,
            });
            setReplyContent("");
            setReplyingTo(null);
            await fetchComments();
        } catch (e) {
            console.error("답글 등록 실패:", e);
            alert("답글 등록 실패");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLikeBtnClick = async () => {
        try {
            if (!liked) {
                const res = await axiosInstance.post(`/post/${postId}/like`);
                setLiked(true);
                setLikenum(res.data.currentCount || likenum + 1);
            } else {
                const res = await axiosInstance.post(`/post/${postId}/unlike`);
                console.log("좋아요 취소 성공:", res);
                setLiked(false);
                setLikenum(res.data.currentCount);
            }
        } catch (err) {
            console.error("Error while toggling like: ", err);
            alert("좋아요 처리 중 오류가 발생했습니다.");
        }
    }

    if (!post)
        return <div className="PostDetail">게시글을 찾을 수 없습니다.</div>;

    return (
        <div className="PostDetail">
            <div className="post-title-with-like">
                <h2 className="post-title">{post.title}</h2>
                <div className="like-container">
                    <button
                        className={`like-toggle-button${liked ? " liked" : ""}`}
                        onClick={handleLikeBtnClick}
                    >
                        <Heart
                            color={liked ? "#e74c3c" : "#aaa"}
                            fill={liked ? "#e74c3c" : "none"}
                        />
                    </button>
                    <span>{likenum}</span>
                    {post.isAuthor && (
                        <MenuButton
                            onEdit={() => { }}
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
            <button
                className="back-to-list-button"
                onClick={() =>
                    navigate(`/main/community/${post.boardType.toLowerCase()}`)
                }
            >
                목록으로
            </button>

            <div className="comment-header-line">
                <span className="comment-header">
                    💬 댓글 {comments.length}
                </span>
                <div className="sort-controls">
                    <button
                        className={`sort-button ${
                            sortOrder === "oldest" ? "active" : ""
                        }`}
                        onClick={() => {
                            setSortOrder("oldest");
                            setComments(sortComments(comments, "oldest"));
                        }}
                    >
                        {" "}
                        <Check />
                        등록순
                    </button>
                    <button
                        className={`sort-button ${
                            sortOrder === "newest" ? "active" : ""
                        }`}
                        onClick={() => {
                            setSortOrder("newest");
                            setComments(sortComments(comments, "newest"));
                        }}
                    >
                        {" "}
                        <Check />
                        최신순
                    </button>
                </div>
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
                {comments
                    .filter((c) => !c.parentId)
                    .map((c) => (
                        <li key={c.id} className="comment-item">
                            <CommentBox
                                comment={c}
                                boardType={post.boardType}
                                handleCommentLike={handleCommentLike}
                                onDeleteSuccess={(deletedId) => {
                                    setComments((prev) =>
                                        prev.filter((c) => c.id !== deletedId)
                                    );
                                }}
                                onReplyClick={() =>
                                    handleReplyClick(c.id, c.writerNickname)
                                }
                                isReplying={replyingTo === c.id}
                                replyContent={replyContent}
                                setReplyContent={setReplyContent}
                                onSubmitReply={() => handleReplySubmit(c.id)}
                                onToggleReplies={() => toggleReplies(c.id)}
                                showReplies={expandedReplies[c.id]}
                            >
                                {expandedReplies[c.id] &&
                                    (childComments[c.id] || []).map((reply) => (
                                        <div
                                            key={reply.id}
                                            className="nested-reply"
                                        >
                                            <CommentBox
                                                comment={reply}
                                                boardType={post.boardType}
                                                handleCommentLike={
                                                    handleCommentLike
                                                }
                                                onDeleteSuccess={(
                                                    deletedId
                                                ) => {
                                                    setChildComments(
                                                        (prev) => ({
                                                            ...prev,
                                                            [c.id]: prev[
                                                                c.id
                                                            ].filter(
                                                                (r) =>
                                                                    r.id !==
                                                                    deletedId
                                                            ),
                                                        })
                                                    );
                                                }}
                                                onReplyClick={() =>
                                                    handleReplyClick(
                                                        reply.id,
                                                        reply.writerNickname
                                                    )
                                                }
                                                isReplying={
                                                    replyingTo === reply.id
                                                }
                                                replyContent={replyContent}
                                                setReplyContent={
                                                    setReplyContent
                                                }
                                                onSubmitReply={() =>
                                                    handleReplySubmit(c.id)
                                                }
                                            />
                                        </div>
                                    ))}
                            </CommentBox>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default PostDetail;
