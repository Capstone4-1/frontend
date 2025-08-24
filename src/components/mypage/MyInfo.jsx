// 개인정보 수정
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

  // 이메일 변경/인증 관련
  const [emailInput, setEmailInput] = useState(user?.email || "");
  const [emailError, setEmailError] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  if (!user) return <div className="loading">로딩 중...</div>;

  // 닉네임 저장
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

  // 자기소개 저장
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

  // 이메일 저장(= 이때 인증코드 발송하고 코드 입력창 보여주기)
  const handleEmailSave = async () => {
    setEmailError("");
    setCodeError("");

    if (!emailInput || !/^\S+@\S+\.\S+$/.test(emailInput)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (emailInput === user.email) {
      setEmailError("이메일이 변경되지 않았습니다.");
      return;
    }

    try {
      setSending(true);
      // 인증코드 발송
      await axiosInstance.post("/auth/email-check", { email: emailInput });
      // 코드 입력 UI 표시
      setShowVerify(true);
      alert("인증 코드가 이메일로 전송되었습니다.");
    } catch (error) {
      console.error("인증 메일 발송 실패:", error);
      setEmailError(error.response?.data?.message || "인증 메일 발송 실패");
      setShowVerify(false);
    } finally {
      setSending(false);
    }
  };

  // 인증코드 확인 → 성공 시 이메일 반영
  const handleVerifyCode = async () => {
    setCodeError("");

    if (!verificationCode.trim()) {
      setCodeError("인증 코드를 입력해주세요.");
      return;
    }

    try {
      setVerifying(true);
      await axiosInstance.post("/auth/verify-code", {
        email: emailInput,
        code: verificationCode,
      });

      // 필요 시 서버에 이메일 최종 반영 API가 따로 있으면 여기서 호출:
      // await axiosInstance.post("/member/set-email", { email: emailInput });

      setUser((prev) => ({ ...prev, email: emailInput }));
      setShowVerify(false);
      setVerificationCode("");
      alert("이메일이 인증 및 저장되었습니다!");
    } catch (error) {
      console.error("인증 실패:", error);
      setCodeError(error.response?.data?.message || "인증번호가 올바르지 않습니다.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="myinfo-form-container">
      <h2>개인 정보 수정</h2>

      {/* 이름 */}
      <div className="myinfo-item">
        <label>이름</label>
        <input type="text" value={user.name} disabled />
      </div>

      {/* 닉네임 */}
      <div className="myinfo-item nickname">
        <label>닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setNicknameError("");
          }}
          placeholder="닉네임(10자 이하, 특수문자/공백 불가)"
        />
        {nicknameError && <div className="error-text">{nicknameError}</div>}
        <button onClick={handleNicknameUpdate} disabled={isNicknameUpdating}>
          {isNicknameUpdating ? "저장 중..." : "닉네임 저장"}
        </button>
      </div>

      {/* 이메일 (저장 누르면 코드 발송 + 코드 입력창 표시) */}
      <div className="myinfo-item email">
        <label>이메일</label>
        <input
          type="email"
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
            setEmailError("");
            // 이메일을 다시 수정하면 인증 단계는 리셋
            setShowVerify(false);
            setVerificationCode("");
            setCodeError("");
          }}
          placeholder="변경할 이메일 주소"
        />
        {emailError && <div className="error-text">{emailError}</div>}

        {/* 저장 버튼을 이메일 바로 아래 한 줄에 배치 */}
        <button type="button" onClick={handleEmailSave} disabled={sending}>
          {sending ? "발송 중..." : "이메일 저장"}
        </button>

        {/* 저장(발송) 이후에만 코드 입력 표시 */}
        {showVerify && (
          <div className="verify-block">
            <label>인증코드</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);
                setCodeError("");
              }}
              placeholder="이메일로 받은 코드 입력"
            />
            {codeError && <div className="error-text">{codeError}</div>}
            <button type="button" onClick={handleVerifyCode} disabled={verifying}>
              {verifying ? "확인 중..." : "인증 확인"}
            </button>
          </div>
        )}
      </div>

      {/* 자기소개 */}
      <div className="myinfo-item">
        <label>자기소개</label>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows="4"
          placeholder="자기소개(200자 이내)"
        />
        <button onClick={handleIntroUpdate} disabled={isIntroUpdating}>
          {isIntroUpdating ? "저장 중..." : "소개 저장"}
        </button>
      </div>
    </div>
  );
};

export default MyInfo;
