import { toast } from "sonner";
import "./RegisterForm.css";
import Timer from "./Timer";
import axiosInstance from "./utils/AxiosInstance";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        nickname: "",
        name: "",
    });

    const [step, setStep] = useState("form"); // form, loading, verify
    const [verificationCode, setVerificationCode] = useState("");
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [nicknameError, setNicknameError] = useState("");
    const [codeError, setCodeError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timerKey, setTimerKey] = useState(0);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        // 에러 초기화
        if (e.target.name === "email") setEmailError("");
        if (e.target.name === "username") setUsernameError("");
        if (e.target.name === "nickname") setNicknameError("");
        if (e.target.name === "verificationCode") setCodeError("");
    };

    const startTimer = () => {
        setTimerKey(prev => prev + 1);
    };

    // 1️⃣ 중복 체크 + 이메일 인증
    const handleSubmit = async (e) => {
        e.preventDefault();

        setEmailError("");
        setUsernameError("");
        setNicknameError("");
        setLoading(true);
        setStep("loading");

        try {
            // 서버에서 한 번에 중복 체크 + 이메일 인증 발송
            await axiosInstance.post("/auth/check-duplicate", {
                username: formData.username,
                email: formData.email,
                nickname: formData.nickname,
            });

            // 중복 없으면 이메일 인증 단계
            setStep("verify");
            startTimer();

        } catch (error) {
            console.error("중복 또는 인증 실패:", error);

            const errors = error.response?.data?.errors;
            if (errors && Array.isArray(errors)) {
                errors.forEach(err => {
                    switch (err.field) {
                        case "username":
                            setUsernameError(err.message);
                            break;
                        case "email":
                            setEmailError(err.message);
                            break;
                        case "nickname":
                            setNicknameError(err.message);
                            break;
                        default:
                            console.warn("Unknown error field:", err.field);
                    }
                });
            } else {
                // 혹시 배열이 없으면 fallback
                const message = error.response?.data?.message || "오류가 발생했습니다.";
                toast.error(message);
            }

            setStep("form");
        } finally {
            setLoading(false);
        }
    };

    // 2️⃣ 인증 코드 확인 + 회원가입
    const handleVerify = async () => {
        setCodeError("");
        try {
            await axiosInstance.post("/auth/verify-code", {
                email: formData.email,
                code: verificationCode,
            });

            await axiosInstance.post("/member/join", formData);
            toast.success("회원가입 성공!");
            navigate("/login");

        } catch (error) {
            const status = error.response?.status;
            if (status === 400 || status === 403) {
                setCodeError(error.response.data.message || "인증번호가 올바르지 않습니다.");
            } else {
                toast.error(error.response?.data?.message || "인증 실패");
            }
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setEmailError("");
        setCodeError("");
        try {
            await axiosInstance.post("/auth/email-check", {
                email: formData.email,
            });
            toast.success("인증 코드가 다시 발송되었습니다.");
            startTimer();
        } catch (error) {
            toast.error(error.response?.data?.message || "인증 코드 재전송 실패");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="RegisterForm">
            {step === "form" && (
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>ID:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="학번"
                            disabled={loading}
                        />
                        {usernameError && <p className="error-message">{usernameError}</p>}
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="비밀번호"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="이메일"
                            disabled={loading}
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                    </div>

                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="이름"
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Nickname:</label>
                        <input
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            required
                            placeholder="닉네임"
                            disabled={loading}
                        />
                        {nicknameError && <p className="error-message">{nicknameError}</p>}
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "로딩중..." : "제출"}
                    </button>
                </form>
            )}

            {step === "loading" && (
                <div className="loading-container" style={{ textAlign: "center", marginTop: 40 }}>
                    <ClipLoader color="#36d7b7" size={50} />
                    <p>인증 메일을 보내는 중입니다...</p>
                </div>
            )}

            {step === "verify" && (
                <div className="verify-container">
                    <p>
                        {formData.email} 주소로 인증 코드를 보냈습니다.
                        <br />
                        아래에 인증 코드를 입력해주세요.
                    </p>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => {
                            setVerificationCode(e.target.value);
                            setCodeError("");
                        }}
                        placeholder="인증 코드 입력"
                    />
                    {codeError && <p className="error-message">{codeError}</p>}

                    <Timer duration={300} triggerReset={timerKey} />

                    <div className="button-group">
                        <button onClick={handleVerify} disabled={loading}>
                            확인
                        </button>
                        <button
                            onClick={handleResend}
                            disabled={resendLoading}
                            style={{ marginLeft: "10px" }}
                        >
                            {resendLoading ? "재전송 중..." : "인증 코드 재전송"}
                        </button>
                    </div>
                </div>
            )}

            <Link className="link-button" to={"/login"}>
                로그인 화면으로
            </Link>
        </div>
    );
};

export default RegisterForm;
