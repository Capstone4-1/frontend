import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "./AxiosInstance";
import { roleHierarchy } from "./RoleUtils";
const PrivateRoute = ({ isAuthenticated, requiredRole, children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = 확인 중

  useEffect(() => {
    const checkRole = async () => {
      try {
        if (requiredRole) {
          // 서버에서 사용자의 모든 역할 가져오기
          const res = await axiosInstance.get("/member/my-roles");
          const userRoles = res.data.roles; 

          // 최소 권한 체크
          const requiredIndex = roleHierarchy.indexOf(requiredRole);
          const hasMinimumRole = userRoles.some(
            role => roleHierarchy.indexOf(role) >= requiredIndex
          );

          setIsAuthorized(hasMinimumRole);
        } else {
          setIsAuthorized(true); // 권한 필요 없으면 로그인만 체크
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
  if (!isAuthorized) return <Navigate to="/main" replace />;

  return children;
};

export default PrivateRoute;