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
        name: "",
    });

    const [step, setStep] = useState("form"); // form, loading, verify
    const [verificationCode, setVerificationCode] = useState("");
    const [emailError, setEmailError] = useState("");
    const [codeError, setCodeError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const [timerKey, setTimerKey] = useState(0);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        if (e.target.name === "email") setEmailError("");
        if (e.target.name === "verificationCode") setCodeError("");
    };

    // 타이머 시작은 timerKey 증가로 처리
    const startTimer = () => {
        setTimerKey((prev) => prev + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError("");
        setLoading(true);
        setStep("loading");

        try {
            await axiosInstance.post("/auth/email-check", {
                email: formData.email,
            });
            setStep("verify");
            startTimer();
        } catch (error) {
            console.error("인증 메일 발송 실패:", error);
            if (error.response?.status === 400) {
                setEmailError(
                    error.response.data.message || "이미 가입된 이메일입니다.",
                );
                setStep("form");
            } else {
                alert(error.response?.data?.message || "인증 메일 발송 실패");
                setStep("form");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setCodeError("");
        try {
            await axiosInstance.post("/auth/verify-code", {
                email: formData.email,
                code: verificationCode,
            });
            const response = await axiosInstance.post("/member/join", formData);
            alert("회원가입 성공!");
            navigate("/login");
        } catch (error) {
            console.error("인증 실패:", error);
            if (
                error.response?.status === 400 ||
                error.response?.status === 403
            ) {
                setCodeError(
                    error.response.data.message ||
                        "인증번호가 올바르지 않습니다.",
                );
            } else {
                alert(error.response?.data?.message || "인증 실패");
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
            alert("인증 코드가 다시 발송되었습니다.");
            startTimer();
        } catch (error) {
            console.error("재전송 실패:", error);
            alert(error.response?.data?.message || "인증 코드 재전송 실패");
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
                            type="string"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="학번"
                            disabled={loading}
                        />
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
                        {emailError && (
                            <p className="error-message">{emailError}</p>
                        )}
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

                    <button type="submit" disabled={loading}>
                        {loading ? "로딩중..." : "제출"}
                    </button>
                </form>
            )}

            {step === "loading" && (
                <div
                    className="loading-container"
                    style={{ textAlign: "center", marginTop: 40 }}
                >
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
                            {resendLoading
                                ? "재전송 중..."
                                : "인증 코드 재전송"}
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
