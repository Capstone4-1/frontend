import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import NaviBar from "../components/NaviBar";
import MarketBox from "../components/board-box/MarketBox";
import LectureCategoryBox from "../components/board-box/LectureCategoryBox";
import BasicBoardBox from "../components/board-box/BasicBoardBox";
import PostDetail from "../components/post/PostDetail";
import MarketUploadModal from "../components/board-box/MarketUploadModal";
import "./BoardPage.css";

const BoardPage = () => {
  const { boardType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isPostDetail = location.pathname.includes("/post/");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const renderBoard = () => {
    switch (boardType) {
      case "free":
      case "notice_c":
      case "notice":
      case "secret":
      case "review":
        return <BasicBoardBox boardType={boardType} handleWriteClick = {handleWriteClick} />;
      case "market":
        return <MarketBox boardType={boardType} setShowUploadModal={setShowUploadModal}/>;
      case "popular":
        return <div>인기게시판 컴포넌트</div>;
      default:
        return <div>존재하지 않는 게시판입니다.</div>;
    }
  };

  const handleWriteClick = () => {
    navigate(`/write/${boardType}`);
  };


  return (
    <div className="BoardPage">
      <div className="header-with-button">
        <Header title={"게시판"} />
      </div>

      <div className="layout-container">
        <div className="content-container">
          <div className="navibar-container">
            <NaviBar currentBoard={boardType} />
          </div>

          <div className="board-container">
            {isPostDetail ? <PostDetail /> : renderBoard()}
          </div>
        </div>
      </div>

      {/* 모달 렌더링 */}
      {showUploadModal && (
        <MarketUploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
};

export default BoardPage;
