import { useSearchParams } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import IntroBox from "../components/IntroBox";
import ResetPasswordForm from "../components/ResetPasswordForm";

const RegisterPage = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode") || "register"; // 기본은 회원가입

    return (
        <div className="auth-page">
            <div className="left-side">
                <IntroBox />
            </div>
            <div className="right-side">
                <div className="form-container">
                    <img
                        className="logo-img"
                        src="/icons/logo.svg"
                        alt="logo_img"
                    />
                    {mode === "register" ? <RegisterForm /> : <ResetPasswordForm />}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
