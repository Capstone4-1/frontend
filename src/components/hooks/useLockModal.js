import { useState } from "react";

export const useLockModal = () => {
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);

    const openLockModal = () => {
        setIsLockModalOpen(true);
    };

    const closeLockModal = () => {
        setIsLockModalOpen(false);
    };

    const handleLockedItemClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLockModal();
    };

    return {
        isLockModalOpen,
        openLockModal,
        closeLockModal,
        handleLockedItemClick,
    };
};
