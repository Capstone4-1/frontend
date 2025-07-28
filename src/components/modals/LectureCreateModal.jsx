import { useState } from "react";
import "./LectureCreateModal.css";
import axiosInstance from "../utils/AxiosInstance";

const colorOptions = [
    { name: "Sky Blue", value: "#007bff" },
    { name: "Emerald", value: "#28a745" },
    { name: "Sunshine", value: "#ffc107" },
    { name: "Coral", value: "#fd7e14" },
    { name: "Crimson", value: "#dc3545" },
    { name: "Purple", value: "#6f42c1" },
    { name: "Teal", value: "#20c997" },
    { name: "Slate", value: "#6c757d" },
];

// ✅ 영어 DayOfWeek로 변경
const days = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
    "FRIDAY", "SATURDAY", "SUNDAY"
];

const LectureCreateModal = ({ onClose, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [grade, setGrade] = useState(1);
    const [semester, setSemester] = useState(1);
    const [intro, setIntro] = useState("");
    const [color, setColor] = useState(colorOptions[0].value);

    const [lectureTimes, setLectureTimes] = useState([
        { day: "MONDAY", start: 9, end: 10 },
    ]);

    const handleLectureTimeChange = (index, field, value) => {
        const updated = [...lectureTimes];
        let numValue = Number(value);

        if (field === "day") {
            updated[index][field] = value;
        } else {
            if (isNaN(numValue)) numValue = 0;
            if (numValue < 0) numValue = 0;
            if (numValue > 23) numValue = 23;

            updated[index][field] = numValue;

            if (field === "start" && updated[index].end <= numValue) {
                updated[index].end = numValue + 1 <= 23 ? numValue + 1 : 23;
            }
            if (field === "end" && numValue <= updated[index].start) {
                updated[index].end = updated[index].start + 1 <= 23 ? updated[index].start + 1 : 23;
            }
        }

        setLectureTimes(updated);
    };

    const addLectureTime = () => {
        if (lectureTimes.length >= 3) {
            alert("강의 시간은 최대 3개까지 입력할 수 있습니다.");
            return;
        }
        setLectureTimes([...lectureTimes, { day: "MONDAY", start: 9, end: 10 }]);
    };

    const removeLectureTime = (index) => {
        setLectureTimes(lectureTimes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/lecture-room", {
                title,
                grade,
                semester,
                intro,
                themeColor: color,
                lectureTimes, // ✅ DayOfWeek Enum 값이므로 백엔드에서 바로 매핑됨
            });
            onSuccess();
            onClose();
        } catch (err) {
            alert("강의 생성 실패");
            console.error(err);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <h2>강의 생성</h2>
                <form onSubmit={handleSubmit}>
                    <div className="inner-layout">
                        <div>
                            <label>
                                강의명 <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="예: 영상처리 및 실습"
                            />
                            <div className="grade-semester-area">
                                <label>학년</label>
                                <select value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
                                    {[1, 2, 3, 4].map((g) => (
                                        <option key={g} value={g}>{g}학년</option>
                                    ))}
                                </select>

                                <label>학기</label>
                                <select value={semester} onChange={(e) => setSemester(Number(e.target.value))}>
                                    {[1, 2].map((s) => (
                                        <option key={s} value={s}>{s}학기</option>
                                    ))}
                                </select>
                            </div>

                            <label>강의 시간</label>
                            {lectureTimes.map((time, index) => (
                                <div key={index} className="lecture-time-row">
                                    <select
                                        value={time.day}
                                        onChange={(e) => handleLectureTimeChange(index, "day", e.target.value)}
                                    >
                                        {days.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={time.start}
                                        onChange={(e) => handleLectureTimeChange(index, "start", e.target.value)}
                                    />
                                    ~
                                    <input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={time.end}
                                        onChange={(e) => handleLectureTimeChange(index, "end", e.target.value)}
                                    />

                                    {lectureTimes.length > 1 && (
                                        <button
                                            type="button"
                                            className="delete-btn"
                                            onClick={() => removeLectureTime(index)}
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                            ))}
                            <div>
                                <button type="button" className="add-time-btn" onClick={addLectureTime}>
                                    + 시간 추가
                                </button>
                            </div>
                        </div>
                        <div>
                            <label>강의 소개 (선택)</label>
                            <textarea
                                value={intro}
                                onChange={(e) => setIntro(e.target.value)}
                                placeholder="강의에 대한 간단한 설명을 입력하세요"
                            />

                            <label>테마 색상</label>
                            <div className="color-palette">
                                {colorOptions.map((c) => (
                                    <div
                                        key={c.value}
                                        className={`color-box ${color === c.value ? "selected" : ""}`}
                                        style={{ backgroundColor: c.value }}
                                        onClick={() => setColor(c.value)}
                                        title={c.name}
                                    />
                                ))}
                                <label className="custom-color-picker">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        style={{ width: "40px", height: "30px", border: "none", padding: 0 }}
                                    />
                                    직접 선택
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="submit">생성</button>
                        <button type="button" onClick={onClose}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LectureCreateModal;
