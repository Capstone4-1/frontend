import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="Footer">
            <div className="footer-content">
                {/* About */}
                <div className="footer-section">
                    <h4>About Us</h4>
                     <p>
                        인공지능 공학부 커뮤니티입니다.<br />
                        잡담, 질문, 강의 정보 공유, 중고 교재 거래까지 모두 한곳에서 해결하세요!<br />
                    </p>
                </div>

              

                {/* Contact */}
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Email: <a href="mailto:moai37487@gmail.com">moai37487@gmail.com</a></p>
                    <p>Instagram: <a href="https://instagram.com/moai_official" target="_blank" rel="noopener noreferrer">@moai_official</a></p>
                    <Link to="/support" className="footer-support">문의하기</Link>
                </div>
            </div>

            <div className="footer-bottom">
                © 2025 moai_official. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
