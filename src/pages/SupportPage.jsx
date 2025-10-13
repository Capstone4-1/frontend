// src/pages/SupportPage.jsx
import { useState } from "react";
import "./SupportPage.css";
import InquiryForm from "../components/InquiryForm";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("myInquiries");

  return (
    <div className="SupportPage">
      <InquiryForm />
    </div>

  );
};

export default SupportPage;
