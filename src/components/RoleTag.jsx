// src/components/RoleTag.jsx
import "./RoleTag.css";
import { ROLE_DEFS } from "./utils/RoleUtils";

const RoleTag = ({ role }) => {
  const roleDef = ROLE_DEFS.find((r) => r.key === role);
  if (!roleDef) return null;

  return (
    <span
      className="RoleTag"
      style={{ backgroundColor: roleDef.color }}
      title={roleDef.title}
    >
      {roleDef.tag}
    </span>
  );
};

export default RoleTag;
