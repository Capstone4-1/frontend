import "./DailyMenu.css";
import { useState } from "react";

const DailyMenu = ({ selectedDate }) => {
  const [selectedTab, setSelectedTab] = useState("학생식당");

  const menuData = {
    학생식당: "김치찌개, 계란말이, 밥, 김치",
    교직원식당: "갈비탕, 밥, 나물, 깍두기",
    정식: "불고기, 잡곡밥, 미역국, 과일",
  };

  const tabs = ["학생식당", "교직원식당", "정식"];
  const menuItems = menuData[selectedTab].split(",").map((item) => item.trim());

  const formattedDate = selectedDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="DailyMenu">
    
      <div className="menu-content">
        <h2>{formattedDate} - {selectedTab} 식단</h2>
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
