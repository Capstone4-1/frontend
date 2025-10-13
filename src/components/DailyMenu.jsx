import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./DailyMenu.css";
import axiosInstance from "./utils/AxiosInstance";

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
  const [selectedTab, setSelectedTab] = useState("학생식당");
  const [studentCorner, setStudentCorner] = useState("SET_MENU"); // 기본값 정식
  const [staffMeal, setStaffMeal] = useState(null);
  const [menuWeek, setMenuWeek] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dateStr = useMemo(() => fmt(selectedDate), [selectedDate]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const y = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const dd = String(selectedDate.getDate()).padStart(2, "0");

        const res = await axiosInstance.get(`/Menu/${y}/${mm}/${dd}`);
        const payload = res?.data?.data ?? res?.data ?? {};

        const one = {
          date: payload?.date ?? fmt(selectedDate),
          studentCafeteria: payload?.studentCafeteria || {},
          staffCafeteria: payload?.staffCafeteria || {},
        };

        // 데이터가 아예 없으면 fallback
        if (
          Object.keys(one.studentCafeteria).length === 0 &&
          Object.keys(one.staffCafeteria).length === 0
        ) {
          setMenuWeek([
            {
              date: fmt(selectedDate),
              studentCafeteria: {
                SET_MENU: ["식단 정보가 없습니다"],
              },
              staffCafeteria: {},
            },
          ]);
          setSelectedTab("학생식당");
          setStudentCorner("SET_MENU");
        } else {
          setMenuWeek([one]);
        }
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "데이터 로딩 실패");
        setMenuWeek([
          {
            date: fmt(selectedDate),
            studentCafeteria: {
              SET_MENU: ["식단 정보가 없습니다"],
            },
            staffCafeteria: {},
          },
        ]);
        setSelectedTab("학생식당");
        setStudentCorner("SET_MENU");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedDate]);

  const daily = useMemo(
    () => menuWeek.find((it) => it.date === dateStr) || menuWeek[0] || null,
    [menuWeek, dateStr]
  );

  const availableCorners = useMemo(
    () => new Set(Object.keys(daily?.studentCafeteria || {})),
    [daily]
  );

  const staffMealKeys = useMemo(() => {
    const s = daily?.staffCafeteria || {};
    const order = ["BREAKFAST", "LUNCH", "DINNER"];
    return order.filter((k) => Array.isArray(s[k]) && s[k].length > 0);
  }, [daily]);

  useEffect(() => {
    if (studentCorner && !availableCorners.has(studentCorner)) setStudentCorner("SET_MENU");
  }, [availableCorners, studentCorner]);

  useEffect(() => {
    if (staffMeal && !staffMealKeys.includes(staffMeal)) setStaffMeal(null);
  }, [staffMealKeys, staffMeal]);

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

  const shiftDate = (days) => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      return d;
    });
  };

  return (
    <div className="DailyMenu">
      {/* 날짜 네비 */}
      <div className="date-nav">
        <button onClick={() => shiftDate(-1)} className="nav-btn">
          <ChevronLeft size={18} />
        </button>
        <span className="date-label">{formattedDate}</span>
        <button onClick={() => shiftDate(1)} className="nav-btn">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 상단 탭 */}
      <div className="tab-row">
        {["학생식당", "교직원식당"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`tab-btn ${selectedTab === tab ? "active" : ""}`}
            onClick={() => {
              setSelectedTab(tab);
              if (tab === "교직원식당") setStudentCorner(null);
              else setStaffMeal(null);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 서브탭 */}
      {selectedTab === "학생식당" && (
        <div className="subtab-row">
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
                {STUDENT_LABEL[k]}
              </button>
            );
          })}
        </div>
      )}
      {selectedTab === "교직원식당" && (
        <div className="subtab-row">
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
                {STAFF_LABEL[k]}
              </button>
            );
          })}
        </div>
      )}

      {/* 내용 */}
      <div className="menu-box">
        {loading ? (
          <div className="empty muted">불러오는 중...</div>
        ) : error ? (
          <div className="empty error">{error}</div>
        ) : !daily ? (
          <div className="empty muted">데이터 없음</div>
        ) : (
          <ul className="menu-list">
            {(menuItems.length ? menuItems : ["식단 정보가 없습니다"]).map((item, idx) => (
              <li key={idx} className="menu-item">{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
