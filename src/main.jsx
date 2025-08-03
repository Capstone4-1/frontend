import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import "./styles/reset.css";

// ✅ 현재 Nginx는 루트(/)에서 서비스하므로 basename은 "/"로 고정
const basename = "/";

createRoot(document.getElementById("root")).render(
    //<StrictMode>
    <BrowserRouter basename={basename}>
        <App />
    </BrowserRouter>
    //</StrictMode>,
);
