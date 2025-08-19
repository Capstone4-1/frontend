import { useContext, useState } from "react";
import Header from "../components/Header";
import MyProfile from "../components/Myprofile";
import { UserContext } from "../components/utils/UserContext";
import "./MyPageV2.css";
import { useNavigate, Outlet } from "react-router-dom";
import PasswordConfirmModal from "../components/modals/PasswordConfirmModal";

const MyPageV2 = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);
  const [pendingRouteFocus, setPendingRouteFocus] = useState(null);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  if (!user) {
    return (
      <div className="mypage-loading">
        유저 정보를 불러오는 중입니다...
      </div>
    );
  }

  const handleSecureNavigate = (route, focusSection = null) => {
    if (isPasswordVerified) {
      if (route === "account" && focusSection) {
        navigate(route, { state: { focusSection } });
      } else {
        navigate(route);
      }
    } else {
      setPendingRoute(route);
      setPendingRouteFocus(focusSection);
      setIsPasswordModalOpen(true);
    }
  };

  return (
    <div className="Mypage">
      <Header />
      <div className="out-layout">
        <div className="container">
          <aside>
            <div className="profile-img-box">
              <MyProfile profileImageUrl={user.profileImageUrl} />
              <div>{user.nickname}</div>
            </div>

            <div className="menu-box">
              <div>
                <h3>내 활동</h3>
                <ul>
                  <li
                    onClick={() =>
                      navigate("activity", {
                        state: { focusSection: "comments" },
                      })
                    }
                  >
                    작성한 댓글
                  </li>

                  <li
                    onClick={() =>
                      navigate("activity", {
                        state: { focusSection: "posts" },
                      })
                    }
                  >
                    작성한 글
                  </li>

                  <li
                    onClick={() =>
                      navigate("activity", {
                        state: { focusSection: "favorites" },
                      })
                    }
                  >
                    좋아요 한 게시물
                  </li>

                  <li>이용 제한 내역</li>
                </ul>
              </div>

              <div style={{ marginTop: "20px" }}>
                <h3>계정 및 보안</h3>
                <ul>
                  {/* 개인정보 수정 클릭 시 account 컴포넌트로 가면서 focus info */}
                  <li onClick={() => handleSecureNavigate("account", "info")}>
                    개인 정보 수정
                  </li>
                  <li>커뮤니티 이용규칙</li>
                  {/* 계정 클릭 시 account 컴포넌트로 가면서 focus security */}
                  <li onClick={() => handleSecureNavigate("account", "security")}>
                    계정
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          <section className="display-area">
            <Outlet />
          </section>
        </div>

        <PasswordConfirmModal
          isOpen={isPasswordModalOpen}
          onClose={() => {
            setIsPasswordModalOpen(false);
            setPendingRoute(null);
            setPendingRouteFocus(null);
          }}
          onConfirm={() => {
            setIsPasswordModalOpen(false);
            setIsPasswordVerified(true);
            if (pendingRoute) {
              if (pendingRoute === "account" && pendingRouteFocus) {
                navigate(pendingRoute, {
                  state: { focusSection: pendingRouteFocus },
                });
              } else {
                navigate(pendingRoute);
              }
              setPendingRoute(null);
              setPendingRouteFocus(null);
            }
          }}
        />
      </div>
    </div>
  );
};

export default MyPageV2;
