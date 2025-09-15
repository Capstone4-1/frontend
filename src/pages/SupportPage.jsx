// src/pages/SupportPage.jsx
import { useState } from "react";
import "./SupportPage.css";
import InquiryForm from "../components/InquiryForm";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("myInquiries");

  return (
    <div className="SupportPage">
      <h2>📬 고객센터</h2>

      <div className="tabs">
        <button
          className={activeTab === "myInquiries" ? "active" : ""}
          onClick={() => setActiveTab("myInquiries")}
        >
          나의 문의 내역
        </button>
        <button
          className={activeTab === "newInquiry" ? "active" : ""}
          onClick={() => setActiveTab("newInquiry")}
        >
          문의하기
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "myInquiries"  }
        {activeTab === "newInquiry" && <InquiryForm />}
      </div>
    </div>
  );
};

export default SupportPage;
