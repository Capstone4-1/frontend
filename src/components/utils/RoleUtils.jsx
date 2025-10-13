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


export const ROLE_DEFS = [
  { 
    key: "USER", 
    value: "USER", 
    title: "회원", 
    tag: "#회원", 
    color: "#9e9e9e" // 회색
  },
  { 
    key: "STUDENT", 
    value: "STUDENT", 
    title: "학생", 
    tag: "#학생", 
    color: "#64b5f6" // 톤 다운된 파랑
  },
  { 
    key: "PROFESSOR", 
    value: "PROFESSOR", 
    title: "교수", 
    tag: "#교수", 
    color: "#81c784" // 톤 다운된 초록
  },
  { 
    key: "STUDENT_COUNCIL", 
    value: "STUDENT_COUNCIL", 
    title: "학생회", 
    tag: "#학생회", 
    color: "#9575cd" // 보라
  },
  { 
    key: "MANAGER", 
    value: "MANAGER", 
    title: "조교", 
    tag: "#조교", 
    color: "#ffb74d" // 주황
  },
  { 
    key: "ADMIN", 
    value: "ADMIN", 
    title: "관리자", 
    tag: "#관리자", 
    color: "#e57373" // 톤 다운된 빨강
  },
  { 
    key: "SYSTEM", 
    value: "SYSTEM", 
    title: "시스템", 
    tag: "#시스템", 
    color: "#616161" // 진한 회색
  },
];


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
