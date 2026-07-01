const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("No .env.local file found at", envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value.trim();
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const SEED_USERS = [
  { id: 1, username: "chu_tam", password: "tam123", full_name: "Nguyễn Đức Tâm", role: "owner", phone: "0989577792", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=tam" },
  { id: 2, username: "quanly_quang", password: "quang123", full_name: "Trần Huy Quang", role: "manager", phone: "0932188892", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=quang" },
  { id: 3, username: "ketoan_lan", password: "lan123", full_name: "Phạm Thị Lan", role: "accountant", phone: "0977443322", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=lan" },
  { id: 4, username: "nhanvien_dung", password: "dung123", full_name: "Lê Anh Dũng", role: "employee", phone: "0966554433", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=dung" },
  { id: 5, username: "nhanvien_thanh", password: "thanh123", full_name: "Vũ Văn Thanh", role: "employee", phone: "0955667788", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=thanh" }
];

const SEED_PRODUCTS = [
  { id: 1, name: "Máy lạnh Daikin Inverter 1 HP FTKB25WAVMV", category: "Máy Lạnh", price: 8500000, import_price: 6800000, stock: 15, unit: "Bộ", image_url: "/products/ml-daikin.png, /products/ml-panasonic.png", status: "Mới 95%", badge: "Bán chạy", desc: "Máy lạnh chạy êm ái, tiết kiệm điện năng vượt trội, thích hợp cho phòng 15 - 20 m2." },
  { id: 2, name: "Máy lạnh Panasonic Inverter 1.5 HP CU/CS-PU12AKH-8", category: "Máy Lạnh", price: 11200000, import_price: 9100000, stock: 8, unit: "Bộ", image_url: "/products/ml-panasonic.png, /products/ml-daikin.png", status: "Mới 90%", badge: "Giá Rẻ", desc: "Bộ lọc kháng khuẩn Nanoe-G lọc sạch bụi mịn PM2.5, phù hợp phòng ngủ nhỏ dưới 15 m2." },
  { id: 3, name: "Tủ lạnh Panasonic Inverter 322 lít NR-BC360QKVN", category: "Tủ Lạnh", price: 14500000, import_price: 11800000, stock: 5, unit: "Cái", image_url: "/products/tl-panasonic.png, /products/td-aqua.png", status: "Mới 98%", badge: "Tiết Kiệm Điện", desc: "Công nghệ đông mềm Prime Fresh+ giữ thực phẩm tươi ngon suốt 7 ngày không cần rã đông." },
  { id: 4, name: "Máy giặt LG AI DD Inverter 9 kg FV1409S4W", category: "Máy Giặt", price: 7900000, import_price: 6100000, stock: 10, unit: "Cái", image_url: "/products/mg-lg.png, /products/td-aqua.png", status: "Mới 99%", badge: "Giá Cực Tốt", desc: "Hệ thống truyền động trực tiếp AI DD bảo vệ sợi vải tối ưu, hoạt động cực kỳ êm ái." },
  { id: 5, name: "Tủ đông Aqua Inverter 300 lít AQF-C4201E", category: "Khác", price: 6800000, import_price: 5400000, stock: 4, unit: "Cái", image_url: "/products/td-aqua.png, /products/tl-panasonic.png", status: "Mới 97%", badge: "Đông Sâu", desc: "Làm lạnh 3D nhanh sâu xuống -24°C, thích hợp cho việc tích trữ sữa, thịt cá lâu ngày." },
  { id: 6, name: "Máy nước nóng Ariston Aures Premium 4.5P", category: "Khác", price: 3200000, import_price: 2400000, stock: 12, unit: "Cái", image_url: "/products/mn-ariston.png, /products/ml-daikin.png", status: "Mới 99%", badge: "Hàng Lướt", desc: "Hệ thống an toàn đồng bộ tích hợp ELCB chống giật gián tiếp và cảm biến nhiệt độ an toàn." }
];

const SEED_TRANSACTIONS = [
  { id: 1, type: "import", product_id: 1, quantity: 10, price: 6800000, total_amount: 68000000, status: "completed", created_by: 2, approved_by: 1, notes: "Nhập lô hàng máy lạnh Daikin 1 HP từ kho sỉ", created_at: "2026-06-10T08:00:00Z" },
  { id: 2, type: "import", product_id: 3, quantity: 5, price: 11800000, total_amount: 59000000, status: "completed", created_by: 3, approved_by: 1, notes: "Nhập tủ lạnh Panasonic 322L", created_at: "2026-06-12T09:00:00Z" },
  { id: 3, type: "export", product_id: 1, quantity: 2, price: 8500000, total_amount: 17000000, status: "completed", created_by: 4, approved_by: 2, notes: "Lắp đặt 2 bộ máy lạnh Daikin cho Khách sạn Sen Vàng", created_at: "2026-06-15T14:30:00Z" },
  { id: 4, type: "export", product_id: 4, quantity: 1, price: 7900000, total_amount: 7900000, status: "completed", created_by: 5, approved_by: 2, notes: "Bán máy giặt LG cho hộ dân", created_at: "2026-06-18T10:15:00Z" },
  { id: 5, type: "import", product_id: 2, quantity: 5, price: 9100000, total_amount: 45500000, status: "pending", created_by: 2, approved_by: null, notes: "Yêu cầu nhập thêm máy lạnh Panasonic 1.5 HP", created_at: "2026-06-25T16:00:00Z" }
];

const SEED_DEBTS = [
  { id: 1, party_name: "Điện Máy Chợ Lớn Sỉ", party_type: "supplier", type: "payable", amount: 127000000, paid_amount: 80000000, remaining_amount: 47000000, status: "partially_paid", due_date: "2026-07-20", notes: "Tiền nhập hàng đợt 1 tháng 6", created_at: "2026-06-10T08:00:00Z" },
  { id: 2, party_name: "Nhà phân phối Đại Kim", party_type: "supplier", type: "payable", amount: 45000000, paid_amount: 45000000, remaining_amount: 0, status: "paid", due_date: "2026-06-15", notes: "Thanh toán dứt điểm lô máy lạnh Daikin cũ", created_at: "2026-06-05T09:00:00Z" },
  { id: 3, party_name: "Công ty TNHH Hoàng Gia", party_type: "customer", type: "receivable", amount: 35000000, paid_amount: 15000000, remaining_amount: 20000000, status: "partially_paid", due_date: "2026-07-15", notes: "Nợ tiền lắp đặt hệ thống máy lạnh văn phòng", created_at: "2026-06-15T14:30:00Z" },
  { id: 4, party_name: "Trần Văn Đạt", party_type: "customer", type: "receivable", amount: 8500000, paid_amount: 0, remaining_amount: 8500000, status: "unpaid", due_date: "2026-07-05", notes: "Khách hàng mua máy lạnh Daikin trả chậm", created_at: "2026-06-20T10:15:00Z" }
];

const SEED_DELIVERIES = [
  { id: 1, transaction_id: 3, customer_name: "Khách Sạn Sen Vàng", customer_phone: "0901234567", address: "124 Tên Lửa, Bình Tân, TP.HCM", status: "delivered", assigned_to: 4, notes: "Đã lắp đặt hoàn tất, máy chạy lạnh sâu, khách hài lòng", created_at: "2026-06-15T14:30:00Z" },
  { id: 2, transaction_id: 4, customer_name: "Bà Mai Thị Liên", customer_phone: "0918887766", address: "45 Đường số 7, Bình Hưng Hòa B, Bình Tân", status: "shipping", assigned_to: 5, notes: "Đang vận chuyển máy giặt LG đến nhà khách hàng", created_at: "2026-06-18T10:15:00Z" },
  { id: 3, transaction_id: null, customer_name: "Anh Hoàng Bách (Dịch vụ)", customer_phone: "0909998877", address: "78 Tân Kỳ Tân Quý, Bình Tân", status: "pending", assigned_to: 4, notes: "Yêu cầu sửa chữa máy lạnh không lạnh tại nhà (Dịch vụ ngoài)", created_at: "2026-06-25T11:00:00Z" }
];

async function seedTable(tableName, data) {
  console.log(`Seeding table ${tableName}...`);
  try {
    const response = await fetch(`${url}/rest/v1/${tableName}`, {
      method: "POST",
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Error seeding ${tableName}:`, response.status, errText);
    } else {
      console.log(`Table ${tableName} seeded successfully!`);
    }
  } catch (err) {
    console.error(`Failed to seed ${tableName}:`, err);
  }
}

async function run() {
  await seedTable("users", SEED_USERS);
  await seedTable("products", SEED_PRODUCTS);
  await seedTable("transactions", SEED_TRANSACTIONS);
  await seedTable("debts", SEED_DEBTS);
  await seedTable("deliveries", SEED_DELIVERIES);
  console.log("All tables seeding complete!");
}

run();
