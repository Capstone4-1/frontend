import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPasswordForm.css";
import axiosInstance from "./utils/AxiosInstance";

const ResetPasswordForm = () => {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState(1); // 1=아이디, 2=코드, 3=비밀번호 재설정, 4=완료
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(""); // 사용자 입력 코드
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // Step 1: 아이디 제출
  const handleSubmitUsername = async (e) => {
    e.preventDefault();
    if (!username) {
      setMessage("아이디를 입력해주세요.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await axiosInstance.post("/member/verify-id", { username });
      if (response.data?.success) {
        setEmail(response.data.email); // 서버에서 받은 email 저장
        setMessage("가입된 회원으로 인증코드를 보냈습니다.");
        setStep(2); // 인증코드 입력 단계로 이동
      } else {
        setMessage(response.data?.message || "등록된 아이디가 없습니다.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "아이디 확인 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: 인증코드 제출
  const handleSubmitCode = async (e) => {
    e.preventDefault();
    if (!code) {
      setMessage("인증코드를 입력해주세요.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axiosInstance.post("/auth/verify-code", {
        email, // username 대신 email 사용
        code,
      });

      setMessage("✅ 인증에 성공했습니다. 새로운 비밀번호를 설정해주세요.");
      setStep(3); // 다음 단계로 이동
    } catch (error) {
      setMessage(error.response?.data?.message || "인증코드 확인 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: 새 비밀번호 제출
  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage("비밀번호를 모두 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axiosInstance.post("/member/reset-password/no-login", {
        username,
        newPassword,
      });

      setMessage(response.data?.message || "비밀번호가 성공적으로 재설정되었습니다.");
      setStep(4); // 완료 단계로 이동
    } catch (error) {
      setMessage(error.response?.data?.message || "비밀번호 재설정 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 로그인 화면 이동
  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="reset-password-form">
      {/* Step 1: 아이디 입력 */}
      {step === 1 && (
        <form onSubmit={handleSubmitUsername}>
          <h2>비밀번호 찾기</h2>
          <p>가입하신 아이디를 입력해주세요.</p>

          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "확인 중..." : "다음"}
          </button>

          {message && <p className="reset-message">{message}</p>}
          <button type="button" className="login-button" onClick={handleGoLogin}>
            로그인 화면으로 이동
          </button>
        </form>
      )}

      {/* Step 2: 인증코드 확인 */}
      {step === 2 && (
        <form onSubmit={handleSubmitCode}>
          <h2>인증코드 확인</h2>
          <p>발송된 인증코드를 입력해주세요.</p>

          <input
            type="text"
            placeholder="인증코드"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <button type="submit">확인</button>

          {message && <p className="reset-message">{message}</p>}
          <button type="button" className="login-button" onClick={handleGoLogin}>
            로그인 화면으로 이동
          </button>
        </form>
      )}

      {/* Step 3: 새 비밀번호 설정 */}
      {step === 3 && (
        <form onSubmit={handleSubmitNewPassword}>
          <h2>새 비밀번호 설정</h2>
          <p>새로운 비밀번호를 입력해주세요.</p>

          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">비밀번호 변경</button>

          {message && <p className="reset-message">{message}</p>}
          <button type="button" className="login-button" onClick={handleGoLogin}>
            로그인 화면으로 이동
          </button>
        </form>
      )}

      {/* Step 4: 완료 */}
      {step === 4 && (
        <div className="reset-complete">
          <h2>완료</h2>
          <p>{message}</p>
          <button type="button" className="login-button" onClick={handleGoLogin}>
            로그인 화면으로 이동
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordForm;
