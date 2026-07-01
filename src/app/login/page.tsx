"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Shield, User, Lock, ArrowRight, Database, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";
import { hasSupabaseConfig } from "@/lib/supabaseClient";

export default function LoginPage() {
  const { user, login, isDemoMode, toggleDemoMode } = useAuth();
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Thử tự động chuyển hướng nếu đã đăng nhập rồi
  useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng điền đầy đủ thông tin đăng nhập.");
      return;
    }

    setError("");
    setIsLoading(true);

    const res = await login(username, password);
    setIsLoading(false);

    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "Đăng nhập thất bại.");
    }
  };

  const handleQuickLogin = (uname: string, pass: string) => {
    setUsername(uname);
    setPassword(pass);
    setError("");
  };

  const demoAccounts = [
    { name: "Nguyễn Đức Tâm", role: "Owner", user: "chu_tam", pass: "tam123", color: "from-red-500/20 to-orange-500/20 border-red-500/30" },
    { name: "Trần Huy Quang", role: "Manager", user: "quanly_quang", pass: "quang123", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30" },
    { name: "Phạm Thị Lan", role: "Accountant", user: "ketoan_lan", pass: "lan123", color: "from-purple-500/20 to-pink-500/20 border-purple-500/30" },
    { name: "Lê Anh Dũng", role: "Employee", user: "nhanvien_dung", pass: "dung123", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30" }
  ];

  return (
    <div className="w-full min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-[#0c1e3d] via-[#051329] to-[#010915] text-[#f8fafc]">
      
      {/* Hiệu ứng nền tuyết bay lơ lửng */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <div className="absolute top-1/4 right-20 w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-sky-200 rounded-full animate-pulse" style={{ animationDuration: "5s" }} />
        <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDuration: "12s" }} />
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-12 gap-8 relative z-10">
        
        {/* Cột trái: Form Đăng nhập */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl relative">
            
            {/* Logo hoặc biểu tượng đầu trang */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-primary/20 border border-primary/40 rounded-xl shadow-lg shadow-primary/20">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  ĐIỆN LẠNH TẬN NHÀ
                </h1>
                <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
                  Hệ thống điều hành ERP nội bộ
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Đăng nhập hệ thống
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-950/50 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-start gap-2 shadow-lg shadow-red-950/20">
                <span className="font-bold">Lỗi:</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Tên tài khoản
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên tài khoản..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Toggle chế độ Demo vs Supabase */}
              <div className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-primary" />
                  <span className="text-xs text-slate-300">
                    Chế độ dữ liệu:{" "}
                    <strong className={isDemoMode ? "text-yellow-400" : "text-emerald-400"}>
                      {isDemoMode ? "Demo (Local)" : "Supabase Live"}
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!hasSupabaseConfig && isDemoMode) {
                      setError("Không tìm thấy cấu hình Supabase. Vui lòng thêm khoá vào .env.local trước khi bật Supabase Live.");
                      return;
                    }
                    toggleDemoMode(!isDemoMode);
                  }}
                  className="focus:outline-none"
                >
                  {isDemoMode ? (
                    <ToggleLeft className="w-10 h-6 text-slate-500 cursor-pointer hover:text-slate-400 transition-colors" />
                  ) : (
                    <ToggleRight className="w-10 h-6 text-emerald-400 cursor-pointer hover:text-emerald-500 transition-colors" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all focus:outline-none active:scale-95 disabled:opacity-50"
              >
                <span>{isLoading ? "Đang xử lý..." : "Vào hệ thống"}</span>
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-4">
              <span>Đại chỉ: 36 Đường số 1, Bình Hưng Hoà, Bình Tân</span>
              <a href="/" className="text-primary hover:underline font-medium">➔ Quay về Trang chủ</a>
            </div>
          </div>
        </div>

        {/* Cột phải: Chọn nhanh tài khoản mẫu */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <div className="glass-card bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-md font-semibold text-white mb-2 flex items-center gap-1.5">
              <span>Tài khoản kiểm thử nhanh</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Nhấp vào một tài khoản bên dưới để tự động điền thông tin đăng nhập. Dễ dàng chuyển đổi giữa các quyền hạn.
            </p>

            <div className="space-y-3">
              {demoAccounts.map((acc, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickLogin(acc.user, acc.pass)}
                  className={`w-full text-left p-3.5 rounded-xl border bg-gradient-to-r ${acc.color} hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-between group focus:outline-none`}
                >
                  <div>
                    <h4 className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">
                      {acc.name}
                    </h4>
                    <p className="text-xs text-slate-400 flex gap-2 mt-0.5">
                      <span>Tên: <code className="text-blue-300">{acc.user}</code></span>
                      <span>Mật khẩu: <code className="text-blue-300">{acc.pass}</code></span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>

            {!hasSupabaseConfig && (
              <div className="mt-4 p-3 bg-yellow-950/30 border border-yellow-500/20 rounded-xl text-yellow-300 text-[11px] leading-relaxed">
                <strong>💡 Lưu ý:</strong> Chưa cấu hình Supabase trong `.env.local`. Hệ thống đang tự động bật chế độ Demo (lưu dữ liệu tạm thời vào trình duyệt của bạn).
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
