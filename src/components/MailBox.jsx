import "./MailBox.css"

import { MessagesSquare } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ← 추가
import Reddot from "./Reddot";

const MailBox = ({newMailCount}) => {
    const navigate = useNavigate(); // ← 훅 호출

    const handleClick = () => {
        navigate("/chat-mail"); // ← 이동할 경로
    };

    return (
        <div className="MailBox">
            <button className="mail-btn header-btn" onClick={handleClick}>
                <MessagesSquare />
                <Reddot count={newMailCount} />
            </button>
        </div>
    );
};

export default MailBox;
