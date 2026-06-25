# LỊCH SỬ CUỘC TRÒ CHUYỆN & NGỮ CẢNH HỆ THỐNG ERP

Tài liệu này lưu trữ toàn bộ lịch sử cuộc trò chuyện, các yêu cầu của người dùng, cơ sở dữ liệu Supabase SQL, và kế hoạch triển khai để lập trình viên hoặc AI Agent khác có thể tiếp tục công việc trên máy tính khác.

---

## 1. Yêu cầu của Người dùng (User Requirements)
*   **Mục tiêu:** Nâng cấp website landing page **Điện Lạnh Tận Nhà** hiện tại thành một hệ thống quản lý doanh nghiệp (ERP thu nhỏ) đầy đủ chức năng.
*   **Cơ sở dữ liệu:** Sử dụng **Supabase (PostgreSQL)**. Người dùng sẽ copy mã SQL được cung cấp để tạo bảng trực tiếp.
*   **Các module quản lý chính:**
    1.  **Quản lý kho:** Xuất / Nhập / Tồn kho.
    2.  **Quản lý tài chính:** Doanh thu / Chi phí / Lợi nhuận gộp / Lợi nhuận ròng.
    3.  **Quản lý công nợ:** Công nợ phải thu (Khách hàng) và Công nợ phải trả (Nhà cung cấp).
    4.  **Quản lý trạng thái nhập / giao hàng:** Lắp đặt tại nhà, vận chuyển thiết bị, phân công nhân viên.
    5.  **Xác thực & Phân quyền (RBAC):** Đăng nhập với 4 vai trò cụ thể:
        *   **Chủ (Owner):** Toàn quyền truy cập, xem tài chính, quản lý nhân viên.
        *   **Quản lý (Manager):** Quản lý kho, xem nhập xuất hàng, duyệt yêu cầu nhập xuất của nhân viên.
        *   **Kế toán (Accountant):** Quản lý công nợ, xem báo cáo tài chính để làm số sách, không sửa đổi kho hàng.
        *   **Nhân viên (Employee):** Xem lịch trình được phân công, cập nhật tiến độ công việc, tạo yêu cầu nhập xuất kho.

---

## 2. Kịch bản cơ sở dữ liệu Supabase SQL (Copy & Paste to SQL Editor)

```sql
-- 1. XÓA BẢNG NẾU TỒN TẠI
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS debts CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. TẠO BẢNG HỆ THỐNG
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, 
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'manager', 'accountant', 'employee')),
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Máy Lạnh', 'Tủ Lạnh', 'Máy Giặt', 'Khác')),
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    import_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL DEFAULT 'Cái',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('import', 'export')),
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    approved_by INT REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE debts (
    id SERIAL PRIMARY KEY,
    party_name VARCHAR(100) NOT NULL,
    party_type VARCHAR(10) NOT NULL CHECK (party_type IN ('customer', 'supplier')),
    type VARCHAR(15) NOT NULL CHECK (type IN ('receivable', 'payable')), 
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    remaining_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL CHECK (status IN ('unpaid', 'partially_paid', 'paid')),
    due_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES transactions(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'shipping', 'delivered', 'failed')),
    assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CHÈN DỮ LIỆU MẪU (SEED DATA)
INSERT INTO users (username, password, full_name, role, phone, avatar_url) VALUES
('chu_tam', 'tam123', 'Nguyễn Đức Tâm', 'owner', '0989577792', 'https://api.dicebear.com/7.x/adventurer/svg?seed=tam'),
('quanly_quang', 'quang123', 'Trần Huy Quang', 'manager', '0932188892', 'https://api.dicebear.com/7.x/adventurer/svg?seed=quang'),
('ketoan_lan', 'lan123', 'Phạm Thị Lan', 'accountant', '0977443322', 'https://api.dicebear.com/7.x/adventurer/svg?seed=lan'),
('nhanvien_dung', 'dung123', 'Lê Anh Dũng', 'employee', '0966554433', 'https://api.dicebear.com/7.x/adventurer/svg?seed=dung'),
('nhanvien_thanh', 'thanh123', 'Vũ Văn Thanh', 'employee', '0955667788', 'https://api.dicebear.com/7.x/adventurer/svg?seed=thanh');

INSERT INTO products (name, category, price, import_price, stock, unit) VALUES
('Máy lạnh Daikin Inverter 1 HP FTKB25WAVMV', 'Máy Lạnh', 8500000.00, 6800000.00, 15, 'Bộ'),
('Máy lạnh Panasonic Inverter 1.5 HP CU/CS-PU12AKH-8', 'Máy Lạnh', 11200000.00, 9100000.00, 8, 'Bộ'),
('Tủ lạnh Panasonic Inverter 322 lít NR-BC360QKVN', 'Tủ Lạnh', 14500000.00, 11800000.00, 5, 'Cái'),
('Máy giặt LG AI DD Inverter 9 kg FV1409S4W', 'Máy Giặt', 7900000.00, 6100000.00, 10, 'Cái'),
('Tủ đông Aqua Inverter 300 lít AQF-C4201E', 'Khác', 6800000.00, 5400000.00, 4, 'Cái'),
('Máy nước nóng Ariston Aures Premium 4.5P', 'Khác', 3200000.00, 2400000.00, 12, 'Cái');

INSERT INTO transactions (type, product_id, quantity, price, total_amount, status, created_by, approved_by, notes) VALUES
('import', 1, 10, 6800000.00, 68000000.00, 'completed', 2, 1, 'Nhập lô hàng máy lạnh Daikin 1 HP từ kho sỉ'),
('import', 3, 5, 11800000.00, 59000000.00, 'completed', 3, 1, 'Nhập tủ lạnh Panasonic 322L'),
('export', 1, 2, 8500000.00, 17000000.00, 'completed', 4, 2, 'Lắp đặt 2 bộ máy lạnh Daikin cho Khách sạn Sen Vàng'),
('export', 4, 1, 7900000.00, 7900000.00, 'completed', 5, 2, 'Bán máy giặt LG cho hộ dân'),
('import', 2, 5, 9100000.00, 45500000.00, 'pending', 2, NULL, 'Yêu cầu nhập thêm máy lạnh Panasonic 1.5 HP');

INSERT INTO debts (party_name, party_type, type, amount, paid_amount, remaining_amount, status, due_date, notes) VALUES
('Điện Máy Chợ Lớn Sỉ', 'supplier', 'payable', 127000000.00, 80000000.00, 47000000.00, 'partially_paid', '2026-07-20', 'Tiền nhập hàng đợt 1 tháng 6'),
('Nhà phân phối Đại Kim', 'supplier', 'payable', 45000000.00, 45000000.00, 0.00, 'paid', '2026-06-15', 'Thanh toán dứt điểm lô máy lạnh Daikin cũ'),
('Công ty TNHH Hoàng Gia', 'customer', 'receivable', 35000000.00, 15000000.00, 20000000.00, 'partially_paid', '2026-07-15', 'Nợ tiền lắp đặt hệ thống máy lạnh văn phòng'),
('Trần Văn Đạt', 'customer', 'receivable', 8500000.00, 0.00, 8500000.00, 'unpaid', '2026-07-05', 'Khách hàng mua máy lạnh Daikin trả chậm');

INSERT INTO deliveries (transaction_id, customer_name, customer_phone, address, status, assigned_to, notes) VALUES
(3, 'Khách Sạn Sen Vàng', '0901234567', '124 Tên Lửa, Bình Tân, TP.HCM', 'delivered', 4, 'Đã lắp đặt hoàn tất, máy chạy lạnh sâu, khách hài lòng'),
(4, 'Bà Mai Thị Liên', '0918887766', '45 Đường số 7, Bình Hưng Hòa B, Bình Tân', 'shipping', 5, 'Đang vận chuyển máy giặt LG đến nhà khách hàng'),
(NULL, 'Anh Hoàng Bách (Dịch vụ)', '0909998877', '78 Tân Kỳ Tân Quý, Bình Tân', 'pending', 4, 'Yêu cầu sửa chữa máy lạnh không lạnh tại nhà (Dịch vụ ngoài)');
```

---

## 3. Các bước tiếp theo để khởi chạy
1.  **Cài đặt biến môi trường Supabase:**
    Tạo hoặc thêm vào file `.env.local` ở thư mục gốc:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
    ```
2.  **Khởi chạy cơ sở dữ liệu:**
    Chạy đoạn SQL trên ở Supabase SQL Editor.
3.  **Tiếp tục phát triển các file giao diện và API:**
    *   Tạo file client: `src/lib/supabaseClient.ts`
    *   Tạo Client Wrapper: `src/components/MainLayoutWrapper.tsx`
    *   Thay đổi `src/app/layout.tsx` sử dụng Wrapper.
    *   Xây dựng hệ thống API đăng nhập `/api/auth/login` và giao diện `/login`.
    *   Xây dựng Dashboard chính và các phân trang chức năng trong `/admin` (inventory, finance, debts, deliveries, users).
