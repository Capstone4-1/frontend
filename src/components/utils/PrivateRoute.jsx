import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "./AxiosInstance";

const PrivateRoute = ({ isAuthenticated, requiredRole, children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = 확인 중

  useEffect(() => {
    const checkRole = async () => {
      try {
        // requiredRole이 있으면 API 호출, 없으면 로그인만 체크
        if (requiredRole) {
          const res = await axiosInstance.get(`/member/check-role?role=${requiredRole}`);
          setIsAuthorized(res.data.hasRole); // true/false
        } else {
          setIsAuthorized(true); 
        }
      } catch (err) {
        setIsAuthorized(false);
      }
    };

    if (isAuthenticated) {
      checkRole();
    } else {
      setIsAuthorized(false);
    }
  }, [isAuthenticated, requiredRole]);

  if (isAuthorized === null) return null; // 로딩 중

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAuthorized) {
    return <Navigate to="/main" replace />;
  }

  return children;
};

export default PrivateRoute;
