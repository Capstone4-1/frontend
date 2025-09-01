import "./ResetPasswordForm.css";
import Timer from "./Timer";
import axiosInstance from "./utils/AxiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResetPasswordForm = () => {
    const [username, setUsername] = useState("");
    const [step, setStep] = useState(1); // 1=아이디, 2=코드, 3=비밀번호 재설정
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false); // 인증코드 재전송 로딩
    const [email, setEmail] = useState("");
    const [code, setCode] = useState(""); // 사용자 입력 코드
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false); // 에러 여부
    const [timerKey, setTimerKey] = useState(0);

    const navigate = useNavigate();

    const startTimer = () => {
        setTimerKey((prev) => prev + 1);
    };

    // Step 1: 아이디 제출
    const handleSubmitUsername = async (e) => {
        e.preventDefault();
        if (!username) {
            setMessage("학번/교번을 입력해주세요.");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const response = await axiosInstance.post("/member/verify-id", {
                username,
            });
            if (response.data?.success) {
                setEmail(response.data.email); // 서버에서 받은 email 저장
                toast.success(
                    `${response.data.email}로 인증코드를 발송했습니다.`,
                );
                setStep(2); // 인증코드 입력 단계로 이동
            } else {
                setMessage(
                    response.data?.message ||
                        "일치하는 회원정보가 없습니다. 다시 입력해주세요.",
                );
                setError(true);
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "아이디 확인 중 오류가 발생했습니다.",
            );
            console.error(error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // 인증코드 재전송
    const handleResendCode = async () => {
        if (!username) return;

        setResendLoading(true);
        try {
            const response = await axiosInstance.post("/member/verify-id", {
                username,
            });
            toast.success(`${response.data.email}로 인증코드를 발송했습니다.`);
            startTimer();
        } catch (err) {
            console.error(err);
            toast.error("인증코드 재전송 중 오류가 발생했습니다.");
        } finally {
            setResendLoading(false);
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

            toast.success("인증이 완료되었습니다.");
            setStep(3); // 다음 단계로 이동
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "인증코드 확인 중 오류가 발생했습니다.",
            );
            setError(true);
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
            setError(true);
            setMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await axiosInstance.post(
                "/member/reset-password/no-login",
                {
                    username,
                    newPassword,
                },
            );

            toast.success("비밀번호가 재설정되었습니다.");
            navigate("/login");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "비밀번호 재설정 중 오류가 발생했습니다.",
            );
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
        <div className="reset-pw-box">
            {/* Step 1: 아이디 입력 */}
            {step === 1 && (
                <form onSubmit={handleSubmitUsername}>
                    <h2 className="title">비밀번호를 잊으셨나요?</h2>
                    <p className="caption">
                        학번/교번을 입력하시면,
                        <br />
                        인증코드를 보내드려요.
                    </p>

                    <div className="input-field">
                        <label htmlFor="username">학번/교번</label>
                        <input
                            className={`input-focus ${error ? "input-error" : ""}`}
                            type="text"
                            id="username"
                            value={username}
                            placeholder="ex ) 20251234"
                            maxLength={255}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (error) setError(false);
                            }}
                            required
                        />
                        {error && message && (
                            <p className="error-message">{message}</p>
                        )}
                    </div>

                    <button type="submit" disabled={loading || !username}>
                        {loading ? "확인 중..." : "인증코드 보내기"}
                    </button>
                    <button
                        type="button"
                        className="go-login-btn"
                        onClick={handleGoLogin}
                    >
                        로그인 페이지로 돌아가기
                    </button>
                </form>
            )}

            {/* Step 2: 인증코드 확인 */}
            {step === 2 && (
                <form onSubmit={handleSubmitCode}>
                    <h2 className="title">인증코드 확인</h2>
                    <p className="caption">발송된 인증코드를 입력해주세요.</p>

                    <div className="input-field">
                        <label htmlFor="code">인증코드</label>
                        <input
                            className={`input-focus ${error ? "input-error" : ""}`}
                            type="text"
                            id="code"
                            value={code}
                            placeholder="인증코드 입력"
                            maxLength={6}
                            onChange={(e) => {
                                setCode(e.target.value);
                                if (error) setError(false);
                            }}
                            required
                        />
                        {error && message && (
                            <p className="error-message">{message}</p>
                        )}
                        <div className="timer-resend-container">
                            <Timer duration={300} triggerReset={timerKey} />
                            <button
                                type="button"
                                className="resend-btn"
                                onClick={handleResendCode}
                                disabled={resendLoading}
                            >
                                {resendLoading
                                    ? "요청 중..."
                                    : "인증코드 재전송"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={!code}>
                        확인
                    </button>
                    <button
                        type="button"
                        className="go-login-btn"
                        onClick={handleGoLogin}
                    >
                        로그인 페이지로 돌아가기
                    </button>
                </form>
            )}

            {/* Step 3: 새 비밀번호 설정 */}
            {step === 3 && (
                <form onSubmit={handleSubmitNewPassword}>
                    <h2 className="title">새 비밀번호 설정</h2>
                    <p className="caption">
                        안전한 새 비밀번호를 입력해주세요.
                    </p>

                    <div className="input-field">
                        <label htmlFor="pw">새 비밀번호</label>
                        <input
                            className="input-focus"
                            type="password"
                            id="pw"
                            value={newPassword}
                            placeholder="새 비밀번호"
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />

                        <label htmlFor="pw-confirm">비밀번호 확인</label>
                        <input
                            className={`input-focus ${error ? "input-error" : ""}`}
                            type="password"
                            id="pw-confirm"
                            value={confirmPassword}
                            placeholder="비밀번호 확인"
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (error) setError(false);
                            }}
                            required
                        />
                        {error && message && (
                            <p className="error-message">{message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!newPassword || !confirmPassword}
                    >
                        비밀번호 재설정
                    </button>
                    <button
                        type="button"
                        className="go-login-btn"
                        onClick={handleGoLogin}
                    >
                        로그인 페이지로 돌아가기
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPasswordForm;
