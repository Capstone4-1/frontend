import React from "react";
import "./ConfirmModal.css"; // 원하는 스타일 적용

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="Modal ConfirmModal">
            <div className="Overlay">
                <div className="container">
                    <p className="confirm-message">{message}</p>
                    <div className="confirm-buttons">
                        <button className="confirm-btn yes" onClick={onConfirm}>
                            확인
                        </button>
                        <button className="confirm-btn no" onClick={onCancel}>
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
