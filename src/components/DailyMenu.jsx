// DailyMenu.jsx
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DailyMenu.css";

const DailyMenu = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState("학생식당");

  const menuData = {
    학생식당: "김치찌개, 계란말이, 밥, 김치",
    교직원식당: "갈비탕, 밥, 나물, 깍두기",
    정식: "불고기, 잡곡밥, 미역국, 과일",
  };

  const tabs = Object.keys(menuData);
  const menuItems = menuData[selectedTab].split(",").map((item) => item.trim());

  const formattedDate = selectedDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="DailyMenu">
      {/* 달력 */}
      <div className="calendar-container">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          formatDay={(locale, date) => date.getDate()}
          locale="ko-KR"
        />
      </div>

      {/* 메뉴 영역 */}
      <div className="menu-container">
        <h2>{formattedDate} - {selectedTab} 식단</h2>
        
        {/* 탭 버튼 */}
        <div className="tab-buttons">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={selectedTab === tab ? "active" : ""}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 메뉴 리스트 */}
        <ul className="menu-list">
          {menuItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DailyMenu;
