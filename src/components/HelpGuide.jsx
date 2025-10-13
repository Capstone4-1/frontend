import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import "./HelpGuide.css";

const HelpGuide = ({ title = "사용설명서", content }) => {
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
              <h3>{title}</h3>
              <button
                className="help-guide-close"
                onClick={() => setIsOpen(false)}
              >
                <X />
              </button>
            </div>
            <div className="help-guide-body">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpGuide;
