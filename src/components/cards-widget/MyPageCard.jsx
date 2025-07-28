import { useNavigate } from "react-router-dom";
import "./MyPageCard.css";
import { UserContext } from "../utils/UserContext";
import { useContext } from "react";

const MyPageCard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useContext(UserContext);

  const goToMyPage = () => {
    navigate("/mypage");
  };

  if (isLoading) {
    // 로딩 중일 때
    return (
      <div className="MyPageCard">
        <div className="profile-placeholder"></div>
        <div>
          <h4>로딩 중...</h4>
        </div>
      </div>
    );
  }

  if (!user) {
    // user가 null일 때 (예: 로그인 안됨)
    return (
      <div className="MyPageCard" onClick={goToMyPage}>
        <div className="profile-placeholder"></div>
        <div>
          <h4>게스트</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="MyPageCard" onClick={goToMyPage}>
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt="프로필"
          className="profile-img"
        />
      ) : (
        <div className="profile-placeholder"></div>
      )}
      <div>
        <h4>{user.nickname}</h4>
      </div>
    </div>
  );
};

export default MyPageCard;
