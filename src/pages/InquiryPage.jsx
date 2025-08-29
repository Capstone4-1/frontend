import { useState } from "react";
import "./InquiryPage.css";
import InquiryForm from "../components/InquiryForm";

const InquiryPage = () => {

    return (
        <div className="InquiryPage">
            <div>고객센털</div>
            <InquiryForm />
        </div>
    );
};

export default InquiryPage;
