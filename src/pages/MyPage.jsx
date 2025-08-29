import Header from "../components/Header";
import MyProfile from "../components/Myprofile";
import "./MyPage.css";
import { useEffect, useState, useContext } from "react";
import axiosInstance from "../components/utils/AxiosInstance";
import { UserContext } from "../components/utils/UserContext";
import PasswordConfirmModal from "../components/modals/PasswordConfirmModal";
import PasswordEditModal from "../components/PasswordEditModal";
import EmailEditModal from "../components/EmailEditModal"; // ★ 이메일 모달 import
import WithdrawConfirmModal from "../components/WithdrawConfirmModal";

const MyPage = () => {
    const [intro, setIntro] = useState("");
    const [nickname, setNickname] = useState("");
    const [nicknameError, setNicknameError] = useState("");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isPasswordEditModalOpen, setIsPasswordEditModalOpen] =
        useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false); // ★
    const [isConfirmingEmailChange, setIsConfirmingEmailChange] =
        useState(false);
    const { user, setUser } = useContext(UserContext);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setIntro(user.intro || "");
            setNickname(user.nickname || "");
        }
    }, [user]);

    const isValidNickname = (value) => /^[a-zA-Z0-9가-힣]{1,10}$/.test(value);

    const handleSave = async () => {
        if (intro.length > 200) {
            alert("자기소개는 200자 이내로 입력해주세요.");
            return;
        }

        try {
            await axiosInstance.post("/member/set-intro", { intro });
            setUser((prev) => ({ ...prev, intro }));
            alert("자기소개가 저장되었습니다!");
        } catch (error) {
            console.error("자기소개 저장 실패:", error);
            alert("자기소개 저장에 실패했습니다.");
        }
    };

    const handleImageSelect = async (file) => {
        const MAX_FILE_SIZE = 4 * 1024 * 1024;
        try {
            if (!file) {
                const res = await axiosInstance.delete(
                    "/member/delete-profile-image"
                );
                setUser((prev) => ({
                    ...prev,
                    profileImageUrl: res.data.imageUrl,
                }));
                alert("프로필 이미지가 삭제되었습니다!");
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                alert("이미지 크기는 4MB 이하만 가능합니다.");
                return;
            }
            const formData = new FormData();
            formData.append("profileImage", file);
            const res = await axiosInstance.post(
                "/member/set-profile-image",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setUser((prev) => ({
                ...prev,
                profileImageUrl: res.data.imageUrl,
            }));
            alert("프로필 이미지가 저장되었습니다!");
        } catch (err) {
            console.error("프로필 이미지 업로드 실패:", err);
            alert("프로필 이미지 저장에 실패했습니다.");
        }
    };

    if (!user) return <p>로딩 중...</p>;

    return (
        <div className="MyPage">
            <div className="page-container">
                <aside className="profile-section">
                    <div className="proflie-img-box">
                        <MyProfile
                            profileImageUrl={user.profileImageUrl}
                            onImageSelect={handleImageSelect}
                        />
                    </div>
                    <div className="profile-info">
                        <label>닉네임: {nickname} </label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onBlur={() => {
                                const trimmed = nickname.trim();
                                if (!trimmed || !isValidNickname(trimmed)) {
                                    setNickname(user.nickname || "");
                                    setNicknameError("");
                                }
                            }}
                        />
                        {nicknameError && (
                            <small
                                style={{
                                    color: "red",
                                    marginTop: "4px",
                                    display: "block",
                                }}
                            >
                                {nicknameError}
                            </small>
                        )}
                        <button
                            className="save-btn"
                            onClick={async () => {
                                const trimmed = nickname.trim();
                                if (!isValidNickname(trimmed)) {
                                    setNicknameError(
                                        "닉네임은 10자 이하, 공백/특수문자 불가입니다."
                                    );
                                    setNickname(user.nickname || "");
                                    return;
                                }
                                try {
                                    const res = await axiosInstance.post(
                                        "/member/set-nickname",
                                        { nickname: trimmed }
                                    );
                                    if (res.status === 200) {
                                        setUser((prev) => ({
                                            ...prev,
                                            nickname: trimmed,
                                        }));
                                        alert("닉네임이 저장되었습니다!");
                                    }
                                } catch (error) {
                                    setNickname(user.nickname || "");
                                    if (error.response?.status === 409) {
                                        setNicknameError(
                                            "이미 사용 중인 닉네임입니다."
                                        );
                                    } else {
                                        console.error(
                                            "닉네임 저장 실패:",
                                            error
                                        );
                                        setNicknameError(
                                            "닉네임 저장에 실패했습니다."
                                        );
                                    }
                                }
                            }}
                        >
                            저장
                        </button>
                        <br />
                        <label>자기소개: </label>
                        <textarea
                            value={intro}
                            placeholder="200자 이내로 입력하세요"
                            maxLength={200}
                            onChange={(e) => setIntro(e.target.value)}
                        />
                        <small style={{ color: "gray" }}>
                            {intro.length}/200자
                        </small>
                        <button className="save-btn" onClick={handleSave}>
                            저장
                        </button>
                    </div>
                </aside>

                <div className="setting-sections">
                    <div className="section-card">
                        <h3>계정</h3>
                        <ul>
                            <li>
                                학번 <span>{user.username}</span>
                            </li>
                            <li>졸업생 전환</li>
                            <li
                                className="interactive-item"
                                onClick={() => setIsPasswordModalOpen(true)}
                            >
                                비밀번호 변경
                            </li>
                            <li
                                className="interactive-item"
                                onClick={() => {
                                    setIsConfirmingEmailChange(true);
                                    setIsPasswordModalOpen(true);
                                }}
                            >
                                이메일 변경
                            </li>
                        </ul>
                    </div>

                    <div className="section-card">
                        <h3>커뮤니티</h3>
                        <ul>
                            <li>이용 제한 내역</li>
                            <li>게시판 관리</li>
                            <li>커뮤니티 이용규칙</li>
                        </ul>
                    </div>

                    <div className="section-card">
                        <h3>기타</h3>
                        <ul>
                            <li
                                className="interactive-item"
                                onClick={() => setIsWithdrawModalOpen(true)}
                            >
                                회원 탈퇴
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 비밀번호 재확인 모달 */}
            <PasswordConfirmModal
                isOpen={isPasswordModalOpen}
                onClose={() => {
                    setIsPasswordModalOpen(false);
                    setIsConfirmingEmailChange(false);
                }}
                onConfirm={() => {
                    setIsPasswordModalOpen(false);
                    if (isConfirmingEmailChange) {
                        setIsEmailModalOpen(true);
                        setIsConfirmingEmailChange(false);
                    } else {
                        setIsPasswordEditModalOpen(true);
                    }
                }}
            />

            {/* 비밀번호 수정 모달 */}
            <PasswordEditModal
                isOpen={isPasswordEditModalOpen}
                onClose={() => setIsPasswordEditModalOpen(false)}
            />

            {/* 이메일 수정 모달 */}
            <EmailEditModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
            />

            {/* 탈퇴 확인 모달 */}
            <WithdrawConfirmModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
            />
        </div>
    );
};

export default MyPage;
