// DailyMenu.jsx
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DailyMenu.css";
import axiosInstance from "./utils/AxiosInstance"; // 경로 확인

/** yyyy-MM-dd */
const fmt = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
};

const STUDENT_LABEL = {
  SET_MENU: "정식",
  WESTERN: "양식",
  SNACK: "분식",
  RAMEN: "라면",
};
const STAFF_LABEL = { BREAKFAST: "조식", LUNCH: "중식", DINNER: "석식" };
const ALL_CORNERS = ["SET_MENU", "WESTERN", "SNACK", "RAMEN"];

export default function DailyMenu() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState("학생식당"); // "학생식당" | "교직원식당"
  const [studentCorner, setStudentCorner] = useState(null);   // 코너 미선택 허용
  const [staffMeal, setStaffMeal] = useState(null);           // "BREAKFAST"|"LUNCH"|"DINNER"|null
  const [menuWeek, setMenuWeek] = useState([]);               // [{date, studentCafeteria, staffCafeteria}]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dateStr = useMemo(() => fmt(selectedDate), [selectedDate]);

  /** GET /api/Menu/{YYYY}/{MM}/{DD} (0패딩 필요) */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const y = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const dd = String(selectedDate.getDate()).padStart(2, "0");

        const res = await axiosInstance.get(`/Menu/${y}/${mm}/${dd}`);
        // 응답: { message, data: { date, studentCafeteria, staffCafeteria } }
        const payload = res?.data?.data ?? res?.data ?? {};
        const one = {
          date: payload?.date ?? fmt(selectedDate),
          studentCafeteria: payload?.studentCafeteria || {},
          staffCafeteria: payload?.staffCafeteria || {},
        };
        setMenuWeek([one]); // 하루치 → 배열 래핑
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "데이터 로딩 실패");
        setMenuWeek([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedDate]);

  /** 오늘 데이터 */
  const daily = useMemo(
    () => menuWeek.find((it) => it.date === dateStr) || menuWeek[0] || null,
    [menuWeek, dateStr]
  );

  /** 가용한 학생 코너/직원 끼니 */
  const availableCorners = useMemo(
    () => new Set(Object.keys(daily?.studentCafeteria || {})),
    [daily]
  );

  const staffMealKeys = useMemo(() => {
    const s = daily?.staffCafeteria || {};
    const order = ["BREAKFAST", "LUNCH", "DINNER"];
    return order.filter((k) => Array.isArray(s[k]) && s[k].length > 0);
  }, [daily]);

  /** 선택값 보정: 날짜 바뀌면 없는 값은 null */
  useEffect(() => {
    if (studentCorner && !availableCorners.has(studentCorner)) setStudentCorner(null);
  }, [availableCorners, studentCorner]);

  useEffect(() => {
    if (staffMeal && !staffMealKeys.includes(staffMeal)) setStaffMeal(null);
  }, [staffMealKeys, staffMeal]);

  /** 렌더용 아이템 */
  const menuItems = useMemo(() => {
    if (!daily) return [];
    if (selectedTab === "학생식당") {
      if (!studentCorner) return [];
      return daily.studentCafeteria?.[studentCorner] ?? [];
    } else {
      if (!staffMeal) return [];
      return daily.staffCafeteria?.[staffMeal] ?? [];
    }
  }, [daily, selectedTab, studentCorner, staffMeal]);

  const formattedDate = useMemo(
    () =>
      selectedDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }),
    [selectedDate]
  );

  return (
    <div className="DailyMenu">
      {/* 달력 */}
      <div className="card calendar-container fade-in">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          formatDay={(locale, date) => date.getDate()}
          locale="ko-KR"
          next2Label={null}
          prev2Label={null}
        />
      </div>

      {/* 메뉴 카드 */}
      <div className="card menu-container fade-in">
        <div className="menu-header">
          <h2 className="menu-title">
            {formattedDate} <span className="divider">•</span> {selectedTab}
          </h2>
        </div>

        {/* 상단 탭 */}
        <div className="tab-buttons" role="tablist" aria-label="식당 선택">
          {["학생식당", "교직원식당"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tab-btn ${selectedTab === tab ? "active" : ""}`}
              onClick={() => {
                setSelectedTab(tab);
                if (tab === "교직원식당") {
                  setStudentCorner(null);
                } else {
                  setStaffMeal(null);
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 학생식당 코너 선택 */}
        {selectedTab === "학생식당" && (
          <>
            <div className="subtab-buttons" role="tablist" aria-label="코너 선택">
              {ALL_CORNERS.map((k) => {
                const hasData = availableCorners.has(k);
                return (
                  <button
                    key={k}
                    type="button"
                    className={`chip ${studentCorner === k ? "active" : ""}`}
                    onClick={() => hasData && setStudentCorner(k)}
                    disabled={!hasData}
                  >
                    {STUDENT_LABEL[k] || k}
                  </button>
                );
              })}
            </div>

            {/* ✅ 구분선 */}
            <div className="menu-section-divider"></div>
          </>
        )}

        {/* 교직원식당 끼니 선택 */}
        {selectedTab === "교직원식당" && (
          <>
            <div className="subtab-buttons" role="tablist" aria-label="끼니 선택">
              {["BREAKFAST", "LUNCH", "DINNER"].map((k) => {
                const hasData = staffMealKeys.includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    className={`chip ${staffMeal === k ? "active" : ""}`}
                    onClick={() => hasData && setStaffMeal(k)}
                    disabled={!hasData}
                  >
                    {STAFF_LABEL[k] || k}
                  </button>
                );
              })}
            </div>

            {/* ✅ 구분선 */}
            <div className="menu-section-divider"></div>
          </>
        )}


        {/* 내용 */}
        {loading ? (
          <div className="empty muted">불러오는 중...</div>
        ) : error ? (
          <div className="empty error">데이터 로딩 실패: {error}</div>
        ) : !daily ? (
          <div className="empty muted">해당 날짜의 식단이 없습니다</div>
        ) : selectedTab === "학생식당" ? (
          !studentCorner ? (
            <div className="empty muted">옵션을 선택해주세요</div>
          ) : (
            <ul className="menu-list">
              {(menuItems.length ? menuItems : ["(미운영)"]).map((item, idx) => (
                <li className="menu-item" key={idx}>
                  <span className="bullet" aria-hidden>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )
        ) : !staffMeal ? (
          <div className="empty muted">옵션을 선택해주세요</div>
        ) : (
          <ul className="menu-list">
            {(menuItems.length ? menuItems : ["(미운영)"]).map((item, idx) => (
              <li className="menu-item" key={idx}>
                <span className="bullet" aria-hidden>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
