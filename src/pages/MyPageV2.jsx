import { useContext, useState, useCallback } from "react";
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

  // 비밀번호 확인이 필요한 라우트만 여기에 등록
  const secureRoutes = new Set(["account"]);

  // 모든 포커스/이동을 이 함수 하나로 처리
  const handleSecureNavigate = useCallback(
    (route, focusSection = null) => {
      const requiresPassword = secureRoutes.has(route);

      if (!requiresPassword) {
        // 비번 확인 필요 없음
        if (focusSection) navigate(route, { state: { focusSection } });
        else navigate(route);
        return;
      }

      // 비번 확인 필요
      if (isPasswordVerified) {
        if (focusSection) navigate(route, { state: { focusSection } });
        else navigate(route);
      } else {
        setPendingRoute(route);
        setPendingRouteFocus(focusSection);
        setIsPasswordModalOpen(true);
      }
    },
    [isPasswordVerified, navigate]
  );

  // 키보드 접근성(Enter/Space)
  const onKeyActivate = (e, fn) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div className="Mypage">
      <div className="out-layout">
        <div className="container">
          <aside>
            <div className="profile-img-box">
              <MyProfile profileImageUrl={user.profileImageUrl} />
              <div>{user.nickname}</div>
              <div className="intro-text">
      {user.intro ?? user.introduction ?? "아직 자기소개가 없습니다."}
    </div>

            </div>


            <div className="menu-box">
              <div>
                <h3>내 활동</h3>
                <ul>
                  <li
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSecureNavigate("activity", "comments")}
                    onKeyDown={(e) =>
                      onKeyActivate(e, () =>
                        handleSecureNavigate("activity", "comments")
                      )

                    }
                  >
                    작성한 댓글
                  </li>

                  <li
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSecureNavigate("activity", "posts")}
                    onKeyDown={(e) =>
                      onKeyActivate(e, () =>
                        handleSecureNavigate("activity", "posts")
                      )

                    }
                  >
                    작성한 글
                  </li>

                  <li
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSecureNavigate("activity", "favorites")}
                    onKeyDown={(e) =>
                      onKeyActivate(e, () =>
                        handleSecureNavigate("activity", "favorites")
                      )

                    }
                  >
                    좋아요 한 게시물
                  </li>

                  <li
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSecureNavigate("activity", "scraps")}
                    onKeyDown={(e) =>
                      onKeyActivate(e, () =>
                        handleSecureNavigate("activity", "scraps")
                      )
                    }
                  >
                    스크랩 한 게시물
                  </li>
            
                </ul>
              </div>

              <div style={{ marginTop: "20px" }}>
                <h3>계정 및 보안</h3>
                <ul>
                  {/* 개인정보 수정: account/info 포커스 */}
                  <li
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSecureNavigate("account", "info")}
                    onKeyDown={(e) =>
                      onKeyActivate(e, () =>
                        handleSecureNavigate("account", "info")
                      )
                    }
                  >
                    개인 정보 수정
                  </li>

                  <li
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSecureNavigate("account", "inquiry")}
                    onKeyDown={(e) =>
                      onKeyActivate(e, () =>
                        handleSecureNavigate("account", "inquiry")
                      )
                    }
                  >
                    문의내역
                  </li>

                  <li
  role="button"
  tabIndex={0}
  onClick={() => handleSecureNavigate("account", "delete")}
  onKeyDown={(e) =>
    onKeyActivate(e, () =>
      handleSecureNavigate("account", "delete")
    )
  }
  aria-label="회원 탈퇴로 이동"
>
  회원탈퇴
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
              if (pendingRouteFocus) {
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
