import "./Panel.css";
import Favorites from "./Favorites";
import Friends from "./Friends";
import { Link , useNavigate} from "react-router-dom";
import axiosInstance from "./utils/AxiosInstance";
import handleApiError from "./utils/handleApiError";

const Panel = ({ username }) => {
    const navigate = useNavigate(); 
    const adminButtonHandler = async () => {
        try {
            const response = await axiosInstance.get("/api/member/admin-test");
            alert(`관리자 전용 요청 성공: ${response.data.message}`);
        } catch (error) {
            console.log(error);
            handleApiError(error, navigate);    // 에러 처리 함수 호출
        }
    };

    return (
        <div className="Panel">
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <button className="profile-btn"></button>
                <Link className="link-mypage" to={"/mypage"}>{username}</Link>
            </div>

            <Favorites />
            <hr />
            <Friends />
            <hr />
            <div>캘린더</div>
            <button onClick={adminButtonHandler}>관리자만 가능한 버튼</button>
        </div>
    );
};

export default Panel;
