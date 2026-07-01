"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";
import {
  LayoutDashboard,
  Package,
  Truck,
  CreditCard,
  TrendingUp,
  Users,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Database,
  Info
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isDemoMode, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toastText = useUIStore((state) => state.text);
  const toastType = useUIStore((state) => state.type);

  // Chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="w-full min-h-screen bg-[#071329] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-slate-400 font-medium animate-pulse">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  // Cấu hình thanh Sidebar Menu dựa trên quyền hạn
  const allMenuItems = [
    { name: "Tổng quan", href: "/admin", icon: LayoutDashboard, roles: ["owner", "manager", "accountant", "employee"] },
    { name: "Kho hàng", href: "/admin/inventory", icon: Package, roles: ["owner", "manager", "accountant", "employee"] },
    { name: "Vận chuyển", href: "/admin/deliveries", icon: Truck, roles: ["owner", "manager", "accountant", "employee"] },
    { name: "Công nợ", href: "/admin/debts", icon: CreditCard, roles: ["owner", "manager", "accountant"] },
    { name: "Tài chính", href: "/admin/finance", icon: TrendingUp, roles: ["owner", "accountant"] },
    { name: "Nhân sự", href: "/admin/users", icon: Users, roles: ["owner"] }
  ];

  // Lọc các item menu được phép hiển thị cho role hiện tại
  const allowedMenuItems = allMenuItems.filter((item) => item.roles.includes(user.role));

  const roleLabels = {
    owner: { text: "Chủ cửa hàng", color: "bg-red-500/20 text-red-300 border-red-500/30" },
    manager: { text: "Quản lý", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    accountant: { text: "Kế toán", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    employee: { text: "Kỹ thuật viên", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" }
  };

  const currentRole = roleLabels[user.role] || { text: user.role, color: "bg-slate-500/20 text-slate-300 border-slate-700" };

  return (
    <div className="h-screen bg-[#071329] text-slate-100 flex flex-col md:flex-row relative overflow-hidden admin-body">
      
      {/* Toast Alert Feedback */}
      {toastText && (
        <div className={`fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl z-50 text-xs font-semibold border whitespace-nowrap inline-block ${
          toastType === "success" 
            ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30" 
            : "bg-red-950/90 text-red-300 border-red-500/30"
        }`}>
          {toastText}
        </div>
      )}

      {/* 1. SIDEBAR (DESKTOP) */}
      <aside className="hidden md:flex flex-col w-64 h-full bg-[#0a1931]/80 backdrop-blur-xl border-r border-slate-800 p-6 z-30 shrink-0">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 mb-8 border-b border-slate-800 pb-5">
          <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-lg">
            ❄
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white leading-none">ĐIỆN LẠNH TẬN NHÀ</h1>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Hệ thống ERP</span>
          </div>
        </div>

        {/* User profile summary */}
        <div className="flex items-center space-x-3 mb-6 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5">
          <img
            src={user.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=avatar"}
            alt={user.full_name}
            className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white truncate leading-tight">{user.full_name}</h3>
            <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border mt-1.5 ${currentRole.color}`}>
              {currentRole.text}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-thin">
          {allowedMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all group ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Icon className={`w-5.5 h-5.5 shrink-0 transition-transform group-hover:scale-105`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions (Logout) */}
        <div className="border-t border-slate-800 pt-4 mt-4 shrink-0">
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all group"
          >
            <LogOut className="w-5.5 h-5.5 group-hover:translate-x-0.5 transition-transform" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* 2. SIDEBAR (MOBILE MENU DRAWER) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="relative flex flex-col w-64 max-w-xs bg-[#0a1931] border-r border-slate-800 p-6 animate-slide-in">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <div className="flex items-center space-x-3 mb-8 border-b border-slate-800 pb-5 pr-8">
              <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-lg">
                ❄
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-tight text-white leading-none">ĐIỆN LẠNH TẬN NHÀ</h1>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Hệ thống ERP</span>
              </div>
            </div>

            {/* User profile summary */}
            <div className="flex items-center space-x-3 mb-6 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5">
              <img
                src={user.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=avatar"}
                alt={user.full_name}
                className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800"
              />
              <div>
                <h3 className="text-sm font-semibold text-white leading-tight">{user.full_name}</h3>
                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border mt-1 ${currentRole.color}`}>
                  {currentRole.text}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-grow space-y-1.5 overflow-y-auto">
              {allowedMenuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5.5 h-5.5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Logout */}
            <div className="border-t border-slate-800 pt-4 mt-auto shrink-0">
              <button
                onClick={logout}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all"
              >
                <LogOut className="w-5.5 h-5.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTAINER AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* Top Navbar */}
        <header className="sticky top-0 bg-[#071329]/80 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-6 z-20 shrink-0">
          
          <div className="flex items-center space-x-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Screen Title */}
            <h2 className="text-xl font-bold text-white tracking-tight hidden sm:block">
              {allMenuItems.find((m) => m.href === pathname)?.name || "Bảng điều khiển"}
            </h2>
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center space-x-3">
            {/* Indicator banner for Demo/Supabase connection state */}
            {isDemoMode ? (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold shadow-inner">
                <Database className="w-3.5 h-3.5 animate-pulse" />
                <span>ERP Demo Mode</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-inner">
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Live</span>
              </div>
            )}

            {/* Profile Menu Trigger info */}
            <div className="flex items-center space-x-2 border-l border-slate-800 pl-4">
              <span className="text-sm text-slate-300 font-semibold hidden lg:inline-block">
                Chào, <strong>{user.full_name.split(" ").pop()}</strong>
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <img
                  src={user.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=avatar"}
                  alt={user.full_name}
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main page content body scroll container */}
        <main className="flex-grow p-6 overflow-y-auto max-w-7xl w-full mx-auto relative">
          {/* Demo Warning alert for non-database connections */}
          {isDemoMode && (
            <div className="mb-6 p-3 bg-gradient-to-r from-yellow-950/40 to-amber-950/20 border border-yellow-500/20 rounded-xl text-yellow-300 text-xs flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 shrink-0 text-yellow-400" />
                <span>
                  Hệ thống đang chạy trong <strong>Chế độ thử nghiệm (Demo)</strong>. Mọi thay đổi về dữ liệu kho, giao dịch, nợ và giao hàng sẽ được lưu tạm tại trình duyệt này (LocalStorage) và sẽ mất khi bạn xoá lịch sử duyệt web.
                </span>
              </div>
              <button
                onClick={() => {
                  if (confirm("Bạn có chắc chắn muốn đặt lại dữ liệu mẫu gốc? Hành động này sẽ xoá sạch các thay đổi hiện tại của bạn.")) {
                    localStorage.removeItem("erp_products");
                    localStorage.removeItem("erp_transactions");
                    localStorage.removeItem("erp_debts");
                    localStorage.removeItem("erp_deliveries");
                    window.location.reload();
                  }
                }}
                className="shrink-0 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-bold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors"
              >
                Đặt lại Dữ liệu Gốc
              </button>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
