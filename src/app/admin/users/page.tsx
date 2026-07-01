"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { dbService, User } from "@/lib/dbService";
import {
  Users,
  Plus,
  ShieldAlert,
  UserCheck,
  Phone,
  Shield,
  Calendar,
  Lock
} from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form Inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleVal, setRoleVal] = useState<User["role"]>("employee");
  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState({ text: "", type: "" });

  const loadData = async () => {
    try {
      setLoading(true);
      const u = await dbService.getUsers();
      setUsers(u);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- KIỂM TRA QUYỀN HẠN TRUY CẬP (RBAC) ---
  const isAuthorized = currentUser?.role === "owner";

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white">Truy cập bị từ chối</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          Trang quản trị nhân sự nội bộ chỉ dành riêng cho **Chủ cửa hàng (Owner)**. Các vai trò khác không được phép can thiệp danh sách tài khoản.
        </p>
        <Link 
          href="/admin" 
          className="mt-5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
        >
          Quay lại Bảng điều khiển
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Đang truy xuất hồ sơ nhân sự...</span>
      </div>
    );
  }

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  // --- TẠO TÀI KHOẢN NHÂN VIÊN MỚI ---
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !fullName.trim() || !phone.trim()) {
      showFeedback("Vui lòng nhập đầy đủ tất cả các trường.", "error");
      return;
    }

    try {
      // Kiểm tra xem tên đăng nhập đã trùng chưa
      const usernameExists = users.some((u) => u.username === username.trim().toLowerCase());
      if (usernameExists) {
        showFeedback("Tên đăng nhập đã tồn tại trong hệ thống. Vui lòng chọn tên khác.", "error");
        return;
      }

      // Tạo ngẫu nhiên một avatar hạt giống (dicebear) để hiển thị đẹp
      const randomSeed = Math.random().toString(36).substring(7);
      const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;

      await dbService.createUser({
        username: username.trim().toLowerCase(),
        password: password, // plaintext giả lập như seed SQL chỉ định
        full_name: fullName,
        role: roleVal,
        phone: phone,
        avatar_url: avatarUrl
      });

      showFeedback(`Đã đăng ký tài khoản nhân viên mới thành công!`);
      setShowCreateModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      showFeedback(err.message || "Đăng ký lỗi.", "error");
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setFullName("");
    setRoleVal("employee");
    setPhone("");
  };

  const roleLabels = {
    owner: { text: "Chủ cửa hàng", color: "bg-red-500/20 text-red-300 border-red-500/30" },
    manager: { text: "Quản lý kỹ thuật", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    accountant: { text: "Kế toán tài vụ", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    employee: { text: "Nhân viên kỹ thuật", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert Feedback */}
      {message.text && (
        <div className={`fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl z-50 text-xs font-semibold border ${
          message.type === "success" 
            ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30" 
            : "bg-red-950/90 text-red-300 border-red-500/30"
        }`}>
          {message.text}
        </div>
      )}

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Quản trị Nhân sự & Tài khoản
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Xem hồ sơ, cấp tài khoản và thay đổi quyền hạn nhân viên trong hệ thống ERP.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-primary/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Cấp tài khoản nhân sự mới
          </button>
        </div>
      </div>

      {/* 2. USERS TABLE / LIST */}
      <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-white">Danh sách thành viên cửa hàng ({users.length} tài khoản)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-2">ID</th>
                <th className="py-3">Họ và tên</th>
                <th className="py-3">Tên tài khoản</th>
                <th className="py-3">Vai trò phân quyền</th>
                <th className="py-3">Số điện thoại</th>
                <th className="py-3">Ngày gia nhập</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {users.map((u) => {
                const label = roleLabels[u.role] || { text: u.role, color: "bg-slate-800 text-slate-400 border-slate-700" };
                return (
                  <tr key={u.id} className="hover:bg-slate-900/20">
                    <td className="py-3.5 px-2 text-slate-500 font-semibold">{u.id}</td>
                    <td className="py-3.5 font-semibold text-white">
                      <div className="flex items-center space-x-3">
                        <img
                          src={u.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=avatar"}
                          alt={u.full_name}
                          className="w-8 h-8 rounded-full border border-slate-700 bg-slate-850"
                        />
                        <span>{u.full_name}</span>
                        {u.id === currentUser.id && (
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">Bạn</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-300 font-mono">@{u.username}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${label.color}`}>
                        {label.text}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{u.phone || "-"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        <span>{u.created_at ? new Date(u.created_at).toLocaleDateString("vi-VN") : "Khởi tạo ban đầu"}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL: CREATE USER ACCOUNT --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-card bg-[#0a1931]/95 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">
              Cấp tài khoản nhân sự mới
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Họ và Tên nhân viên *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Trần Văn B..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Số điện thoại liên hệ *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xx..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tên đăng nhập *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nhanvien_b"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Mật khẩu *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Quyền hạn hệ thống (Role) *</label>
                <select
                  value={roleVal}
                  onChange={(e) => setRoleVal(e.target.value as User["role"])}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-semibold"
                >
                  <option value="employee">Employee - Nhân viên kỹ thuật</option>
                  <option value="accountant">Accountant - Kế toán cửa hàng</option>
                  <option value="manager">Manager - Quản lý kho, duyệt đơn</option>
                  <option value="owner">Owner - Chủ cửa hàng toàn quyền</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-750"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/20"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
