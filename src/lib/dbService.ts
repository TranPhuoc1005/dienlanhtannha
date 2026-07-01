import { supabase, hasSupabaseConfig } from "./supabaseClient";

// 1. ĐỊNH NGHĨA PHÂN LOẠI DỮ LIỆU
export interface User {
  id: number;
  username: string;
  full_name: string;
  role: "owner" | "manager" | "accountant" | "employee";
  phone?: string;
  avatar_url?: string;
  password?: string;
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  category: "Máy Lạnh" | "Tủ Lạnh" | "Máy Giặt" | "Khác";
  price: number;
  import_price: number;
  stock: number;
  unit: string;
  image_url?: string;
  status?: string;
  badge?: string;
  desc?: string;
  created_at?: string;
}

export interface Transaction {
  id: number;
  type: "import" | "export";
  product_id: number;
  quantity: number;
  price: number;
  total_amount: number;
  status: "pending" | "completed" | "cancelled";
  created_by: number;
  approved_by?: number | null;
  notes?: string;
  created_at?: string;
  // Resolved fields
  product?: Product;
  creator?: User;
  approver?: User | null;
}

export interface Debt {
  id: number;
  party_name: string;
  party_type: "customer" | "supplier";
  type: "receivable" | "payable";
  amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: "unpaid" | "partially_paid" | "paid";
  due_date?: string;
  notes?: string;
  created_at?: string;
}

export interface Delivery {
  id: number;
  transaction_id?: number | null;
  customer_name: string;
  customer_phone: string;
  address: string;
  status: "pending" | "shipping" | "delivered" | "failed";
  assigned_to?: number | null;
  notes?: string;
  created_at?: string;
  // Resolved fields
  technician?: User | null;
  transaction?: Transaction | null;
}

// 2. DỮ LIỆU MẪU (SEED DATA)
const SEED_USERS: User[] = [
  { id: 1, username: "chu_tam", full_name: "Nguyễn Đức Tâm", role: "owner", phone: "0989577792", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=tam" },
  { id: 2, username: "quanly_quang", full_name: "Trần Huy Quang", role: "manager", phone: "0932188892", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=quang" },
  { id: 3, username: "ketoan_lan", full_name: "Phạm Thị Lan", role: "accountant", phone: "0977443322", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=lan" },
  { id: 4, username: "nhanvien_dung", full_name: "Lê Anh Dũng", role: "employee", phone: "0966554433", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=dung" },
  { id: 5, username: "nhanvien_thanh", full_name: "Vũ Văn Thanh", role: "employee", phone: "0955667788", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=thanh" }
];

const SEED_PRODUCTS: Product[] = [
  { id: 1, name: "Máy lạnh Daikin Inverter 1 HP FTKB25WAVMV", category: "Máy Lạnh", price: 8500000, import_price: 6800000, stock: 15, unit: "Bộ", image_url: "/products/ml-daikin.png, /products/ml-panasonic.png", status: "Mới 95%", badge: "Bán chạy", desc: "Máy lạnh chạy êm ái, tiết kiệm điện năng vượt trội, thích hợp cho phòng 15 - 20 m2." },
  { id: 2, name: "Máy lạnh Panasonic Inverter 1.5 HP CU/CS-PU12AKH-8", category: "Máy Lạnh", price: 11200000, import_price: 9100000, stock: 8, unit: "Bộ", image_url: "/products/ml-panasonic.png, /products/ml-daikin.png", status: "Mới 90%", badge: "Giá Rẻ", desc: "Bộ lọc kháng khuẩn Nanoe-G lọc sạch bụi mịn PM2.5, phù hợp phòng ngủ nhỏ dưới 15 m2." },
  { id: 3, name: "Tủ lạnh Panasonic Inverter 322 lít NR-BC360QKVN", category: "Tủ Lạnh", price: 14500000, import_price: 11800000, stock: 5, unit: "Cái", image_url: "/products/tl-panasonic.png, /products/td-aqua.png", status: "Mới 98%", badge: "Tiết Kiệm Điện", desc: "Công nghệ đông mềm Prime Fresh+ giữ thực phẩm tươi ngon suốt 7 ngày không cần rã đông." },
  { id: 4, name: "Máy giặt LG AI DD Inverter 9 kg FV1409S4W", category: "Máy Giặt", price: 7900000, import_price: 6100000, stock: 10, unit: "Cái", image_url: "/products/mg-lg.png, /products/td-aqua.png", status: "Mới 99%", badge: "Giá Cực Tốt", desc: "Hệ thống truyền động trực tiếp AI DD bảo vệ sợi vải tối ưu, hoạt động cực kỳ êm ái." },
  { id: 5, name: "Tủ đông Aqua Inverter 300 lít AQF-C4201E", category: "Khác", price: 6800000, import_price: 5400000, stock: 4, unit: "Cái", image_url: "/products/td-aqua.png, /products/tl-panasonic.png", status: "Mới 97%", badge: "Đông Sâu", desc: "Làm lạnh 3D nhanh sâu xuống -24°C, thích hợp cho việc tích trữ sữa, thịt cá lâu ngày." },
  { id: 6, name: "Máy nước nóng Ariston Aures Premium 4.5P", category: "Khác", price: 3200000, import_price: 2400000, stock: 12, unit: "Cái", image_url: "/products/mn-ariston.png, /products/ml-daikin.png", status: "Mới 99%", badge: "Hàng Lướt", desc: "Hệ thống an toàn đồng bộ tích hợp ELCB chống giật gián tiếp và cảm biến nhiệt độ an toàn." }
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 1, type: "import", product_id: 1, quantity: 10, price: 6800000, total_amount: 68000000, status: "completed", created_by: 2, approved_by: 1, notes: "Nhập lô hàng máy lạnh Daikin 1 HP từ kho sỉ", created_at: "2026-06-10T08:00:00Z" },
  { id: 2, type: "import", product_id: 3, quantity: 5, price: 11800000, total_amount: 59000000, status: "completed", created_by: 3, approved_by: 1, notes: "Nhập tủ lạnh Panasonic 322L", created_at: "2026-06-12T09:00:00Z" },
  { id: 3, type: "export", product_id: 1, quantity: 2, price: 8500000, total_amount: 17000000, status: "completed", created_by: 4, approved_by: 2, notes: "Lắp đặt 2 bộ máy lạnh Daikin cho Khách sạn Sen Vàng", created_at: "2026-06-15T14:30:00Z" },
  { id: 4, type: "export", product_id: 4, quantity: 1, price: 7900000, total_amount: 7900000, status: "completed", created_by: 5, approved_by: 2, notes: "Bán máy giặt LG cho hộ dân", created_at: "2026-06-18T10:15:00Z" },
  { id: 5, type: "import", product_id: 2, quantity: 5, price: 9100000, total_amount: 45500000, status: "pending", created_by: 2, approved_by: null, notes: "Yêu cầu nhập thêm máy lạnh Panasonic 1.5 HP", created_at: "2026-06-25T16:00:00Z" }
];

const SEED_DEBTS: Debt[] = [
  { id: 1, party_name: "Điện Máy Chợ Lớn Sỉ", party_type: "supplier", type: "payable", amount: 127000000, paid_amount: 80000000, remaining_amount: 47000000, status: "partially_paid", due_date: "2026-07-20", notes: "Tiền nhập hàng đợt 1 tháng 6", created_at: "2026-06-10T08:00:00Z" },
  { id: 2, party_name: "Nhà phân phối Đại Kim", party_type: "supplier", type: "payable", amount: 45000000, paid_amount: 45000000, remaining_amount: 0, status: "paid", due_date: "2026-06-15", notes: "Thanh toán dứt điểm lô máy lạnh Daikin cũ", created_at: "2026-06-05T09:00:00Z" },
  { id: 3, party_name: "Công ty TNHH Hoàng Gia", party_type: "customer", type: "receivable", amount: 35000000, paid_amount: 15000000, remaining_amount: 20000000, status: "partially_paid", due_date: "2026-07-15", notes: "Nợ tiền lắp đặt hệ thống máy lạnh văn phòng", created_at: "2026-06-15T14:30:00Z" },
  { id: 4, party_name: "Trần Văn Đạt", party_type: "customer", type: "receivable", amount: 8500000, paid_amount: 0, remaining_amount: 8500000, status: "unpaid", due_date: "2026-07-05", notes: "Khách hàng mua máy lạnh Daikin trả chậm", created_at: "2026-06-20T10:15:00Z" }
];

const SEED_DELIVERIES: Delivery[] = [
  { id: 1, transaction_id: 3, customer_name: "Khách Sạn Sen Vàng", customer_phone: "0901234567", address: "124 Tên Lửa, Bình Tân, TP.HCM", status: "delivered", assigned_to: 4, notes: "Đã lắp đặt hoàn tất, máy chạy lạnh sâu, khách hài lòng", created_at: "2026-06-15T14:30:00Z" },
  { id: 2, transaction_id: 4, customer_name: "Bà Mai Thị Liên", customer_phone: "0918887766", address: "45 Đường số 7, Bình Hưng Hòa B, Bình Tân", status: "shipping", assigned_to: 5, notes: "Đang vận chuyển máy giặt LG đến nhà khách hàng", created_at: "2026-06-18T10:15:00Z" },
  { id: 3, transaction_id: null, customer_name: "Anh Hoàng Bách (Dịch vụ)", customer_phone: "0909998877", address: "78 Tân Kỳ Tân Quý, Bình Tân", status: "pending", assigned_to: 4, notes: "Yêu cầu sửa chữa máy lạnh không lạnh tại nhà (Dịch vụ ngoài)", created_at: "2026-06-25T11:00:00Z" }
];

// 3. KHỞI TẠO LOCAL STORAGE ĐỂ PHỤC VỤ CHẾ ĐỘ DEMO
const initLocalStorage = () => {
  if (typeof window === "undefined") return;

  const checkAndSet = (key: string, data: any) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  checkAndSet("erp_users", SEED_USERS);
  checkAndSet("erp_products", SEED_PRODUCTS);
  checkAndSet("erp_transactions", SEED_TRANSACTIONS);
  checkAndSet("erp_debts", SEED_DEBTS);
  checkAndSet("erp_deliveries", SEED_DELIVERIES);
};

// Gọi khởi tạo dữ liệu local storage
initLocalStorage();

// Helper kiểm tra xem có đang hoạt động ở chế độ Demo hay không
// Bằng cách theo dõi biến môi trường hoặc biến cờ được thiết lập thủ công
let useDemoMode = !hasSupabaseConfig;

export const setDemoMode = (val: boolean) => {
  useDemoMode = val;
};

export const getDemoModeStatus = (): boolean => {
  return useDemoMode;
};

// 4. API TRUY VẤN VÀ CẬP NHẬT DỮ LIỆU ĐA CHẾ ĐỘ (MOCK & SUPABASE)
export const dbService = {
  // --- USERS ---
  getUsers: async (): Promise<User[]> => {
    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("users").select("*").order("id", { ascending: true });
        if (!error && data) return data;
        console.warn("Supabase query failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }
    const local = localStorage.getItem("erp_users");
    return local ? JSON.parse(local) : SEED_USERS;
  },

  createUser: async (user: Omit<User, "id">): Promise<User> => {
    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("users").insert([user]).select().single();
        if (!error && data) return data;
        console.warn("Supabase insert failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }
    const users = await dbService.getUsers();
    const newUser: User = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem("erp_users", JSON.stringify(users));
    return newUser;
  },

  // --- PRODUCTS ---
  getProducts: async (): Promise<Product[]> => {
    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
        if (!error && data) return data;
        console.warn("Supabase query failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }
    const local = localStorage.getItem("erp_products");
    return local ? JSON.parse(local) : SEED_PRODUCTS;
  },

  createProduct: async (product: Omit<Product, "id">): Promise<Product> => {
    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("products").insert([product]).select().single();
        if (!error && data) return data;
        console.warn("Supabase insert failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }
    const products = await dbService.getProducts();
    const newProduct: Product = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      created_at: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem("erp_products", JSON.stringify(products));
    return newProduct;
  },

  updateProduct: async (id: number, updates: Partial<Product>): Promise<Product> => {
    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
        if (!error && data) return data;
        console.warn("Supabase update failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }
    const products = await dbService.getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Không tìm thấy sản phẩm");
    const updated = { ...products[idx], ...updates };
    products[idx] = updated;
    localStorage.setItem("erp_products", JSON.stringify(products));
    return updated;
  },

  // --- TRANSACTIONS ---
  getTransactions: async (): Promise<Transaction[]> => {
    const products = await dbService.getProducts();
    const users = await dbService.getUsers();

    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((t: any) => ({
            ...t,
            product: products.find((p) => p.id === t.product_id),
            creator: users.find((u) => u.id === t.created_by),
            approver: t.approved_by ? users.find((u) => u.id === t.approved_by) : null
          }));
        }
        console.warn("Supabase query failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }

    const local = localStorage.getItem("erp_transactions");
    const list: Transaction[] = local ? JSON.parse(local) : SEED_TRANSACTIONS;
    // Sắp xếp giảm dần theo thời gian tạo
    return list
      .map((t) => ({
        ...t,
        product: products.find((p) => p.id === t.product_id),
        creator: users.find((u) => u.id === t.created_by),
        approver: t.approved_by ? users.find((u) => u.id === t.approved_by) : null
      }))
      .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
  },

  createTransaction: async (tx: Omit<Transaction, "id" | "total_amount">): Promise<Transaction> => {
    const total_amount = tx.quantity * tx.price;
    const insertData = { ...tx, total_amount };

    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("transactions").insert([insertData]).select().single();
        if (!error && data) {
          // Nếu trạng thái là completed trực tiếp (ví dụ do owner/manager tạo trực tiếp), cập nhật kho luôn
          if (data.status === "completed") {
            const product = await dbService.getProductById(data.product_id);
            if (product) {
              const newStock = data.type === "import" ? product.stock + data.quantity : product.stock - data.quantity;
              await dbService.updateProduct(product.id, { stock: Math.max(0, newStock) });
            }
          }
          return data;
        }
        console.warn("Supabase insert failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }

    const txs = localStorage.getItem("erp_transactions");
    const list: Transaction[] = txs ? JSON.parse(txs) : SEED_TRANSACTIONS;
    const newTx: Transaction = {
      ...insertData,
      id: list.length > 0 ? Math.max(...list.map((t) => t.id)) + 1 : 1,
      created_at: new Date().toISOString()
    };
    list.push(newTx);
    localStorage.setItem("erp_transactions", JSON.stringify(list));

    // Nếu trạng thái là completed trực tiếp, cập nhật tồn kho
    if (newTx.status === "completed") {
      const product = await dbService.getProductById(newTx.product_id);
      if (product) {
        const newStock = newTx.type === "import" ? product.stock + newTx.quantity : product.stock - newTx.quantity;
        await dbService.updateProduct(product.id, { stock: Math.max(0, newStock) });
      }
    }

    return newTx;
  },

  updateTransactionStatus: async (id: number, status: "completed" | "cancelled", approvedBy: number): Promise<Transaction> => {
    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .update({ status, approved_by: approvedBy })
          .eq("id", id)
          .select()
          .single();
        if (!error && data) {
          // Nếu duyệt hoàn thành, cập nhật tồn kho
          if (status === "completed") {
            const product = await dbService.getProductById(data.product_id);
            if (product) {
              const newStock = data.type === "import" ? product.stock + data.quantity : product.stock - data.quantity;
              await dbService.updateProduct(product.id, { stock: Math.max(0, newStock) });
            }
          }
          return data;
        }
        console.warn("Supabase update failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }

    const local = localStorage.getItem("erp_transactions");
    const list: Transaction[] = local ? JSON.parse(local) : SEED_TRANSACTIONS;
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Không tìm thấy giao dịch");
    
    const tx = list[idx];
    // Chỉ cập nhật kho nếu giao dịch chuyển từ trạng thái khác sang completed
    if (tx.status !== "completed" && status === "completed") {
      const product = await dbService.getProductById(tx.product_id);
      if (product) {
        const newStock = tx.type === "import" ? product.stock + tx.quantity : product.stock - tx.quantity;
        await dbService.updateProduct(product.id, { stock: Math.max(0, newStock) });
      }
    }

    tx.status = status;
    tx.approved_by = approvedBy;
    localStorage.setItem("erp_transactions", JSON.stringify(list));
    return tx;
  },

  getProductById: async (id: number): Promise<Product | undefined> => {
    const products = await dbService.getProducts();
    return products.find((p) => p.id === id);
  },

  // --- DEBTS ---
  getDebts: async (): Promise<Debt[]> => {
    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("debts").select("*").order("created_at", { ascending: false });
        if (!error && data) return data;
        console.warn("Supabase query failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }
    const local = localStorage.getItem("erp_debts");
    const list: Debt[] = local ? JSON.parse(local) : SEED_DEBTS;
    return list.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
  },

  createDebt: async (debt: Omit<Debt, "id" | "remaining_amount" | "status">): Promise<Debt> => {
    const remaining_amount = debt.amount - debt.paid_amount;
    const status: Debt["status"] =
      remaining_amount <= 0 ? "paid" : debt.paid_amount > 0 ? "partially_paid" : "unpaid";
    
    const insertData = { ...debt, remaining_amount, status };

    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("debts").insert([insertData]).select().single();
        if (!error && data) return data;
        console.warn("Supabase insert failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }

    const debts = await dbService.getDebts();
    const newDebt: Debt = {
      ...insertData,
      id: debts.length > 0 ? Math.max(...debts.map((d) => d.id)) + 1 : 1,
      created_at: new Date().toISOString()
    };
    debts.push(newDebt);
    localStorage.setItem("erp_debts", JSON.stringify(debts));
    return newDebt;
  },

  updateDebtPayment: async (id: number, addPaymentAmount: number): Promise<Debt> => {
    const debts = await dbService.getDebts();
    const idx = debts.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error("Không tìm thấy khoản nợ");

    const debt = debts[idx];
    const paid_amount = Math.min(debt.amount, debt.paid_amount + addPaymentAmount);
    const remaining_amount = debt.amount - paid_amount;
    const status: Debt["status"] =
      remaining_amount <= 0 ? "paid" : paid_amount > 0 ? "partially_paid" : "unpaid";

    const updates = { paid_amount, remaining_amount, status };

    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("debts").update(updates).eq("id", id).select().single();
        if (!error && data) return data;
        console.warn("Supabase update failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }

    const updated = { ...debt, ...updates };
    debts[idx] = updated;
    localStorage.setItem("erp_debts", JSON.stringify(debts));
    return updated;
  },

  // --- DELIVERIES ---
  getDeliveries: async (): Promise<Delivery[]> => {
    const users = await dbService.getUsers();
    const transactions = await dbService.getTransactions();

    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("deliveries").select("*").order("created_at", { ascending: false });
        if (!error && data) {
          return data.map((d: any) => ({
            ...d,
            technician: d.assigned_to ? users.find((u) => u.id === d.assigned_to) : null,
            transaction: d.transaction_id ? transactions.find((t) => t.id === d.transaction_id) : null
          }));
        }
        console.warn("Supabase query failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }

    const local = localStorage.getItem("erp_deliveries");
    const list: Delivery[] = local ? JSON.parse(local) : SEED_DELIVERIES;
    return list
      .map((d) => ({
        ...d,
        technician: d.assigned_to ? users.find((u) => u.id === d.assigned_to) : null,
        transaction: d.transaction_id ? transactions.find((t) => t.id === d.transaction_id) : null
      }))
      .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
  },

  createDelivery: async (delivery: Omit<Delivery, "id">): Promise<Delivery> => {
    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("deliveries").insert([delivery]).select().single();
        if (!error && data) return data;
        console.warn("Supabase insert failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }

    const list = await dbService.getDeliveries();
    const newDelivery: Delivery = {
      ...delivery,
      id: list.length > 0 ? Math.max(...list.map((d) => d.id)) + 1 : 1,
      created_at: new Date().toISOString()
    };
    
    // Ghi nhận vào local storage
    const rawLocal = localStorage.getItem("erp_deliveries");
    const rawList = rawLocal ? JSON.parse(rawLocal) : SEED_DELIVERIES;
    rawList.push({
      id: newDelivery.id,
      transaction_id: delivery.transaction_id,
      customer_name: delivery.customer_name,
      customer_phone: delivery.customer_phone,
      address: delivery.address,
      status: delivery.status,
      assigned_to: delivery.assigned_to,
      notes: delivery.notes,
      created_at: newDelivery.created_at
    });
    localStorage.setItem("erp_deliveries", JSON.stringify(rawList));

    return newDelivery;
  },

  updateDelivery: async (id: number, updates: Partial<Delivery>): Promise<Delivery> => {
    if (!useDemoMode && supabase) {
      try {
        const { data, error } = await supabase.from("deliveries").update(updates).eq("id", id).select().single();
        if (!error && data) return data;
        console.warn("Supabase update failed, falling back to local storage", error);
      } catch (err) {
        console.error(err);
      }
    }

    const rawLocal = localStorage.getItem("erp_deliveries");
    const rawList = rawLocal ? JSON.parse(rawLocal) : SEED_DELIVERIES;
    const idx = rawList.findIndex((d: any) => d.id === id);
    if (idx === -1) throw new Error("Không tìm thấy lịch giao hàng");

    const updatedRaw = { ...rawList[idx], ...updates };
    rawList[idx] = updatedRaw;
    localStorage.setItem("erp_deliveries", JSON.stringify(rawList));

    // Lấy lại danh sách resolved để trả về
    const resolvedList = await dbService.getDeliveries();
    return resolvedList.find((d) => d.id === id)!;
  }
};
