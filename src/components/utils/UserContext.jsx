// src/context/UserContext.js
import { createContext, useState, useEffect } from "react";
import axiosInstance from "./AxiosInstance";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {


  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    axiosInstance.get("/member/me")
      .then(res => {
        setUser(res.data.meDto);
        setIsLoading(false); // 성공 시
      })
      .catch(err => {
        console.error("me 정보 가져오기 실패:", err);
        setIsLoading(false); // 실패 시에도 로딩 완료
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

