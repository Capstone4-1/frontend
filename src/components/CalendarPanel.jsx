import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarPanel.css";

// ✅ props로 date와 onChange 받도록 수정
const CalendarPanel = ({ date, onChange }) => {
    return (
        <div className="calendar-container">
            <div className="calendar">
                <Calendar
                    onChange={onChange}      // Dashboard에서 전달한 setDate 사용
                    value={date}             // Dashboard에서 전달한 date 사용
                    formatDay={(locale, date) => date.getDate()}
                    locale="ko-KR"
                />
            </div>
        </div>
    );
};

export default CalendarPanel;
