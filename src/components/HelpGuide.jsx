// src/components/HelpGuide.jsx
import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import "./HelpGuide.css";

const HelpGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 작은 회색 ❓ 버튼 */}
      <button className="help-guide-icon" onClick={() => setIsOpen(true)}>
        <HelpCircle size={18} />
      </button>

      {/* 모달 */}
      {isOpen && (
        <div className="help-guide-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="help-guide-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="help-guide-header">
              <h3>사용설명서</h3>
              <button
                className="help-guide-close"
                onClick={() => setIsOpen(false)}
              >
                <X />
              </button>
            </div>
            <div className="help-guide-body">
              <p>환영합니다! 👋</p>
              <p>이 앱의 주요 기능은 다음과 같습니다:</p>
              <ul>
                <li>게시판 확인 및 작성</li>
                <li>친구 추가 및 메시지 전송</li>
                <li>오늘의 식단 확인</li>
                <li>중고책 장터 이용</li>
                <li>학생회 이벤트 확인</li>
              </ul>
              <p>각 기능 아이콘을 클릭하면 더 자세한 설명을 볼 수 있습니다.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpGuide;
