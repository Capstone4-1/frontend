import "./ResetPasswordForm.css";
import Timer from "./Timer";
import axiosInstance from "./utils/AxiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResetPasswordForm = () => {
    const [username, setUsername] = useState("");
    const [step, setStep] = useState(1); // 1=아이디, 2=코드, 3=비밀번호 재설정, 4=완료
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
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
                // alert(`${response.data.email}로 인증코드를 발송했습니다.`);
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

            setMessage(
                "✅ 인증에 성공했습니다. 새로운 비밀번호를 설정해주세요.",
            );
            setStep(3); // 다음 단계로 이동
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "인증코드 확인 중 오류가 발생했습니다.",
            );
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
            const response = await axiosInstance.post(
                "/member/reset-password/no-login",
                {
                    username,
                    newPassword,
                },
            );

            setMessage(
                response.data?.message ||
                    "비밀번호가 성공적으로 재설정되었습니다.",
            );
            setStep(4); // 완료 단계로 이동
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
                            maxLength="255"
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
                    <Timer duration={180} triggerReset={timerKey} />

                    <button type="submit">확인</button>

                    {message && <p className="reset-message">{message}</p>}
                    <button
                        type="button"
                        className="login-button"
                        onClick={handleGoLogin}
                    >
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
                    <button
                        type="button"
                        className="login-button"
                        onClick={handleGoLogin}
                    >
                        로그인 화면으로 이동
                    </button>
                </form>
            )}

            {/* Step 4: 완료 */}
            {step === 4 && (
                <div className="reset-complete">
                    <h2>완료</h2>
                    <p>{message}</p>
                    <button
                        type="button"
                        className="login-button"
                        onClick={handleGoLogin}
                    >
                        로그인 화면으로 이동
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResetPasswordForm;
