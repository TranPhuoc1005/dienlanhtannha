"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { dbService, Debt } from "@/lib/dbService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store/useUIStore";
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  AlertOctagon
} from "lucide-react";
import Link from "next/link";

export default function DebtsPage() {
  const { user } = useAuth();
  const showToast = useUIStore((state) => state.showToast);
  const queryClient = useQueryClient();
  
  const [filterType, setFilterType] = useState<"all" | "receivable" | "payable">("all");

  // State Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

  // Form Inputs
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  const [partyName, setPartyName] = useState("");
  const [partyType, setPartyType] = useState<"customer" | "supplier">("customer");
  const [debtType, setDebtType] = useState<"receivable" | "payable">("receivable");
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("0");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  // --- KIỂM TRA QUYỀN HẠN TRUY CẬP (RBAC) ---
  const isAuthorized = user?.role === "owner" || user?.role === "manager" || user?.role === "accountant";
  const canModify = user?.role === "owner" || user?.role === "accountant";

  // Queries
  const { data: debts = [], isLoading: loadingDebts } = useQuery<Debt[]>({
    queryKey: ["debts"],
    queryFn: dbService.getDebts,
    enabled: isAuthorized
  });

  // Mutations
  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, payVal }: { id: number; payVal: number }) =>
      dbService.updateDebtPayment(id, payVal),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      showToast(`Đã ghi nhận thanh toán thành công số tiền ${formatVND(variables.payVal)}!`, "success");
      setShowPaymentModal(false);
      setPaymentAmount("");
    },
    onError: (err: any) => {
      showToast(err.message || "Lỗi ghi nhận.", "error");
    }
  });

  const createDebtMutation = useMutation({
    mutationFn: dbService.createDebt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      showToast("Đã khởi tạo phiếu theo dõi nợ mới thành công!", "success");
      setShowCreateModal(false);
      resetCreateForm();
    },
    onError: (err: any) => {
      showToast(err.message || "Lỗi tạo phiếu nợ.", "error");
    }
  });

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white">Truy cập bị từ chối</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          Phân hệ theo dõi công nợ nội bộ chỉ dành cho các vai trò quản trị. Nhân viên kỹ thuật không có quyền truy cập.
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

  if (loadingDebts) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Đang tổng hợp sổ nợ...</span>
      </div>
    );
  }

  // --- GHI NHẬN THANH TOÁN KHOẢN NỢ ---
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebt || !paymentAmount) return;

    const payVal = parseFloat(paymentAmount);
    if (payVal <= 0 || payVal > selectedDebt.remaining_amount) {
      showToast("Số tiền thanh toán phải lớn hơn 0 và không vượt quá dư nợ còn lại.", "error");
      return;
    }

    updatePaymentMutation.mutate({ id: selectedDebt.id, payVal });
  };

  // --- TẠO HỒ SƠ CÔNG NỢ MỚI ---
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName.trim() || !amount) {
      showToast("Vui lòng điền tên đối tác và số nợ.", "error");
      return;
    }

    const debtAmount = parseFloat(amount);
    const paidVal = parseFloat(paidAmount);

    createDebtMutation.mutate({
      party_name: partyName,
      party_type: partyType,
      type: debtType,
      amount: debtAmount,
      paid_amount: paidVal,
      due_date: dueDate || undefined,
      notes: notes
    });
  };

  const resetCreateForm = () => {
    setPartyName("");
    setPartyType("customer");
    setDebtType("receivable");
    setAmount("");
    setPaidAmount("0");
    setDueDate("");
    setNotes("");
  };

  const openPaymentModal = (debt: Debt) => {
    setSelectedDebt(debt);
    setPaymentAmount(debt.remaining_amount.toString());
    setShowPaymentModal(true);
  };

  function formatVND(num: number) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  }

  // --- TÍNH TOÁN CÁC KPI NỢ ---
  const filteredDebts = debts.filter((d) => {
    if (filterType === "receivable") return d.type === "receivable";
    if (filterType === "payable") return d.type === "payable";
    return true;
  });

  const totalReceivables = debts
    .filter((d) => d.type === "receivable")
    .reduce((acc, curr) => acc + curr.remaining_amount, 0);

  const totalPayables = debts
    .filter((d) => d.type === "payable")
    .reduce((acc, curr) => acc + curr.remaining_amount, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Quản lý Công nợ Đối tác
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi khoản phải thu từ Khách hàng và phải trả cho Nhà cung cấp sỉ lẻ.
          </p>
        </div>

        <div className="flex gap-2">
          {canModify && (
            <button
              onClick={() => {
                resetCreateForm();
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-primary/10 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Tạo phiếu ghi nợ mới
            </button>
          )}
        </div>
      </div>

      {/* 2. STATS SUMMARIES CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Khối nợ cần thu */}
        <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Nợ phải thu (Từ Khách hàng)</span>
            <h2 className="text-2xl font-bold text-emerald-400 mt-1.5">{formatVND(totalReceivables)}</h2>
            <span className="text-[10px] text-slate-500 mt-2 inline-block">Khách hàng mua hàng trả chậm</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* Khối nợ phải trả */}
        <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Nợ phải trả (Cho Nhà phân phối)</span>
            <h2 className="text-2xl font-bold text-red-400 mt-1.5">{formatVND(totalPayables)}</h2>
            <span className="text-[10px] text-slate-500 mt-2 inline-block">Nợ tiền hàng nhập kho chưa trả hết</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. FILTER TABS & DEBTS TABLE */}
      <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        
        {/* Tabs Filter */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6 border-b border-slate-800 pb-4">
          <div className="flex bg-slate-900 border border-slate-850 rounded-xl p-1">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Tất cả sổ nợ
            </button>
            <button
              onClick={() => setFilterType("receivable")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "receivable" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:text-white"
              }`}
            >
              Phải thu (Khách hàng)
            </button>
            <button
              onClick={() => setFilterType("payable")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "payable" ? "bg-red-500/20 text-red-300" : "text-slate-400 hover:text-white"
              }`}
            >
              Phải trả (Nhà cung cấp)
            </button>
          </div>

          <span className="text-xs text-slate-400 font-semibold">
            Đang hiển thị: {filteredDebts.length} đối tác
          </span>
        </div>

        {/* Debts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3">Đối tác</th>
                <th className="py-3">Phân loại</th>
                <th className="py-3">Hướng nợ</th>
                <th className="py-3 text-right">Tổng khoản</th>
                <th className="py-3 text-right">Đã thanh toán</th>
                <th className="py-3 text-right">Còn nợ lại</th>
                <th className="py-3 text-center">Hạn nợ</th>
                <th className="py-3 text-center">Trạng thái</th>
                {canModify && <th className="py-3 text-center">Ghi nhận</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {filteredDebts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-slate-500">
                    Không có khoản công nợ nào cần hiển thị.
                  </td>
                </tr>
              ) : (
                filteredDebts.map((d) => {
                  const statusBadges = {
                    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    partially_paid: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    unpaid: "bg-red-500/10 text-red-400 border-red-500/20"
                  };
                  return (
                    <tr key={d.id} className="hover:bg-slate-900/20">
                      <td className="py-4 font-semibold text-white">
                        {d.party_name}
                        {d.notes && <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{d.notes}</span>}
                      </td>
                      <td className="py-4">
                        {d.party_type === "customer" ? (
                          <span className="text-xs text-slate-300">Khách hàng</span>
                        ) : (
                          <span className="text-xs text-slate-300">Nhà cung cấp sỉ</span>
                        )}
                      </td>
                      <td className="py-4">
                        {d.type === "receivable" ? (
                          <span className="text-emerald-400 font-semibold inline-flex items-center gap-0.5">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Phải thu
                          </span>
                        ) : (
                          <span className="text-red-400 font-semibold inline-flex items-center gap-0.5">
                            <ArrowDownRight className="w-3.5 h-3.5" /> Phải trả
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right font-semibold">{formatVND(d.amount)}</td>
                      <td className="py-4 text-right text-slate-400">{formatVND(d.paid_amount)}</td>
                      <td className="py-4 text-right font-bold text-white">{formatVND(d.remaining_amount)}</td>
                      <td className="py-4 text-center text-slate-400">
                        {d.due_date ? new Date(d.due_date).toLocaleDateString("vi-VN") : "Không thời hạn"}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold border whitespace-nowrap inline-block ${statusBadges[d.status]}`}>
                          {d.status === "paid" ? "Đã trả hết" : d.status === "partially_paid" ? "Trả một phần" : "Chưa trả"}
                        </span>
                      </td>
                      {canModify && (
                        <td className="py-4 text-center">
                          {d.status !== "paid" ? (
                            <button
                              onClick={() => openPaymentModal(d)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
                            >
                              Thu/Trả nợ
                            </button>
                          ) : (
                            <span className="text-slate-500 text-[10px]">-</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* --- MODAL 1: RECORD PAYMENT (THU / TRẢ NỢ) --- */}
      {showPaymentModal && selectedDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-card bg-[#0a1931]/95 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in text-slate-100">
            <h3 className="text-lg font-bold text-white mb-3 border-b border-slate-800 pb-3">
              Ghi nhận thanh toán công nợ
            </h3>

            <div className="mb-4 bg-slate-950/40 p-3 rounded-xl space-y-1.5 text-xs text-slate-300">
              <p>Đối tác: <strong className="text-white">{selectedDebt.party_name}</strong></p>
              <p>Hướng nợ: <strong>{selectedDebt.type === "receivable" ? "Phải thu từ khách" : "Phải trả NCC"}</strong></p>
              <p>Tổng nợ: <span className="font-semibold">{formatVND(selectedDebt.amount)}</span></p>
              <p>Còn nợ lại: <span className="font-bold text-white">{formatVND(selectedDebt.remaining_amount)}</span></p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Số tiền thanh toán lần này (VNĐ) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={selectedDebt.remaining_amount}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-750 transition-colors"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/20 transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CREATE DEBT TICKET --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-card bg-[#0a1931]/95 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">
              Khởi tạo hồ sơ nợ mới
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tên đối tác ghi nợ *</label>
                <input
                  type="text"
                  required
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="Ví dụ: Đại lý phân phối Daikin Sài Gòn / Nguyễn Văn A..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Vai trò đối tác *</label>
                  <select
                    value={partyType}
                    onChange={(e) => setPartyType(e.target.value as "customer" | "supplier")}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="customer">Khách hàng</option>
                    <option value="supplier">Nhà cung cấp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Hướng nợ áp dụng *</label>
                  <select
                    value={debtType}
                    onChange={(e) => setDebtType(e.target.value as "receivable" | "payable")}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="receivable">Phải thu (Họ nợ ta)</option>
                    <option value="payable">Phải trả (Ta nợ họ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tổng số tiền nợ *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Nhập số tiền..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Đã thanh toán trước</label>
                  <input
                    type="number"
                    required
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Hạn thanh toán</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Mô tả/Chi tiết</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Lý do nợ..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-750 transition-colors"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/20 transition-colors"
                >
                  Khởi tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
