import RegisterForm from "../components/RegisterForm";
import IntroBox from "../components/IntroBox";
import "./AuthPage.css";
const RegisterPage = () => {
    console.log("RegisterPage Loaded");
    console.log("logo path:", document.querySelector(".logo-img")?.src);
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
                    <RegisterForm/>
                </div>
            </div>
        </div>


    );
};

export default RegisterPage;
