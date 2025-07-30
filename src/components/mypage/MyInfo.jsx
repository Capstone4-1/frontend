import { useContext, useState } from "react";
import { UserContext } from "../utils/UserContext";
import "./MyInfo.css";

const MyInfo = () => {
  const { user } = useContext(UserContext);
  const [form, setForm] = useState({
    name: user?.name || "",
    nickname: user?.nickname || "",
    email: user?.email || "",
    intro: user?.intro || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: axios PATCH 요청 등 처리
    console.log("수정된 정보:", form);
  };

  if (!user) return <div className="loading">로딩 중...</div>;

  return (
    <div className="myinfo-form-container">
      <h2>개인 정보 수정</h2>
      <form className="myinfo-form" onSubmit={handleSubmit}>
        <label>
          이름
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          닉네임
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          이메일
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled
          />
        </label>
        <label>
          소개
          <textarea
            name="intro"
            value={form.intro}
            onChange={handleChange}
            rows="4"
          />
        </label>
        <label>
          소개
          <textarea
            name="intro"
            value={form.intro}
            onChange={handleChange}
            rows="4"
          />
        </label>
        <label>
          소개
          <textarea
            name="intro"
            value={form.intro}
            onChange={handleChange}
            rows="4"
          />
        </label>
        <label>
          소개
          <textarea
            name="intro"
            value={form.intro}
            onChange={handleChange}
            rows="4"
          />
        </label>
        <label>
          소개
          <textarea
            name="intro"
            value={form.intro}
            onChange={handleChange}
            rows="4"
          />
        </label>
        <label>
          소개
          <textarea
            name="intro"
            value={form.intro}
            onChange={handleChange}
            rows="4"
          />
        </label>
        
        
        <button type="submit" className="save-btn">
          저장
        </button>
      </form>
    </div>
  );
};

export default MyInfo;
