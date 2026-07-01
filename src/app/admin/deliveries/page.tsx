"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { dbService, Delivery, User } from "@/lib/dbService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store/useUIStore";
import {
  Truck,
  Plus,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ClipboardList,
  Edit
} from "lucide-react";

export default function DeliveriesPage() {
  const { user } = useAuth();
  const showToast = useUIStore((state) => state.showToast);
  const queryClient = useQueryClient();

  // Queries
  const { data: deliveries = [], isLoading: loadingDeliveries } = useQuery<Delivery[]>({
    queryKey: ["deliveries"],
    queryFn: dbService.getDeliveries
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: dbService.getUsers
  });

  const employees = users.filter((u) => u.role === "employee");
  const loading = loadingDeliveries || loadingUsers;

  // Mutations
  const updateDeliveryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Delivery> }) =>
      dbService.updateDelivery(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      showToast("Cập nhật trạng thái phiếu dịch vụ thành công!", "success");
      setShowStatusModal(false);
    },
    onError: (err: any) => {
      showToast(err.message || "Cập nhật lỗi.", "error");
    }
  });

  const createDeliveryMutation = useMutation({
    mutationFn: dbService.createDelivery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      showToast("Đã tạo phiếu phân công kỹ thuật mới!", "success");
      setShowCreateModal(false);
      resetCreateForm();
    },
    onError: (err: any) => {
      showToast(err.message || "Tạo đơn dịch vụ lỗi.", "error");
    }
  });

  // Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  // Form Status Inputs
  const [statusVal, setStatusVal] = useState<Delivery["status"]>("pending");
  const [statusNotes, setStatusNotes] = useState("");
  const [assignedToVal, setAssignedToVal] = useState("");

  // Form Create Inputs
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  // --- CẬP NHẬT TRẠNG THÁI VÀ PHÂN CÔNG ---
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    const updates: Partial<Delivery> = {
      status: statusVal,
      notes: statusNotes
    };

    // Chỉ có Owner/Manager mới thay đổi kỹ thuật viên phân công
    if (user?.role === "owner" || user?.role === "manager") {
      updates.assigned_to = assignedToVal ? parseInt(assignedToVal) : null;
    }

    updateDeliveryMutation.mutate({ id: selectedDelivery.id, updates });
  };

  // --- KHỞI TẠO ĐƠN DỊCH VỤ / LẮP ĐẶT MỚI ---
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim() || !address.trim()) {
      showToast("Vui lòng nhập tên, số điện thoại và địa chỉ khách hàng.", "error");
      return;
    }

    createDeliveryMutation.mutate({
      customer_name: custName,
      customer_phone: custPhone,
      address: address,
      status: "pending",
      assigned_to: assigneeId ? parseInt(assigneeId) : null,
      notes: notes
    });
  };

  const resetCreateForm = () => {
    setCustName("");
    setCustPhone("");
    setAddress("");
    setNotes("");
    setAssigneeId("");
  };

  const openStatusModal = (del: Delivery) => {
    setSelectedDelivery(del);
    setStatusVal(del.status);
    setStatusNotes(del.notes || "");
    setAssignedToVal(del.assigned_to ? del.assigned_to.toString() : "");
    setShowStatusModal(true);
  };

  const canAssign = user?.role === "owner" || user?.role === "manager";
  // Kỹ thuật viên chỉ được cập nhật đơn giao hàng do chính mình phụ trách (hoặc Owner/Manager được toàn quyền)
  const canUpdateStatus = (del: Delivery) => {
    return user?.role === "owner" || user?.role === "manager" || del.assigned_to === user?.id;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Đang tải danh sách lịch giao lắp...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Lịch trình Vận chuyển & Lắp đặt
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi tiến trình lắp ráp thiết bị, phân công kỹ thuật viên đến tận nhà khách hàng.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              resetCreateForm();
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-primary/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tạo lịch sửa chữa / giao máy
          </button>
        </div>
      </div>

      {/* 2. DELIVERIES BOARD */}
      <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Danh sách phiếu giao việc, lắp ráp & sửa chữa</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3">Mã #</th>
                <th className="py-3">Khách hàng</th>
                <th className="py-3">Địa chỉ giao hàng</th>
                <th className="py-3">Kỹ thuật phụ trách</th>
                <th className="py-3">Nhiệm vụ gốc</th>
                <th className="py-3">Trạng thái</th>
                <th className="py-3">Cập nhật lúc</th>
                <th className="py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500">
                    Không tìm thấy lịch giao nhận nào trong danh sách.
                  </td>
                </tr>
              ) : (
                deliveries.map((d) => {
                  const statusStyles = {
                    pending: "bg-slate-900 text-slate-400 border border-slate-700",
                    shipping: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                    delivered: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                    failed: "bg-red-500/10 text-red-400 border border-red-500/20"
                  };
                  return (
                    <tr key={d.id} className="hover:bg-slate-900/20">
                      <td className="py-4 text-slate-500 font-semibold">#{d.id}</td>
                      <td className="py-4 font-semibold text-white">
                        {d.customer_name}
                        <span className="text-[10px] text-slate-400 block font-normal mt-0.5">SĐT: {d.customer_phone}</span>
                      </td>
                      <td className="py-4 max-w-[200px] truncate" title={d.address}>{d.address}</td>
                      <td className="py-4 font-medium text-slate-200">
                        {d.technician ? (
                          <div className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{d.technician.full_name}</span>
                          </div>
                        ) : (
                          <span className="text-amber-500 font-bold animate-pulse">Chưa phân công</span>
                        )}
                      </td>
                      <td className="py-4 text-slate-400 max-w-[150px] truncate" title={d.notes}>
                        {d.notes || "Yêu cầu dịch vụ trực tiếp"}
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase whitespace-nowrap inline-block ${statusStyles[d.status]}`}>
                          {d.status === "pending" ? "Đang chờ" 
                           : d.status === "shipping" ? "Đang đi đường" 
                           : d.status === "delivered" ? "Đã lắp đặt" 
                           : "Thất bại"}
                        </span>
                      </td>
                      <td className="py-4 text-slate-400">
                        {d.created_at ? new Date(d.created_at).toLocaleDateString("vi-VN") : "Gần đây"}
                      </td>
                      <td className="py-4 text-center">
                        {canUpdateStatus(d) ? (
                          <button
                            onClick={() => openStatusModal(d)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Cập nhật
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[10px]" title="Chỉ kỹ thuật phụ trách mới được cập nhật">Không phận sự</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: CẬP NHẬT TRẠNG THÁI & PHÂN CÔNG --- */}
      {showStatusModal && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-card bg-[#0a1931]/95 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in text-slate-100">
            <h3 className="text-lg font-bold text-white mb-3 border-b border-slate-800 pb-3">
              Cập nhật phiếu dịch vụ #{selectedDelivery.id}
            </h3>

            <div className="mb-4 bg-slate-950/40 p-3 rounded-xl space-y-1.5 text-xs text-slate-300">
              <p>Khách hàng: <strong className="text-white">{selectedDelivery.customer_name}</strong></p>
              <p>Địa chỉ: <span>{selectedDelivery.address}</span></p>
              <p>Công việc: <span className="italic">"{selectedDelivery.notes || "Không có ghi chú"}"</span></p>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Phân công kỹ thuật (Chỉ dành cho Owner/Manager) */}
              {canAssign && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Phân công kỹ thuật viên</label>
                  <select
                    value={assignedToVal}
                    onChange={(e) => setAssignedToVal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="">-- Chưa chỉ định ai --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} ({emp.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Trạng thái đơn hàng */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Trạng thái công việc *</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as Delivery["status"])}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-semibold"
                >
                  <option value="pending" className="text-slate-400 font-semibold">Đang chờ xử lý</option>
                  <option value="shipping" className="text-blue-400 font-semibold">Đang vận chuyển máy / đi đường</option>
                  <option value="delivered" className="text-emerald-400 font-semibold">Đã hoàn thành lắp ráp & kiểm tra</option>
                  <option value="failed" className="text-red-400 font-semibold">Giao hàng thất bại / Hẹn lịch lại</option>
                </select>
              </div>

              {/* Ghi chú báo cáo */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Báo cáo kết quả / Cập nhật tiến trình</label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Ví dụ: Đã đến nhà khách, đang bắt đầu lắp máy Daikin / Máy đã lạnh sâu, khách thanh toán tiền mặt..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-750"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/20"
                >
                  Cập nhật phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: TẠO PHIẾU GIAO VIỆC MỚI --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-card bg-[#0a1931]/95 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">
              Tạo phiếu giao việc mới
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tên khách hàng *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Thị Hoa..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="09xx..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Chỉ định kỹ thuật viên</label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="">-- Chưa chỉ định ai --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} ({emp.phone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Địa chỉ khách hàng *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, Tên đường, Quận, TP.HCM..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Nội dung công việc (Sản phẩm giao / Lỗi sửa)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Vận chuyển máy lạnh Daikin 1HP và lắp ráp phòng khách. Khách hẹn trước 5h chiều..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
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
                  Khởi tạo phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
