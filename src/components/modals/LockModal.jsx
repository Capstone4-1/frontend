import "./LockModal.css";

const LockModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="lock-modal-overlay">
            <div className="lock-modal-content">
                <div className="lock-modal-icon">🔒</div>
                <h3 className="lock-modal-title">추후 제공 예정입니다</h3>
                <p className="lock-modal-text">
                    해당 기능은 현재 개발 중입니다.
                    <br />
                    조금만 기다려주세요!
                </p>
                <button onClick={onClose} className="lock-modal-button">
                    확인
                </button>
            </div>
        </div>
    );
};

export default LockModal;
