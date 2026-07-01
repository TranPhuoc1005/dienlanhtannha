"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { dbService, Product, Transaction } from "@/lib/dbService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store/useUIStore";
import {
  Package,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign
} from "lucide-react";

export default function InventoryPage() {
  const { user } = useAuth();
  const showToast = useUIStore((state) => state.showToast);
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

  const loading = loadingProducts || loadingTransactions;

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: dbService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast("Đã thêm sản phẩm mới vào danh mục!", "success");
      setShowProductModal(false);
      resetProductForm();
    },
    onError: (err: any) => {
      showToast(err.message || "Lỗi thêm sản phẩm.", "error");
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Product> }) =>
      dbService.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast("Đã cập nhật thông tin sản phẩm thành công!", "success");
      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
    },
    onError: (err: any) => {
      showToast(err.message || "Lỗi cập nhật sản phẩm.", "error");
    }
  });

  const createTxMutation = useMutation({
    mutationFn: dbService.createTransaction,
    onSuccess: (newTx) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      showToast(
        newTx.status === "completed"
          ? "Giao dịch đã hoàn tất và tồn kho đã được cập nhật!"
          : "Yêu cầu giao dịch đã được gửi và đang chờ phê duyệt.",
        "success"
      );
      setShowTxModal(false);
      resetTxForm();
    },
    onError: (err: any) => {
      showToast(err.message || "Lỗi tạo giao dịch.", "error");
    }
  });

  const approveTxMutation = useMutation({
    mutationFn: ({ id, approvedBy }: { id: number; approvedBy: number }) =>
      dbService.updateTransactionStatus(id, "completed", approvedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      showToast("Đã duyệt giao dịch thành công. Tồn kho đã được đồng bộ!", "success");
    },
    onError: (err: any) => {
      showToast(err.message || "Lỗi duyệt đơn.", "error");
    }
  });

  const cancelTxMutation = useMutation({
    mutationFn: ({ id, approvedBy }: { id: number; approvedBy: number }) =>
      dbService.updateTransactionStatus(id, "cancelled", approvedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      showToast("Đã hủy bỏ yêu cầu giao dịch kho này.", "success");
    },
    onError: (err: any) => {
      showToast(err.message || "Lỗi hủy đơn.", "error");
    }
  });

  // States for Modals/Forms
  const [showProductModal, setShowProductModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Inputs
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState<Product["category"]>("Máy Lạnh");
  const [prodPrice, setProdPrice] = useState("");
  const [prodImportPrice, setProdImportPrice] = useState("");
  const [prodStock, setProdStock] = useState("0");
  const [prodUnit, setProdUnit] = useState("Cái");
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [txType, setTxType] = useState<"import" | "export">("import");
  const [txProductId, setTxProductId] = useState<number>(0);
  const [txQuantity, setTxQuantity] = useState("1");
  const [txPrice, setTxPrice] = useState("");
  const [txNotes, setTxNotes] = useState("");

  // Sync default txProductId when products load
  useEffect(() => {
    if (products.length > 0 && !txProductId) {
      setTxProductId(products[0].id);
      setTxPrice(products[0].import_price.toString());
    }
  }, [products, txProductId]);

  // Sync default price when transaction product selection changes
  useEffect(() => {
    if (txProductId > 0) {
      const selected = products.find((p) => p.id === txProductId);
      if (selected) {
        setTxPrice(txType === "import" ? selected.import_price.toString() : selected.price.toString());
      }
    }
  }, [txProductId, txType, products]);

  // --- SUBMIT PRODUCT (ADD / EDIT) ---
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice || !prodImportPrice || !prodUnit) {
      showToast("Vui lòng nhập đầy đủ các trường bắt buộc.", "error");
      return;
    }

    const price = parseFloat(prodPrice);
    const importPrice = parseFloat(prodImportPrice);
    const stock = parseInt(prodStock);

    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct.id,
        updates: {
          name: prodName,
          category: prodCategory,
          price,
          import_price: importPrice,
          stock,
          unit: prodUnit,
          image_url: prodImages.join(", ")
        }
      });
    } else {
      createProductMutation.mutate({
        name: prodName,
        category: prodCategory,
        price,
        import_price: importPrice,
        stock,
        unit: prodUnit,
        image_url: prodImages.join(", ")
      });
    }
  };

  const resetProductForm = () => {
    setProdName("");
    setProdCategory("Máy Lạnh");
    setProdPrice("");
    setProdImportPrice("");
    setProdStock("0");
    setProdUnit("Cái");
    setProdImages([]);
    setNewImageUrl("");
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdPrice(prod.price.toString());
    setProdImportPrice(prod.import_price.toString());
    setProdStock(prod.stock.toString());
    setProdUnit(prod.unit);
    const urls = prod.image_url ? prod.image_url.split(/(?<!base64),/).map(url => url.trim()).filter(Boolean) : [];
    setProdImages(urls);
    setNewImageUrl("");
    setShowProductModal(true);
  };

  // --- SUBMIT TRANSACTION (IMPORT/EXPORT REQUEST) ---
  const handleTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (txProductId <= 0 || !txQuantity || !txPrice) {
      showToast("Vui lòng chọn sản phẩm và nhập số lượng.", "error");
      return;
    }

    const quantity = parseInt(txQuantity);
    const price = parseFloat(txPrice);
    const product = products.find((p) => p.id === txProductId);

    if (!product) {
      showToast("Sản phẩm không hợp lệ", "error");
      return;
    }

    // Nếu là xuất kho, kiểm tra xem tồn kho có đủ không
    if (txType === "export" && product.stock < quantity) {
      showToast(`Kho hàng không đủ tồn kho. Tồn kho hiện tại: ${product.stock} ${product.unit}`, "error");
      return;
    }

    // Đối với Owner/Manager, đơn tạo trực tiếp ở trạng thái Completed
    // Đối với Employee/Accountant, đơn tạo ở trạng thái Pending chờ duyệt
    const status: Transaction["status"] = (user?.role === "owner" || user?.role === "manager") ? "completed" : "pending";

    createTxMutation.mutate({
      type: txType,
      product_id: txProductId,
      quantity,
      price,
      status,
      created_by: user!.id,
      approved_by: status === "completed" ? user!.id : null,
      notes: txNotes
    });
  };

  const resetTxForm = () => {
    if (products.length > 0) {
      setTxProductId(products[0].id);
      setTxPrice(txType === "import" ? products[0].import_price.toString() : products[0].price.toString());
    }
    setTxQuantity("1");
    setTxNotes("");
  };

  // --- APPROVE / CANCEL TRANSACTION ---
  const handleApproveTx = (txId: number) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    // Nếu xuất kho, kiểm tra tồn kho trước khi duyệt
    if (tx.type === "export") {
      const prod = products.find((p) => p.id === tx.product_id);
      if (prod && prod.stock < tx.quantity) {
        showToast(`Không thể duyệt! Kho hàng chỉ còn ${prod.stock} ${prod.unit} trong khi yêu cầu xuất ${tx.quantity}.`, "error");
        return;
      }
    }

    approveTxMutation.mutate({ id: txId, approvedBy: user!.id });
  };

  const handleCancelTx = (txId: number) => {
    cancelTxMutation.mutate({ id: txId, approvedBy: user!.id });
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  const canEdit = user?.role === "owner" || user?.role === "manager";
  const canApprove = user?.role === "owner" || user?.role === "manager";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Đang tải thông tin kho hàng...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Quản lý Kho hàng & Tồn kho
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tra cứu sản phẩm, chỉnh sửa danh mục và gửi yêu cầu nhập/xuất kho.
          </p>
        </div>

        {/* Buttons Action */}
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <button
              onClick={() => {
                setEditingProduct(null);
                resetProductForm();
                setShowProductModal(true);
              }}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-primary/10 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Thêm sản phẩm mới
            </button>
          )}
          <button
            onClick={() => {
              resetTxForm();
              setShowTxModal(true);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Yêu cầu Nhập / Xuất kho
          </button>
        </div>
      </div>

      {/* 2. PRODUCTS TABLE / LIST */}
      <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden p-6">
        <h3 className="text-base font-bold text-white mb-4">Danh mục thiết bị điện lạnh tồn kho</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-bold text-slate-300">ID</th>
                <th className="py-3 px-4 font-bold text-slate-300">Tên sản phẩm</th>
                <th className="py-3 px-4 font-bold text-slate-300">Phân loại</th>
                <th className="py-3 px-4 text-right font-bold text-slate-300">Giá bán</th>
                <th className="py-3 px-4 text-right font-bold text-slate-300">Giá nhập vốn</th>
                <th className="py-3 px-4 text-center font-bold text-slate-300">Tồn kho</th>
                <th className="py-3 px-4 text-center font-bold text-slate-300">Đơn vị</th>
                {canEdit && <th className="py-3 px-4 text-center font-bold text-slate-300">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/20">
                  <td className="py-3.5 px-4 text-slate-500 font-semibold">{p.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-3 py-1">
                      {(() => {
                        const urls = p.image_url ? p.image_url.split(/(?<!base64),/).map(url => url.trim()).filter(Boolean) : [];
                        const firstUrl = urls[0];
                        return firstUrl ? (
                          <img
                            src={firstUrl}
                            alt={p.name}
                            className="w-12 h-12 object-contain rounded-lg bg-slate-800 p-1 border border-slate-700 shrink-0 shadow-inner"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 shrink-0 font-medium">
                            Không ảnh
                          </div>
                        );
                      })()}
                      <span className="font-bold text-slate-100 hover:text-primary transition-colors text-sm md:text-base">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-emerald-400">{formatVND(p.price)}</td>
                  <td className="py-3.5 px-4 text-right text-slate-400">{formatVND(p.import_price)}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.stock === 0 ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : p.stock <= 5 ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-400">{p.unit}</td>
                  {canEdit && (
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => openEditProduct(p)}
                        className="text-sm text-primary hover:underline font-semibold"
                      >
                        Sửa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. TRANSACTION HISTORY & APPROVALS */}
      <div className="glass-card bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Lịch sử giao dịch kho & Trạng thái duyệt</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-bold text-slate-300">Đơn #</th>
                <th className="py-3 px-4 font-bold text-slate-300">Thời gian</th>
                <th className="py-3 px-4 font-bold text-slate-300">Loại</th>
                <th className="py-3 px-4 font-bold text-slate-300">Sản phẩm</th>
                <th className="py-3 px-4 text-right font-bold text-slate-300">Số lượng</th>
                <th className="py-3 px-4 text-right font-bold text-slate-300">Đơn giá</th>
                <th className="py-3 px-4 text-right font-bold text-slate-300">Thành tiền</th>
                <th className="py-3 px-4 font-bold text-slate-300">Người yêu cầu</th>
                <th className="py-3 px-4 text-center font-bold text-slate-300">Trạng thái</th>
                {canApprove && <th className="py-3 px-4 text-center font-bold text-slate-300">Phê duyệt</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/20">
                  <td className="py-4 px-4 text-slate-500 font-semibold">#{t.id}</td>
                  <td className="py-4 px-4 text-slate-400">
                    {t.created_at ? new Date(t.created_at).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "Vừa xong"}
                  </td>
                  <td className="py-4 px-4 font-semibold">
                    {t.type === "import" ? (
                      <span className="text-amber-400 inline-flex items-center gap-0.5">
                        <ArrowDownLeft className="w-4.5 h-4.5" /> Nhập kho
                      </span>
                    ) : (
                      <span className="text-emerald-400 inline-flex items-center gap-0.5">
                        <ArrowUpRight className="w-4.5 h-4.5" /> Xuất kho
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 max-w-[200px] truncate" title={t.product?.name}>{t.product?.name}</td>
                  <td className="py-4 px-4 text-right font-bold">{t.quantity} {t.product?.unit}</td>
                  <td className="py-4 px-4 text-right">{formatVND(t.price)}</td>
                  <td className="py-4 px-4 text-right font-bold text-white">{formatVND(t.total_amount)}</td>
                  <td className="py-4 px-4 text-slate-400">
                    {t.creator?.full_name} <span className="text-xs block text-slate-500">({t.creator?.role})</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-[4px] text-xs font-bold border whitespace-nowrap inline-block ${
                      t.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : t.status === "pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {t.status === "completed" ? "Đã duyệt" : t.status === "pending" ? "Chờ duyệt" : "Đã huỷ"}
                    </span>
                  </td>
                  {canApprove && (
                    <td className="py-4 px-4 text-center">
                      {t.status === "pending" ? (
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => handleApproveTx(t.id)}
                            className="p-1 text-emerald-400 hover:bg-emerald-950/40 rounded border border-emerald-500/30 transition-colors"
                            title="Duyệt giao dịch"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancelTx(t.id)}
                            className="p-1 text-red-400 hover:bg-red-950/40 rounded border border-red-500/30 transition-colors"
                            title="Huỷ bỏ yêu cầu"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs">-</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: ADD / EDIT PRODUCT --- */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-card bg-[#0a1931]/95 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">
              {editingProduct ? "Chỉnh sửa thông số sản phẩm" : "Đăng ký sản phẩm mới"}
            </h3>

             <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ví dụ: Máy lạnh Toshiba Inverter 1.5 HP..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Danh sách hình ảnh sản phẩm *</label>
                
                {/* Images grid preview */}
                <div className="grid grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 min-h-[90px]">
                  {prodImages.length === 0 ? (
                    <div className="col-span-4 flex items-center justify-center text-slate-500 text-xs py-4">
                      Chưa có hình ảnh nào. Chọn ảnh mẫu dưới đây hoặc tự nhập URL.
                    </div>
                  ) : (
                    prodImages.map((img, idx) => (
                      <div key={idx} className="relative w-full aspect-square bg-slate-800 border border-slate-700 rounded-xl p-1 flex items-center justify-center group overflow-hidden shadow-inner">
                        <img src={img} alt={`img-${idx}`} className="w-full h-full object-contain" />
                        
                        {/* Overlay delete button */}
                        <button
                          type="button"
                          onClick={() => setProdImages(prodImages.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                          title="Xóa hình ảnh"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        {/* Thumbnail indicator / Set as Main button */}
                        {idx === 0 ? (
                          <span className="absolute bottom-1 left-1 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                            Ảnh chính
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const newImgs = [prodImages[idx], ...prodImages.filter((_, i) => i !== idx)];
                              setProdImages(newImgs);
                            }}
                            className="absolute bottom-1 left-1 right-1 bg-slate-950/80 hover:bg-primary text-white text-[8px] font-bold py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-center"
                          >
                            Làm ảnh chính
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Upload Image from Computer / URL Input */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Thêm hình ảnh mới:</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* File Upload Button */}
                    <label className="relative flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-750 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer select-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>Tải ảnh từ máy</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert("Kích thước ảnh quá lớn (Vui lòng chọn ảnh < 2MB để lưu vào hệ thống).");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              if (base64) {
                                setProdImages([...prodImages, base64]);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {/* URL Input field */}
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Dán URL hình ảnh mới..."
                        className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newImageUrl.trim()) {
                            setProdImages([...prodImages, newImageUrl.trim()]);
                            setNewImageUrl("");
                          }
                        }}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      >
                        Thêm URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Presets options */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gợi ý ảnh mẫu (Click để chọn nhanh):</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Máy lạnh Daikin", url: "/products/ml-daikin.png" },
                      { name: "Máy lạnh Panasonic", url: "/products/ml-panasonic.png" },
                      { name: "Tủ lạnh Panasonic", url: "/products/tl-panasonic.png" },
                      { name: "Máy giặt LG", url: "/products/mg-lg.png" },
                      { name: "Tủ đông Aqua", url: "/products/td-aqua.png" },
                      { name: "Máy nước nóng", url: "/products/mn-ariston.png" }
                    ].map((preset) => {
                      const isAdded = prodImages.includes(preset.url);
                      return (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              setProdImages(prodImages.filter(url => url !== preset.url));
                            } else {
                              setProdImages([...prodImages, preset.url]);
                            }
                          }}
                          className={`flex items-center gap-1.5 p-1 px-2.5 rounded-xl border text-[11px] font-medium transition-all cursor-pointer ${
                            isAdded
                              ? "bg-primary/20 text-white border-primary/40"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-300"
                          }`}
                        >
                          <img src={preset.url} className="w-5 h-5 object-contain" />
                          <span>{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Danh mục *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as Product["category"])}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Máy Lạnh">Máy Lạnh</option>
                    <option value="Tủ Lạnh">Tủ Lạnh</option>
                    <option value="Máy Giặt">Máy Giặt</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Đơn vị tính *</label>
                  <input
                    type="text"
                    required
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="Bộ / Cái..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Giá bán đề xuất (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="Ví dụ: 8500000"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Giá nhập vốn (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={prodImportPrice}
                    onChange={(e) => setProdImportPrice(e.target.value)}
                    placeholder="Ví dụ: 6800000"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tồn kho khởi tạo *</label>
                <input
                  type="number"
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-750 transition-colors"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/20 transition-colors"
                >
                  {editingProduct ? "Cập nhật sản phẩm" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: IMPORT / EXPORT TRANSACTION REQUEST --- */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-card bg-[#0a1931]/95 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">
              Yêu cầu giao dịch xuất / nhập kho
            </h3>

            <form onSubmit={handleTxSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Loại giao dịch *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType("import")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      txType === "import"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850"
                    }`}
                  >
                    Nhập kho hàng
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType("export")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      txType === "export"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850"
                    }`}
                  >
                    Xuất bán hàng
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Chọn sản phẩm *</label>
                <select
                  value={txProductId}
                  onChange={(e) => setTxProductId(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Tồn: {p.stock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Số lượng *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={txQuantity}
                    onChange={(e) => setTxQuantity(e.target.value)}
                    placeholder="1"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Đơn giá áp dụng (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={txPrice}
                    onChange={(e) => setTxPrice(e.target.value)}
                    placeholder="Ví dụ: 6800000"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Ghi chú lý do giao dịch</label>
                <textarea
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  placeholder="Ví dụ: Nhập hàng bổ sung đợt hè / Bán hàng lắp đặt cho Anh Huy..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Message warning about permissions */}
              <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-[10px] text-slate-400">
                ⚠️ {(user?.role === "owner" || user?.role === "manager")
                  ? "Bạn đăng nhập bằng quyền Chủ/Quản lý: giao dịch này sẽ tự động DUYỆT HOÀN TẤT và đồng bộ tồn kho ngay sau khi tạo."
                  : "Bạn đăng nhập bằng quyền Nhân viên: giao dịch này sẽ ở trạng thái CHỜ DUYỆT, cần Chủ cửa hàng hoặc Quản lý phê duyệt để đồng bộ."}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTxModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-750 transition-colors"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/20 transition-colors"
                >
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
