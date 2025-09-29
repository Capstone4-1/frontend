import { X } from "lucide-react";
import "./Exit.css"
const Exit = ({ onClose }) => {
    return (
        <button
            className="Exit"
            onClick={onClose}
        >
            <X />
        </button>
    );
};

export default Exit;