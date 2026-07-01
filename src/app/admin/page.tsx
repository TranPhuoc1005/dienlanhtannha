"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { dbService, Product, Transaction, Debt, Delivery, User } from "@/lib/dbService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Truck,
  Users,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase
} from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Queries
  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: dbService.getProducts
  });

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: dbService.getTransactions
  });

  const { data: debts = [], isLoading: loadingDebts } = useQuery<Debt[]>({
    queryKey: ["debts"],
    queryFn: dbService.getDebts
  });

  const { data: deliveries = [], isLoading: loadingDeliveries } = useQuery<Delivery[]>({
    queryKey: ["deliveries"],
    queryFn: dbService.getDeliveries
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: dbService.getUsers
  });

  const loading = loadingProducts || loadingTransactions || loadingDebts || loadingDeliveries || loadingUsers;

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Đang tính toán số liệu thống kê...</span>
      </div>
    );
  }

  // --- TÍNH TOÁN CÁC CHỈ SỐ KPI ---
  
  // 1. Kho hàng
  const totalStockItems = products.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // 2. Giao dịch chờ duyệt
  const pendingTransactions = transactions.filter((t) => t.status === "pending");

  // 3. Công nợ
  const totalReceivable = debts
    .filter((d) => d.type === "receivable")
    .reduce((acc, curr) => acc + curr.remaining_amount, 0);
  
  const totalPayable = debts
    .filter((d) => d.type === "payable")
    .reduce((acc, curr) => acc + curr.remaining_amount, 0);

  // 4. Tài chính (Tính doanh số và chi phí từ giao dịch completed)
  const totalRevenue = transactions
    .filter((t) => t.type === "export" && t.status === "completed")
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  const totalCost = transactions
    .filter((t) => t.type === "import" && t.status === "completed")
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  const grossProfit = totalRevenue - totalCost;

  // 5. Giao hàng
  const pendingDeliveries = deliveries.filter((d) => d.status === "pending" || d.status === "shipping");
  const completedDeliveries = deliveries.filter((d) => d.status === "delivered");

  // Định dạng số tiền tệ VNĐ
  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  return (
    <div className="space-y-6">
      
      {/* Lời chào chào đón */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Chào mừng trở lại, {user?.full_name}! 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dưới đây là tổng hợp nhanh tình hình hoạt động của Điện Lạnh Tận Nhà ngày hôm nay.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Làm mới số liệu
          </button>
        </div>
      </div>

      {/* --- GRID THÔNG SỐ KPI CHÍNH (Đa vai trò) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Kho hàng (Tất cả vai trò đều xem) */}
        <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Tổng số tồn kho</span>
            <h2 className="text-2xl font-bold text-white mt-1.5">{totalStockItems} <span className="text-xs text-slate-400 font-normal">sản phẩm</span></h2>
            {lowStockProducts.length > 0 ? (
              <span className="text-[10px] text-yellow-400 mt-2 inline-flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {lowStockProducts.length} máy sắp hết hàng!
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 mt-2 inline-block">Mức tồn kho an toàn</span>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Chờ duyệt (Chỉ Owner & Manager quan tâm) */}
        <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Yêu cầu kho chờ duyệt</span>
            <h2 className="text-2xl font-bold text-white mt-1.5">{pendingTransactions.length} <span className="text-xs text-slate-400 font-normal">đơn</span></h2>
            {pendingTransactions.length > 0 ? (
              <span className="text-[10px] text-amber-400 mt-2 inline-flex items-center gap-1 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                Cần được phê duyệt gấp
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 mt-2 inline-block">Không có đơn hàng chờ</span>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Lợi nhuận gộp hoặc Đơn vận chuyển (Tùy thuộc vai trò) */}
        {user?.role === "owner" || user?.role === "accountant" ? (
          <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Lợi nhuận gộp</span>
              <h2 className={`text-xl font-bold mt-1.5 truncate max-w-[170px] ${grossProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatVND(grossProfit)}
              </h2>
              <span className="text-[10px] text-slate-400 mt-2 inline-block">Doanh thu trừ Chi phí nhập</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Lịch giao hàng chờ</span>
              <h2 className="text-2xl font-bold text-white mt-1.5">{pendingDeliveries.length} <span className="text-xs text-slate-400 font-normal">lịch</span></h2>
              <span className="text-[10px] text-slate-400 mt-2 inline-block">Đang vận chuyển & lắp đặt</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Truck className="w-6 h-6" />
            </div>
          </div>
        )}

        {/* KPI 4: Công nợ (Owner/Accountant) hoặc Công việc được giao (Employee) */}
        {user?.role === "owner" || user?.role === "accountant" ? (
          <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Tổng công nợ phải thu</span>
              <h2 className="text-xl font-bold text-red-400 mt-1.5 truncate max-w-[170px]">{formatVND(totalReceivable)}</h2>
              <span className="text-[10px] text-slate-400 mt-2 inline-block">Từ nợ mua hàng chậm</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Nhiệm vụ của tôi</span>
              <h2 className="text-2xl font-bold text-white mt-1.5">
                {deliveries.filter((d) => d.assigned_to === user?.id && d.status !== "delivered" && d.status !== "failed").length}
              </h2>
              <span className="text-[10px] text-slate-400 mt-2 inline-block">Lịch trình phân công hôm nay</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
        )}

      </div>

      {/* --- GRID KHỐI THÔNG TIN CHI TIẾT THEO VAI TRÒ --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Khối bên trái: Biểu đồ & Thống kê Tài chính/Hoạt động (Col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Biểu đồ dòng tiền (Chỉ hiển thị cho Owner/Accountant) */}
          {(user?.role === "owner" || user?.role === "accountant") && (
            <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Biểu đồ Doanh thu so với Chi phí mua hàng
              </h3>

              {/* Biểu đồ dạng cột SVG siêu nhẹ */}
              <div className="h-64 flex flex-col justify-between mt-6">
                <div className="relative flex-1 flex items-end justify-around gap-4 pb-2 border-b border-slate-800">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-0 border-t border-slate-800/50" />
                  <div className="absolute inset-x-0 top-1/3 border-t border-slate-800/50" />
                  <div className="absolute inset-x-0 top-2/3 border-t border-slate-800/50" />

                  {/* Doanh thu (Xuất hàng) */}
                  <div className="flex flex-col items-center w-full max-w-[100px]">
                    <div 
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-1000 shadow-lg shadow-emerald-500/10"
                      style={{ 
                        height: totalRevenue > 0 ? `${Math.min(100, (totalRevenue / Math.max(totalRevenue, totalCost)) * 180)}px` : "10px" 
                      }}
                    />
                    <span className="text-[10px] text-slate-400 mt-2 font-semibold truncate max-w-full text-center block">
                      Doanh thu
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold block text-center truncate w-full">
                      {formatVND(totalRevenue)}
                    </span>
                  </div>

                  {/* Chi phí (Nhập hàng) */}
                  <div className="flex flex-col items-center w-full max-w-[100px]">
                    <div 
                      className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg transition-all duration-1000 shadow-lg shadow-red-500/10"
                      style={{ 
                        height: totalCost > 0 ? `${Math.min(100, (totalCost / Math.max(totalRevenue, totalCost)) * 180)}px` : "10px" 
                      }}
                    />
                    <span className="text-[10px] text-slate-400 mt-2 font-semibold truncate max-w-full text-center block">
                      Chi phí mua
                    </span>
                    <span className="text-[9px] text-red-400 font-bold block text-center truncate w-full">
                      {formatVND(totalCost)}
                    </span>
                  </div>

                  {/* Lợi nhuận gộp */}
                  <div className="flex flex-col items-center w-full max-w-[100px]">
                    <div 
                      className={`w-full bg-gradient-to-t ${grossProfit >= 0 ? "from-blue-600 to-blue-400 shadow-blue-500/10" : "from-red-800 to-red-600 shadow-red-900/10"} rounded-t-lg transition-all duration-1000 shadow-lg`}
                      style={{ 
                        height: Math.abs(grossProfit) > 0 ? `${Math.min(100, (Math.abs(grossProfit) / Math.max(totalRevenue, totalCost)) * 180)}px` : "10px" 
                      }}
                    />
                    <span className="text-[10px] text-slate-400 mt-2 font-semibold truncate max-w-full text-center block">
                      Lợi nhuận gộp
                    </span>
                    <span className={`text-[9px] font-bold block text-center truncate w-full ${grossProfit >= 0 ? "text-blue-400" : "text-red-400"}`}>
                      {formatVND(grossProfit)}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Lịch giao hàng hôm nay (Dành cho Employee/Technician) */}
          {user?.role === "employee" && (
            <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  Nhiệm vụ sửa chữa & lắp đặt được giao
                </span>
                <Link href="/admin/deliveries" className="text-xs text-primary hover:underline">
                  Xem tất cả đơn
                </Link>
              </h3>

              <div className="space-y-3">
                {deliveries.filter((d) => d.assigned_to === user?.id).length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    Bạn chưa có lịch trình nào được giao hôm nay.
                  </div>
                ) : (
                  deliveries
                    .filter((d) => d.assigned_to === user?.id)
                    .map((d) => {
                      const statusColors = {
                        pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
                        shipping: "text-blue-400 bg-blue-400/10 border-blue-400/20",
                        delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
                        failed: "text-red-400 bg-red-400/10 border-red-400/20"
                      };
                      return (
                        <div 
                          key={d.id} 
                          className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >
                          <div>
                            <h4 className="font-semibold text-sm text-slate-200">{d.customer_name}</h4>
                            <p className="text-xs text-slate-400 mt-1">SĐT: {d.customer_phone}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Địa chỉ: {d.address}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColors[d.status]}`}>
                              {d.status === "pending" ? "Đang chờ" 
                               : d.status === "shipping" ? "Đang đi"
                               : d.status === "delivered" ? "Đã lắp" 
                               : "Thất bại"}
                            </span>
                            <Link 
                              href="/admin/deliveries"
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                            >
                              Cập nhật
                            </Link>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )}

          {/* Hoạt động/Giao dịch kho gần đây (Tất cả vai trò) */}
          <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Giao dịch kho gần đây
              </span>
              <Link href="/admin/inventory" className="text-xs text-primary hover:underline">
                Xem chi tiết kho
              </Link>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5">Thời gian</th>
                    <th className="py-2.5">Loại</th>
                    <th className="py-2.5">Sản phẩm</th>
                    <th className="py-2.5 text-right">Số lượng</th>
                    <th className="py-2.5 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-300">
                  {transactions.slice(0, 5).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/20">
                      <td className="py-3">
                        {t.created_at ? new Date(t.created_at).toLocaleDateString("vi-VN") : "Gần đây"}
                      </td>
                      <td className="py-3 font-semibold">
                        {t.type === "import" ? (
                          <span className="text-amber-400 inline-flex items-center gap-0.5">
                            <ArrowDownRight className="w-3.5 h-3.5" /> Nhập
                          </span>
                        ) : (
                          <span className="text-emerald-400 inline-flex items-center gap-0.5">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Xuất
                          </span>
                        )}
                      </td>
                      <td className="py-3 max-w-[150px] truncate">{t.product?.name}</td>
                      <td className="py-3 text-right font-semibold">{t.quantity}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold border whitespace-nowrap inline-block ${
                          t.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : t.status === "pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {t.status === "completed" ? "Hoàn tất" : t.status === "pending" ? "Chờ duyệt" : "Đã huỷ"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Khối bên phải: Việc cần làm gấp & Lọc nhanh quyền hạn */}
        <div className="space-y-6">
          
          {/* Việc cần làm gấp / Chờ duyệt (Dành cho Owner & Manager) */}
          {(user?.role === "owner" || user?.role === "manager") && (
            <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Yêu cầu duyệt kho khẩn cấp
              </h3>
              
              <div className="space-y-3">
                {pendingTransactions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Không có yêu cầu kho nào đang chờ duyệt.</p>
                ) : (
                  pendingTransactions.slice(0, 3).map((t) => (
                    <div key={t.id} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400">
                          {t.type === "import" ? "Yêu cầu NHẬP KHO" : "Yêu cầu XUẤT KHO"}
                        </span>
                        <span className="text-[10px] text-slate-400">Đơn #{t.id}</span>
                      </div>
                      <p className="text-slate-300 font-semibold">{t.product?.name}</p>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Số lượng: {t.quantity} {t.product?.unit}</span>
                        <span>Người tạo: {t.creator?.full_name}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                        <Link 
                          href="/admin/inventory" 
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-[10px]"
                        >
                          Xử lý ngay
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Thông tin Cửa hàng / Hotline hỗ trợ liên kết nhanh */}
          <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Thông tin liên hệ khẩn cấp</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2 bg-slate-900/60 rounded-lg">
                <span className="text-slate-400">Hotline Anh Tâm:</span>
                <strong className="text-white">0989.577.792</strong>
              </div>
              <div className="flex justify-between p-2 bg-slate-900/60 rounded-lg">
                <span className="text-slate-400">Zalo kỹ thuật:</span>
                <strong className="text-white">0932.188.892</strong>
              </div>
              <div className="flex justify-between p-2 bg-slate-900/60 rounded-lg">
                <span className="text-slate-400">Địa chỉ cửa hàng:</span>
                <span className="text-slate-300 font-semibold text-right max-w-[130px] truncate block" title="36 Đường Số 1, Bình Hưng Hòa, Quận Bình Tân">
                  36 Đường Số 1, Bình Tân
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info card về RBAC */}
          <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-2">Quyền Hạn Của Bạn</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bạn đang truy cập với tài khoản có quyền quản trị: <strong className="text-white capitalize">{user?.role}</strong>.
            </p>
            <div className="mt-3 p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-[10px] text-slate-400 space-y-1">
              <p>✔ Quyền xem & tìm kiếm tồn kho</p>
              <p>✔ Quyền xem lịch trình giao nhận</p>
              {user?.role === "owner" && <p>✔ Toàn quyền xem tài chính & quản lý nhân sự</p>}
              {user?.role === "manager" && <p>✔ Duyệt đơn kho & phân công kỹ thuật viên</p>}
              {user?.role === "accountant" && <p>✔ Quản lý tài chính, cập nhật công nợ</p>}
              {user?.role === "employee" && <p>✔ Tạo đề xuất kho, báo cáo đơn giao hàng</p>}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
