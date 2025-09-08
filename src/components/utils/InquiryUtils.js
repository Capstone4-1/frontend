export const InquiryCategories = [
  { value: "ROLE_REQUEST", label: "권한 요청" },
  { value: "ACCOUNT_ISSUE", label: "계정 관련" },
  { value: "GENERAL", label: "기타" },
  { value: "REPORT", label: "신고" },
];

/**
 * Inquiry payload 생성
 * @param {string} title
 * @param {string} content
 * @param {string} category
 * @param {string} targetRole
 */
export const buildInquiryPayload = (title, content, category, targetRole) => {
  return {
    title,
    content,
    category,
    targetRole: category === "ROLE_REQUEST" ? targetRole : null,
  };
};

/**
 * 권한 요청인지 체크
 * @param {string} category
 * @returns {boolean}
 */
export const isRoleRequest = (category) => category === "ROLE_REQUEST";

export const getCategoryLabel = (categoryValue) => {
  const category = InquiryCategories.find((c) => c.value === categoryValue);
  return category ? category.label : "-";
};