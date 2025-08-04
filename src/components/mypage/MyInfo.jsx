import { useContext, useState } from "react";
import { UserContext } from "../utils/UserContext";
import "./MyInfo.css";
import axiosInstance from "../utils/AxiosInstance";

const isValidNickname = (value) => /^[a-zA-Z0-9가-힣]{1,10}$/.test(value);

const MyInfo = () => {
  const { user, setUser } = useContext(UserContext);

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [intro, setIntro] = useState(user?.intro || "");
  const [nicknameError, setNicknameError] = useState("");

  const [isNicknameUpdating, setIsNicknameUpdating] = useState(false);
  const [isIntroUpdating, setIsIntroUpdating] = useState(false);

  if (!user) return <div className="loading">로딩 중...</div>;

  const handleNicknameUpdate = async () => {
    const trimmed = nickname.trim();

    if (!isValidNickname(trimmed)) {
      setNicknameError("닉네임은 10자 이하, 공백/특수문자 불가입니다.");
      setNickname(user.nickname || "");
      return;
    }

    try {
      setIsNicknameUpdating(true);
      const res = await axiosInstance.post("/member/set-nickname", { nickname: trimmed });
      if (res.status === 200) {
        setUser((prev) => ({ ...prev, nickname: trimmed }));
        alert("닉네임이 저장되었습니다!");
        setNicknameError("");
      }
    } catch (error) {
      setNickname(user.nickname || "");
      if (error.response?.status === 409) {
        setNicknameError("이미 사용 중인 닉네임입니다.");
      } else {
        console.error("닉네임 저장 실패:", error);
        setNicknameError("닉네임 저장에 실패했습니다.");
      }
    } finally {
      setIsNicknameUpdating(false);
    }
  };

  const handleIntroUpdate = async () => {
    if (intro.length > 200) {
      alert("자기소개는 200자 이내로 입력해주세요.");
      return;
    }

    try {
      setIsIntroUpdating(true);
      await axiosInstance.post("/member/set-intro", { intro });
      setUser((prev) => ({ ...prev, intro }));
      alert("자기소개가 저장되었습니다!");
    } catch (error) {
      console.error("자기소개 저장 실패:", error);
      alert("자기소개 저장에 실패했습니다.");
    } finally {
      setIsIntroUpdating(false);
    }
  };

  return (
    <div className="myinfo-form-container">
      <h2>개인 정보 수정</h2>

      <div className="myinfo-item">
        <label>이름</label>
        <input type="text" value={user.name} disabled />
      </div>

      <div className="myinfo-item">
        <label>닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setNicknameError("");
          }}
        />
        {nicknameError && <div className="error-text">{nicknameError}</div>}
        <button onClick={handleNicknameUpdate} disabled={isNicknameUpdating}>
          {isNicknameUpdating ? "저장 중..." : "닉네임 저장"}
        </button>
      </div>

      <div className="myinfo-item">
        <label>이메일</label>
        <input type="email" value={user.email} disabled />
      </div>

      <div className="myinfo-item">
        <label>자기소개</label>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows="4"
        />
        <button onClick={handleIntroUpdate} disabled={isIntroUpdating}>
          {isIntroUpdating ? "저장 중..." : "소개 저장"}
        </button>
      </div>
    </div>
  );
};

export default MyInfo;
