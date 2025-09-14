import { createContext, useState, useEffect } from "react";
import axiosInstance from "./AxiosInstance";
import { hasMinimumRole } from "./RoleUtils";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/member/me")
      .then(res => {
        setUser(res.data.meDto);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("me 정보 가져오기 실패:", err);
        setIsLoading(false);
      });
  }, []);

  // ✅ roleUtils 함수 사용
  const hasRole = (requiredRole) => {
    if (!user || !user.roles) return false;
    return hasMinimumRole(user.roles, requiredRole);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, hasRole }}>
      {children}
    </UserContext.Provider>
  );
};
