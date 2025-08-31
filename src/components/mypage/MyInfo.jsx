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

  // 이메일 변경 / 인증
  const [emailInput, setEmailInput] = useState(user?.email || "");
  const [emailError, setEmailError] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // 비밀번호 변경
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [isPwUpdating, setIsPwUpdating] = useState(false);
  const [stepPw, setStepPw] = useState(1);

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
      const res = await axiosInstance.post("/member/set-nickname", {
        nickname: trimmed,
      });
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

  // 이메일 저장
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
      await axiosInstance.post("/auth/email-check", { email: emailInput });
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

  // 이메일 인증
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

  // 비밀번호 1단계
  const handlePwFirstSave = async () => {
    if (!currentPassword.trim()) {
      setPwError("현재 비밀번호를 입력해주세요.");
      return;
    }
    if (!newPassword.trim()) {
      setPwError("새 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await axiosInstance.post("/member/verify-password", {
        password: currentPassword,
      });
      if (res.data?.message === true) {
        setPwError("");
        setStepPw(2); // 2단계로 이동
      } else {
        setPwError("현재 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("현재 비밀번호 확인 실패:", error);
      setPwError("비밀번호 확인 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호 최종 저장
  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setPwError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      setIsPwUpdating(true);
      await axiosInstance.post("/member/reset-password", {
        currentPassword,
        newPassword,
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwError("");
      setStepPw(1);
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      if (error.response) {
        if (error.response.status === 400) {
          setPwError("유효하지 않은 요청입니다.");
        } else if (error.response.status === 401) {
          setPwError("현재 비밀번호가 올바르지 않습니다.");
        } else {
          setPwError(`서버 오류가 발생했습니다. (${error.response.status})`);
        }
      } else {
        setPwError("네트워크 오류가 발생했습니다.");
      }
    } finally {
      setIsPwUpdating(false);
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

      {/* 이메일 */}
      <div className="myinfo-item email">
        <label>이메일</label>
        <input
          type="email"
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
            setEmailError("");
            setShowVerify(false);
            setVerificationCode("");
            setCodeError("");
          }}
          placeholder="변경할 이메일 주소"
        />
        {emailError && <div className="error-text">{emailError}</div>}
        <button type="button" onClick={handleEmailSave} disabled={sending}>
          {sending ? "발송 중..." : "이메일 저장"}
        </button>
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

      {/* 비밀번호 */}
      <div className="myinfo-item password">
        <label>비밀번호</label>

        {/* 현재 비밀번호 */}
        <input
          type="password"
          placeholder="현재 비밀번호"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            setPwError("");
          }}
        />

        {/* 새 비밀번호 */}
        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setPwError("");
          }}
        />

        {/* 버튼 */}
        {stepPw === 1 && (
          <button type="button" onClick={handlePwFirstSave}>
            다음
          </button>
        )}

        {stepPw === 2 && (
          <div className="verify-block">
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="button" onClick={handleSubmit} disabled={isPwUpdating}>
              {isPwUpdating ? "저장 중..." : "비밀번호 변경"}
            </button>
          </div>
        )}

        {pwError && <div className="error-text">{pwError}</div>}
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
