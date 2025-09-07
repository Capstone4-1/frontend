import IntroBox from "../components/IntroBox";
import RegisterForm from "../components/RegisterForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { Link, useSearchParams } from "react-router-dom";

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
                    <Link to="/login">
                        <img
                            className="logo-img"
                            src="/icons/logo.svg"
                            alt="logo_img"
                        />
                    </Link>
                    {mode === "register" ? (
                        <RegisterForm />
                    ) : (
                        <ResetPasswordForm />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
