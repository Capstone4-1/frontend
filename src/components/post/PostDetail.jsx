import { likePost, unlikePost } from "../../api/posts/like";
import ProfileTemplate from "../ProfileTemplate";
import axiosInstance from "../utils/AxiosInstance";
import { roleHierarchy } from "../utils/RoleUtils";
import { UserContext } from "../utils/UserContext";
import CommentBox from "./CommentBox";
import MenuButton from "./MenuButton";
import "./PostDetail.css";
import { Heart, Check, List, Bookmark, ChevronsRight, Eye } from "lucide-react";
import { useEffect, useState, useRef, useContext, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// 좋아요 API 함수
import { toast } from "sonner";

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);

    const [liked, setLiked] = useState(false); // 좋아요 여부
    const [likenum, setLikenum] = useState(0); // 좋아요 수
    const [scrapped, setScrapped] = useState(false); // 스크랩 여부

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
    const { hasRole, user } = useContext(UserContext); // ✅ 현재 로그인 사용자 권한 확인

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
            setScrapped(postData.isScrap || false);
        } catch (err) {
            console.error("❌ 게시글 상세 불러오기 실패:", err);
        }
    };

    // 첨부파일 없으면 렌더링 안 하기
    const cleanedContent = useMemo(() => {
        if (!post?.content) return "";

        const parser = new DOMParser();
        const doc = parser.parseFromString(post.content, "text/html");

        const fileUl = doc.querySelector("ul.file");
        if (fileUl && fileUl.querySelectorAll("li").length === 0) {
            const tr = fileUl.closest("tr");
            if (tr) tr.remove();
        }

        return doc.body.innerHTML;
    }, [post?.content]);

    // 게시글 작성일 포맷팅
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    // 스크랩 버튼 클릭 핸들러
    const handleScrapBtnClick = async () => {
        try {
            if (!scrapped) {
                const res = await axiosInstance.post(`/post/${postId}/scrap`);
                setScrapped(true);
            } else {
                const res = await axiosInstance.delete(`/post/${postId}/scrap`);
                setScrapped(false);
            }
        } catch (err) {
            console.error("❌ 스크랩 토글 실패:", err);
            toast.error("스크랩 처리 중 오류가 발생했습니다.");
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
                    : c,
            ),
        );
    };

    // 답글 입력창을 열고, @닉네임을 자동 입력
    const handleReplyClick = (id, nickname, isNestedReply) => {
        setReplyingTo(id);
        if (isNestedReply) {
            setReplyContent(`@${nickname} `); // 대댓글이면 멘션 추가
        } else {
            setReplyContent(""); // 대대댓글이면 멘션 없음
        }
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

    const canComment = () =>
        user?.roles?.some(
            (role) =>
                roleHierarchy.indexOf(role) >= roleHierarchy.indexOf("STUDENT"),
        );

    const handleCommentSubmit = async () => {
        if (!canComment()) {
            toast.error("권한이 없습니다");
            return;
        }

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
                targetUrl: `/main/community/${post.boardType.toLowerCase()}/post/${post.id}`,
            });
            setNewComment("");
            await fetchComments();
        } catch (err) {
            const message =
                err.response?.data?.message || "댓글 등록에 실패했습니다.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLikeBtnClick = async () => {
        try {
            if (!liked) {
                const data = await likePost(postId);
                setLiked(true);
                setLikenum(data.currentCount || likenum + 1);
            } else {
                const data = await unlikePost(postId);
                setLiked(false);
                setLikenum(data.currentCount || likenum - 1);
            }
        } catch (err) {
            console.error("Error while toggling like: ", err);
            alert("좋아요 처리 중 오류가 발생했습니다.");
        }
    };

    const handleReplySubmit = async (parentId) => {
        if (!canComment()) {
            toast.error("권한이 없습니다");
            return;
        }

        const now = Date.now();
        if (
            !replyContent.trim() ||
            isSubmitting ||
            now - lastSubmitTime.current < 1000
        )
            return;

        setIsSubmitting(true);
        lastSubmitTime.current = now;

        try {
            await axiosInstance.post(`/post/${postId}/comments`, {
                content: replyContent,
                parentId,
                targetUrl: `/main/community/${post.boardType.toLowerCase()}/post/${post.id}`,
            });
            setReplyContent("");
            setReplyingTo(null);
            await fetchReplies(parentId);
        } catch (err) {
            const message =
                err.response?.data?.message || "답글 등록에 실패했습니다.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!post)
        return <div className="PostDetail">게시글을 찾을 수 없습니다.</div>;

    return (
        <div className="PostDetailPage">
            <div className="PostDetail">
                <div className="post-title-with-like">
                    <h2 className="post-title">{post.title}</h2>
                    <div className="like-container">
                        {post.isAuthor && (
                            <MenuButton
                                onEdit={() =>
                                    navigate(
                                        `/write/${post.boardType.toLowerCase()}/${post.id}`,
                                    )
                                }
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
                    <div className="info-area">
                        <div className="info-left">
                            <div className="date">
                                {post.createdDate
                                    ? formatDate(new Date(post.createdDate))
                                    : ""}
                            </div>
                            <div className="view">
                                <Eye />
                                {post.viewCount}
                            </div>
                        </div>
                        <div className="info-right">
                            {/* 스크랩 버튼 */}
                            <button
                                className={`scrap-btn${scrapped ? " scrapped" : ""}`}
                                onClick={handleScrapBtnClick}
                            >
                                <Bookmark
                                    color={scrapped ? "#3399ff" : "#aaa"}
                                    fill={scrapped ? "#3399ff" : "none"}
                                />
                                <span>스크랩</span>
                            </button>
                        </div>
                    </div>
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
                                dangerouslySetInnerHTML={{
                                    __html: post.content,
                                }}
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
                                dangerouslySetInnerHTML={{
                                    __html: cleanedContent,
                                }}
                            ></div>
                        </section>
                        {post.targetUrl && (
                            <Link
                                to={post.targetUrl}
                                target="_blank"
                                className="link-area"
                            >
                                {post.boardType === "NOTICE_UNIV"
                                    ? "학교"
                                    : "학과"}{" "}
                                홈페이지에서 보기 <ChevronsRight />
                            </Link>
                        )}

                        {/* 좋아요 버튼 */}
                        <div className="react-area">
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
                        </div>
                    </>
                )}

                <div className="comment-header-wrap">
                    <span className="comment-header">
                        💬 댓글 {comments.length}개
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
                    <button
                        onClick={handleCommentSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "작성 중..." : "작성"}
                    </button>
                </div>

                <ul className="comment-list">
                    {comments
                        .filter((c) => !c.parentId)
                        .map((c) => (
                            <li key={c.id} className="comment-item">
                                <CommentBox
                                    isNestedReply={false}
                                    comment={c}
                                    boardType={post.boardType}
                                    handleCommentLike={handleCommentLike}
                                    onDeleteSuccess={(deletedId) => {
                                        setComments((prev) =>
                                            prev.filter(
                                                (c) => c.id !== deletedId,
                                            ),
                                        );
                                    }}
                                    onReplyClick={() =>
                                        handleReplyClick(
                                            c.id,
                                            c.writerNickname,
                                            false,
                                        )
                                    }
                                    isReplying={replyingTo === c.id}
                                    replyContent={replyContent}
                                    setReplyContent={setReplyContent}
                                    onSubmitReply={() =>
                                        handleReplySubmit(c.id)
                                    }
                                    onToggleReplies={() => toggleReplies(c.id)}
                                    showReplies={expandedReplies[c.id]}
                                >
                                    {expandedReplies[c.id] &&
                                        (childComments[c.id] || []).map(
                                            (reply) => (
                                                <div
                                                    key={reply.id}
                                                    className="nested-reply"
                                                >
                                                    <CommentBox
                                                        isNestedReply={true}
                                                        comment={reply}
                                                        boardType={
                                                            post.boardType
                                                        }
                                                        handleCommentLike={
                                                            handleCommentLike
                                                        }
                                                        onDeleteSuccess={(
                                                            deletedId,
                                                        ) => {
                                                            setChildComments(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [c.id]: prev[
                                                                        c.id
                                                                    ].filter(
                                                                        (r) =>
                                                                            r.id !==
                                                                            deletedId,
                                                                    ),
                                                                }),
                                                            );
                                                        }}
                                                        onReplyClick={() =>
                                                            handleReplyClick(
                                                                reply.id,
                                                                reply.writerNickname,
                                                                true,
                                                            )
                                                        }
                                                        isReplying={
                                                            replyingTo ===
                                                            reply.id
                                                        }
                                                        replyContent={
                                                            replyContent
                                                        }
                                                        setReplyContent={
                                                            setReplyContent
                                                        }
                                                        onSubmitReply={() =>
                                                            handleReplySubmit(
                                                                c.id,
                                                            )
                                                        }
                                                    />
                                                    <div className="reply-divider"></div>
                                                </div>
                                            ),
                                        )}
                                </CommentBox>
                            </li>
                        ))}
                </ul>
            </div>
            <button
                className="back-to-list-btn"
                onClick={() =>
                    navigate(`/main/community/${post.boardType.toLowerCase()}`)
                }
            >
                <List />
                게시판 목록으로 돌아가기
            </button>
        </div>
    );
};

export default PostDetail;
