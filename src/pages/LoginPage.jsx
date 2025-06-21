import LoginForm from "../components/LoginForm";
import "./AuthPage.css";
import IntroBox from "../components/IntroBox";

const LoginPage = ({ setIsAuthenticated }) => {
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
                    <LoginForm setIsAuthenticated={setIsAuthenticated} />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
