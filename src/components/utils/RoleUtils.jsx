

export const ROLE_OPTIONS = [
  { label: "STUDENT", value: "STUDENT" },
  { label: "PROFESSOR", value: "PROFESSOR" },
  { label: "MANAGER", value: "MANAGER" },
  { label: "SYSTEM", value: "SYSTEM" },
  { label: "USER", value: "USER" },
  { label: "ADMIN", value: "ADMIN" },
];


export const ROLE_TITLES = [
  { label: "STUDENT", value: "학생" },
  { label: "PROFESSOR", value: "교수" },
  { label: "MANAGER", value: "조교" },
  { label: "SYSTEM", value: "SYSTEM" },
  { label: "ADMIN", value: "관리자" },
];

export const ROLE_TITLES_MAP = {
  STUDENT: "#학생",
  PROFESSOR: "#교수",
  MANAGER: "#조교",
  SYSTEM: "#시스템",
  ADMIN: "#관리자",
};

export const roleHierarchy = ["USER", "STUDENT", "PROFESSOR", "MANAGER", "ADMIN"];