import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCookie, setCookie, deleteCookie } from 'utils/ts/cookie';

interface AuthContextType {
  isLogin: boolean;
  userType: string | null;
  userId: string | null;
  checkLoginStatus: () => void;
  setLogin: (isLogin: boolean, userType: string, userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const checkLoginStatus = () => {
    const isLogine = getCookie('isLogine');
    const userTypeCookie = getCookie('userType');
    const userIdCookie = getCookie('id');

    if (isLogine) {
      setIsLogin(true);
      setUserType(userTypeCookie ? userTypeCookie : null);
      setUserId(userIdCookie ? userIdCookie : null);
    } else {
      setIsLogin(false);
      setUserType(null);
      setUserId(null);
    }
  };

  const setLogin = (isLogin: boolean, userType: string, userId: string) => {
    setIsLogin(isLogin);
    setUserType(userType);
    setUserId(userId);
    setCookie('isLogine', 'true', 24); // 쿠키 만료 시간 24시간
    setCookie('userType', userType, 24);
    setCookie('id', userId, 24);
  };

  const logout = () => {
    setIsLogin(false);
    setUserType(null);
    setUserId(null);
    // 쿠키 삭제
    deleteCookie('isLogine');
    deleteCookie('userType');
    deleteCookie('id');
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, userType, userId, checkLoginStatus, setLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
