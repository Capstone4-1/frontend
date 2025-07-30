import React, { useEffect, useState } from "react";
import "./App.css";
import {
    Route,
    Routes,
    Navigate,
    useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BoardPage from "./pages/BoardPage";
import MyPageV2 from "./pages/MyPageV2.jsx";
import MainPage from "./pages/MainPage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Footer from "./components/Footer";
import MailPage from "./pages/MailPage.jsx";
import { UserProvider } from "./components/utils/UserContext.jsx";
import WritePage from "./pages/WritePage";
import LectureBoardPage from "./pages/LectureBoardPage";
import LectureWritePage from "./pages/LectureWritePage";
import AdminPage from "./pages/AdminPage.jsx";
import PrivateRoute from "./components/utils/PrivateRoute.jsx";
import StudyDashboardPage from "./pages/StudyDashboardPage.jsx";
import LectureCategoryBox from "./components/board-box/LectureCategoryBox.jsx";
import LecturePostDetail from "./components/post/LecturePostDetail.jsx";
import TestPage from "./pages/TestPage.jsx";
import Account from "./components/mypage/account.jsx";
import MyActivity from "./components/mypage/MyActivity.jsx";
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false); // 추가
    const location = useLocation();

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token && !isTokenExpired(token)) {
            setIsAuthenticated(true);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
            delete axios.defaults.headers.common["Authorization"];
        }
        setIsAuthChecked(true); // 인증 체크 완료
    }, []);

    const hideFooterRoutes = [
        "/login",
        "/login/register",
        "/chat-mail",
        "/mypage",
    ];
    const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

    // 인증 상태 확인 전이면 아무것도 렌더링하지 않음
    if (!isAuthChecked) return null;

    return (
        <UserProvider>
            <div className="body-container">
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/main" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <LoginPage
                                setIsAuthenticated={setIsAuthenticated}
                            />
                        }
                    />
                    <Route path="/login/register" element={<RegisterPage />} />

                    {/* 인증이 필요한 경로들 */}
                    <Route
                        path="/main"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <MainPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/mypage" element={<MyPageV2 />}>
                        <Route path="activity" element={<MyActivity />} />
                        <Route path="account" element={<Account />} />
                    </Route>
                    <Route
                        path="/chat-mail"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <MailPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/main/community/:boardType"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <BoardPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/main/community/:boardType/post/:postId"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <BoardPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/write/:boardType"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <WritePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <AdminPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/board/:boardType"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <BoardPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/test"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <TestPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/main/study-dashboard"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <StudyDashboardPage />
                            </PrivateRoute>
                        }
                    >
                        <Route
                            path="lectures"
                            element={<LectureCategoryBox />}
                        />
                        <Route
                            path=":lectureId"
                            element={<LectureBoardPage />}
                        />{" "}
                        {/* ✅ 추가 */}
                        <Route
                            path=":lectureId/write"
                            element={<LectureWritePage />}
                        />
                        <Route
                            path=":lectureId/:postId"
                            element={<LecturePostDetail />}
                        />
                    </Route>
                </Routes>
            </div>
            {shouldShowFooter && <Footer />}
        </UserProvider>
    );
}

export default App;
