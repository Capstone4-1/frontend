// 권한 계층 (낮을수록 권한 낮음, 높을수록 권한 강함)
export const roleHierarchy = [
  "USER",
  "STUDENT",
  "PROFESSOR",
  "STUDENT_COUNCIL", // 학생회 추가
  "MANAGER",
  "ADMIN",
  "SYSTEM",
];

// 선택 UI 용
export const ROLE_OPTIONS = [
  { label: "USER", value: "USER" },
  { label: "STUDENT", value: "STUDENT" },
  { label: "PROFESSOR", value: "PROFESSOR" },
  { label: "STUDENT_COUNCIL", value: "STUDENT_COUNCIL" }, 
  { label: "MANAGER", value: "MANAGER" },  // 여기 고침
  { label: "ADMIN", value: "ADMIN" }, 
  { label: "SYSTEM", value: "SYSTEM" }, 
];

// 한글 타이틀
export const ROLE_TITLES = [
  { value: "STUDENT", label: "학생" },
  { value: "PROFESSOR", label: "교수" },
  { value: "STUDENT_COUNCIL", label: "학생회" }, 
  { value: "MANAGER", label: "조교" },
  { value: "ADMIN", label: "관리자" },
  { value: "SYSTEM", label: "시스템" },
];

// 빠른 매핑
export const ROLE_TITLES_MAP = {
  STUDENT: "#학생",
  PROFESSOR: "#교수",
  STUDENT_COUNCIL: "#학생회", // 학생회 추가
  MANAGER: "#조교",
  ADMIN: "#관리자",
  SYSTEM: "#시스템",
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
