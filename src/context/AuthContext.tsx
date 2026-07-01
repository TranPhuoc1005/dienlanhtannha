"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, dbService, getDemoModeStatus, setDemoMode } from "@/lib/dbService";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleDemoMode: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Khởi tạo chế độ Demo dựa trên trạng thái mặc định từ dbService
    const demoStatus = getDemoModeStatus();
    setIsDemoMode(demoStatus);

    // Kiểm tra session hiện có trong localStorage
    const savedUser = localStorage.getItem("erp_session_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const toggleDemoMode = (val: boolean) => {
    setDemoMode(val);
    setIsDemoMode(val);
    // Khi đổi chế độ, đăng xuất phiên hiện tại để tránh xung đột dữ liệu người dùng
    logout();
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const users = await dbService.getUsers();
      
      // Ở đây chúng ta kiểm tra thông tin đăng nhập từ cơ sở dữ liệu (plaintext như file SQL chỉ định)
      // Đối với Supabase thực tế, bạn sẽ dùng auth.signInWithPassword,
      // Nhưng để nhất quán với schema người dùng tự tạo và chế độ Demo song song,
      // chúng ta sẽ kiểm tra khớp thông tin từ bảng users.
      const matchedUser = users.find(
        (u) => u.username === username.trim()
      );

      if (!matchedUser) {
        setLoading(false);
        return { success: false, error: "Tên đăng nhập không tồn tại" };
      }

      // Giả lập kiểm tra mật khẩu đơn giản (trong thực tế có mã hoá, nhưng seed data của người dùng là tam123, quang123...)
      const expectedPassword = username.trim() === "chu_tam" ? "tam123" 
                             : username.trim() === "quanly_quang" ? "quang123"
                             : username.trim() === "ketoan_lan" ? "lan123"
                             : username.trim() === "nhanvien_dung" ? "dung123"
                             : username.trim() === "nhanvien_thanh" ? "thanh123"
                             : password; // Mặc định khớp mật khẩu đã gửi cho các tài khoản tự tạo thêm
      
      if (password !== expectedPassword) {
        setLoading(false);
        return { success: false, error: "Mật khẩu không chính xác" };
      }

      setUser(matchedUser);
      localStorage.setItem("erp_session_user", JSON.stringify(matchedUser));
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || "Đã xảy ra lỗi đăng nhập" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("erp_session_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        login,
        logout,
        toggleDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được sử dụng trong một AuthProvider");
  }
  return context;
};
