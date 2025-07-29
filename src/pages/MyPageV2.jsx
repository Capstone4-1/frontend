import { useContext } from "react";
import Header from "../components/Header";
import MyProfile from "../components/Myprofile";
import { UserContext } from "../components/utils/UserContext";
import "./MyPageV2.css";
import { useNavigate, Outlet } from "react-router-dom";

const MyPageV2 = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return <div className="mypage-loading">유저 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="Mypage">
      <Header title="Mypage" />
      <div className="out-layout">
        <div className="container">
          <aside>
            <div className="proflie-img-box">
              <MyProfile profileImageUrl={user.profileImageUrl} />
              <div>수박게임장인</div>
            </div>

            <div className="menu-box">
              <div>
                <h3>내 활동</h3>
                <ul>
                  <li>이용 제한 내역</li>
                  <li>좋아요 한 게시물</li>
                  <li onClick={() => navigate("posts")}>작성한 글</li>
                  <li onClick={() => navigate("comments")}>작성한 댓글</li>
                </ul>
              </div>

              <div>
                <h3>계정 및 보안</h3>
                <ul>
                  <li onClick={() => navigate("info")}>개인 정보 수정</li>
                  <li>게시판 관리</li>
                  <li>커뮤니티 이용규칙</li>
                  <li onClick={() => navigate("account")}>계정</li>
                </ul>
              </div>
            </div>
          </aside>

          <section className="display-area">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyPageV2;
