import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        //todo 나중에 수정
        <div className="Footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>About Us</h4>
                    <p>인공지능 공학부 위한 커뮤니티입니다.<br/>중고 교재 거래, 강의 정보 공유 등 다양한 정보를 나눠보세요.</p>
                </div>
                <div className="footer-section">
                    <h4>Links</h4>
                    <ul>
                        <li><a href="/main/community/notice">공지사항</a></li>
                        <li><a href="/main/community/market">책장터</a></li>
                        <li><a href="/main/community/lecture">강의게시판</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Email: support@moai.kr</p>
                    <p>Instagram: @moai_official</p>
                    <Link to="/support">문의하기</Link>
                </div>
            </div>
            <div className="footer-bottom">
                © 2025 moai_official. All rights reserved.
            </div>
        </div>
    );
};

export default Footer;
