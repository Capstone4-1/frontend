// 권한 계층 (낮을수록 권한 낮음, 높을수록 권한 강함)
export const roleHierarchy = ["USER", "STUDENT", "MANAGER", "PROFESSOR", "ADMIN", "SYSTEM"];

// 선택 UI 용
export const ROLE_OPTIONS = [
  { label: "STUDENT", value: "STUDENT" },
  { label: "PROFESSOR", value: "PROFESSOR" },
  { label: "MANAGER", value: "MANAGER" },
  { label: "SYSTEM", value: "SYSTEM" },
  { label: "USER", value: "USER" },
  { label: "ADMIN", value: "ADMIN" },
];

// 한글 타이틀
export const ROLE_TITLES = [
  { label: "STUDENT", value: "학생" },
  { label: "PROFESSOR", value: "교수" },
  { label: "MANAGER", value: "조교" },
  { label: "SYSTEM", value: "시스템" },
  { label: "ADMIN", value: "관리자" },
];

// 빠른 매핑
export const ROLE_TITLES_MAP = {
  STUDENT: "#학생",
  PROFESSOR: "#교수",
  MANAGER: "#조교",
  SYSTEM: "#시스템",
  ADMIN: "#관리자",
};

/**
 * 주어진 roles 배열이 최소 요구 역할 이상인지 체크
 * @param {string[]} roles - 유저의 역할 배열
 * @param {string} requiredRole - 최소 필요 역할
 * @returns {boolean}
 */
export const hasMinimumRole = (roles, requiredRole) => {
  if (!roles || roles.length === 0) return false;
  const requiredIndex = roleHierarchy.indexOf(requiredRole);
  if (requiredIndex === -1) return false;

  return roles.some(role => roleHierarchy.indexOf(role) >= requiredIndex);
};
