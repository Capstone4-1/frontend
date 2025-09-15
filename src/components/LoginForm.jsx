import "./LoginForm.css";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./utils/AxiosInstance";
import { UserContext } from "./utils/UserContext";
import { toast } from "sonner";
const LoginForm = ({ setIsAuthenticated }) => {

    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(
                "/member/login",
                formData
            );
            if (response.status === 200) {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem(
                    "refreshToken",
                    response.data.refreshToken
                );
                setAuthData();
                setIsAuthenticated(true);

                const meRes = await axiosInstance.get("/member/me");
                setUser(meRes.data.meDto);
                navigate("/main");
            }
        } catch (error) {
            toast.error("아이디 또는 비밀번호가 잘못되었습니다.")
        }
    };
    const setAuthData = () => {
        try {
            const token = localStorage.getItem("accessToken");
        } catch (error) {
            console.error("토큰 디코딩 오류:", error);
        }
    };

    return (
        <div className="LoginForm">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="username"></label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="학번"
                    />
                </div>
                <div className="form-group">
                    <label className="password"></label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="비밀번호"
                    />
                </div>

                <button type="submit">로그인</button>
            </form>
            <div className="link-container">
                <Link className="link-button" to={"/login/register?mode=register"}>
                    회원가입
                </Link>
                <div className="delim">|</div>
                <Link className="link-button" to={"/login/register?mode=reset"}>
                    비밀번호 찾기
                </Link>
            </div>
            <div></div>
        </div>
    );
};

export default LoginForm;
