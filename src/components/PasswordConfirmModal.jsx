import "./PasswordConfirmModal.css";
import { useState } from "react";
import axiosInstance from "../components/utils/AxiosInstance";

const PasswordConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!password) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsChecking(true);

      const response = await axiosInstance.post("/member/verify-password", {
        password: password,
      });

      if (response.status === 200 && response.data.message === true) {
        onConfirm(password);
        setPassword("");
        setErrorMessage("");
      } else {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("비밀번호 확인 요청 실패:", error);
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleClose = () => {
    onClose();
    setPassword("");
    setErrorMessage("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>비밀번호 재확인</h2>
        <p>안전한 사용을 위해 비밀번호를 다시 입력해주세요.</p>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p style={{ color: "red", marginTop: "8px" }}>{errorMessage}</p>}
        <div className="modal-buttons">
         <button onClick={handleConfirm} disabled={isChecking}>
  확인
</button>

          <button onClick={handleClose} disabled={isChecking}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordConfirmModal;
