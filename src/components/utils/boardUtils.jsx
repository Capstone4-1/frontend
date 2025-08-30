
// 게시판 라벨 맵 (네비게이션 바 등에서 사용)
export const boardTypeMap = {
  NOTICE: "조교알림",
  NOTICE_UNIV: "학교공지",
  NOTICE_DEPT: "학과공지",
  FREE: "자유게시판",
  SECRET: "비밀게시판",
  REVIEW: "후기",
  MARKET: "책장터",
};

// 게시판 설정 배열 (페이지, 태그, 색상 등 한눈에 보기)
export const boardConfig = [
  {
    type: "NOTICE",
    label: "조교알림",
    tagLabel: "조교",
    color: "#ff9800",
  },
  {
    type: "NOTICE_UNIV",
    label: "학교공지",
    tagLabel: "학교공지",
    color: "#f44336",
  },
  {
    type: "NOTICE_DEPT",
    label: "학과공지",
    tagLabel: "학과공지",
    color: "#e869a2ff",
  },
  {
    type: "FREE",
    label: "자유게시판",
    tagLabel: "자유",
    color: "#4caf50",
  },
  {
    type: "SECRET",
    label: "비밀게시판",
    tagLabel: "비밀",
    color: "#9c27b0",
  },
  {
    type: "REVIEW",
    label: "후기",
    tagLabel: "후기",
    color: "#2196f3",
  },
  {
    type: "MARKET",
    label: "책장터",
    tagLabel: "장터",
    color: "#795548",
  },
];

// PostTag 등에서 사용하는 스타일 맵
export const tagStyles = boardConfig.reduce((acc, board) => {
  acc[board.type] = { label: board.tagLabel, color: board.color };
  return acc;
}, {});

// 타입으로 게시판 라벨 가져오기 (없으면 "게시판" 반환)
export const getBoardLabel = (type = "") => {
  return boardTypeMap[type.toUpperCase()] || "게시판";
};

// 게시판 타입 리스트
export const boardTypeList = Object.keys(boardTypeMap);
