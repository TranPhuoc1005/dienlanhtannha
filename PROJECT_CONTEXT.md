# TÀI LIỆU DỰ ÁN: ĐIỆN LẠNH TẬN NHÀ (DIEN LANH TAN NHA)

Tài liệu này chứa thông tin chi tiết về chủ đề, ngữ cảnh, cấu trúc thư mục, logic hoạt động và hướng dẫn phát triển cho dự án **Điện Lạnh Tận Nhà**. Đây là nguồn ngữ cảnh chính dành cho các AI Agent hoặc lập trình viên khi khởi động lại dự án.

---

## 1. THÔNG TIN CHUNG VỀ DỰ ÁN (PROJECT CONTEXT)

*   **Tên dự án/thương hiệu:** Điện Lạnh Tận Nhà
*   **Lĩnh vực hoạt động:** Cung cấp dịch vụ điện lạnh dân dụng và công nghiệp chuyên nghiệp tại khu vực TP.HCM.
    *   Sửa chữa thiết bị (Máy lạnh, tủ lạnh, máy giặt, máy nước nóng, tủ đông, v.v.).
    *   Lắp đặt, tháo dỡ, di dời thiết bị điện lạnh.
    *   Vệ sinh sâu và sạc gas bổ sung.
    *   Bảo trì định kỳ cho hộ gia đình, văn phòng, nhà hàng, khách sạn.
    *   Trao đổi thiết bị cũ - lấy máy Inverter đời mới.
    *   Mua bán thanh lý máy lạnh, tủ lạnh cũ đã qua kiểm định nghiêm ngặt.
*   **Địa chỉ cửa hàng:** 36 Đường Số 1, Phường Bình Hưng Hòa, Quận Bình Tân, TP.HCM.
*   **Hotline hỗ trợ:** `0989.577.792` - `0932.188.892` (Anh Tâm).
*   **Kênh trực tuyến:** Hỗ trợ nhắn tin Zalo nhanh qua số điện thoại `0932.188.892`.
*   **Mục tiêu website:** Tạo ấn tượng chuyên nghiệp, cao cấp, cung cấp bảng giá rõ ràng minh bạch, cho phép người dùng đăng ký lịch hẹn dễ dàng và tra cứu danh sách sản phẩm thanh lý giá tốt tại TP.HCM.

---

## 2. PHONG CÁCH THIẾT KẾ & CHỦ ĐỀ (THEME & AESTHETICS)

Website được thiết kế theo phong cách hiện đại, sống động và cao cấp (Premium Dynamic):
*   **Tông màu chủ đạo (Color Palette):**
    *   `Primary (Xanh dương lạnh):` `#0a84ff` (Đại diện cho hơi mát, băng giá, công nghệ hiện đại).
    *   `Secondary (Xanh dương đậm):` `#0056b3`.
    *   `Brand Light (Nền sáng mát dịu):` `#f5f9ff` (Xanh nhạt pha trắng).
    *   `Text Dark (Chữ tối tương phản cao):` `#1e293b`.
*   **Hiệu ứng đặc trưng (Interactive & Visual Excellence):**
    *   **Logo Thương Hiệu Thiết Kế Mới (`logo.png`):** Logo độc quyền dạng biểu tượng tinh tế kết hợp hình ảnh ngôi nhà ("Tận Nhà") và bông tuyết lạnh ("Điện Lạnh") giúp tăng tính chuyên nghiệp đồng bộ.
    *   **Hình Ảnh Sản Phẩm Realistic:** 6 hình ảnh sản phẩm chất lượng cao, chân thực (studio lighting) thay cho các khối màu/icon cũ.
    *   **3D Card Tilt (Nghiêng 3D Parallax):** Khi hover chuột lên các thẻ sản phẩm, thẻ sẽ nghiêng 3 chiều linh hoạt theo góc nhìn và tọa độ chuột, tạo độ tương tác chân thực như vật thể vật lý.
    *   **Frost & Ice Shimmer Overlay (Phủ Tuyết Quét Sáng):** Lớp phủ tinh thể tuyết mờ (`backdrop-filter`) và luồng sáng quét băng giá xuất hiện tức thì trên ảnh sản phẩm khi hover để mô phỏng trạng thái "đông lạnh sâu".
    *   **Water Drop Condensation (Hạt nước ngưng tụ):** Hiệu ứng các giọt nước nhỏ rơi chảy dọc ngưng tụ chân thực ở góc thẻ sản phẩm khi hover.
    *   **Glassmorphism (Kính mờ):** Sử dụng các class `.glass-header` và `.glass-card` kết hợp `backdrop-filter` mờ nhẹ và viền bán trong suốt để tạo cảm giác sang trọng.
    *   **Mouse Parallax (3D Parallax):** Các bông tuyết (`Snowflake`) và các khối màu gradient trôi lơ lửng ở nền sẽ di chuyển theo hướng di chuyển chuột của người dùng, tạo chiều sâu 3D sống động (`FloatingElements`).
    *   **Cursor Glow (Hào quang con trỏ chuột):** Một vùng sáng xanh dịu nhẹ (`CursorGlow`) di chuyển theo con trỏ chuột trên các thiết bị desktop.
    *   **Shimmer & Pulse Buttons:** Nút bấm có hiệu ứng phát sáng quét qua (`shimmer-btn`) hoặc rung nhẹ thu hút sự chú ý (`btn-pulse`).
    *   **Ken Burns Effect:** Banner chính (`HeroSection`) sử dụng ảnh nền tự động phóng to/thu nhỏ nhẹ nhàng tạo cảm giác chuyển động điện ảnh.

---

## 3. CÔNG NGHỆ & THƯ VIỆN SỬ DỤNG (TECH STACK)

*   **Framework chính:** Next.js 16.2.9 (App Router)
*   **Thư viện UI:** React 19.2.4 & React DOM 19.2.4
*   **Styling:** Tailwind CSS v4.0.0 (Sử dụng cú pháp cấu hình `@theme` mới trong CSS)
*   **Hiệu ứng chuyển động:** Framer Motion v12.40.0
*   **Bộ biểu tượng:** Lucide React v1.18.0
*   **Ngôn ngữ:** TypeScript 5
*   **Font chữ:** Geist & Geist Mono (Tích hợp tối ưu qua `next/font/google`)

---

## 4. CẤU TRÚC THƯ MỤC CHI TIẾT (DIRECTORY STRUCTURE)

```bash
📂 DienLanhTanNha
├── 📂 .next/                   # Thư mục build của Next.js
├── 📂 node_modules/            # Thư mục chứa các dependency
├── 📂 public/                  # Các tài nguyên tĩnh (Hình ảnh, favicon, v.v.)
│   ├── favicon.ico
│   ├── hero-bg.png             # Hình nền chính cho Hero banner
│   ├── logo.png                # Logo thương hiệu Điện Lạnh Tận Nhà mới
│   └── 📂 products/            # Ảnh sản phẩm thanh lý chân thực (Realistic images)
│       ├── ml-daikin.png
│       ├── tl-panasonic.png
│       ├── mg-lg.png
│       ├── ml-panasonic.png
│       ├── td-aqua.png
│       └── mn-ariston.png
├── 📂 src/
│   ├── 📂 app/                 # Next.js App Router Pages & Layouts
│   │   ├── 📂 dich-vu/
│   │   │   └── page.tsx        # Trang chi tiết Dịch vụ, bảng giá & form đặt lịch hẹn
│   │   ├── 📂 gioi-thieu/
│   │   │   └── page.tsx        # Trang giới thiệu về cửa hàng & giá trị cốt lõi
│   │   ├── 📂 lien-he/
│   │   │   └── page.tsx        # Trang thông tin liên hệ, bản đồ & form phản hồi
│   │   ├── 📂 san-pham/
│   │   │   └── page.tsx        # Trang danh mục sản phẩm thanh lý với bộ lọc nâng cao
│   │   ├── favicon.ico
│   │   ├── globals.css         # Import Tailwind CSS v4 và định nghĩa custom class/theme
│   │   ├── layout.tsx          # Root Layout bao bọc toàn bộ trang web
│   │   └── page.tsx            # Trang chủ chứa các phân đoạn landing page chính
│   └── 📂 components/          # Thư mục chứa các UI Components tái sử dụng
│       ├── BackToTop.tsx       # Nút cuộn nhanh lên đầu trang
│       ├── CTASection.tsx      # Khối CTA đặt lịch nhanh ở cuối trang chủ
│       ├── CounterSection.tsx  # Khối thống kê số liệu thành tích chạy số tăng dần
│       ├── CursorGlow.tsx      # Hiệu ứng hào quang con trỏ chuột
│       ├── FloatingContact.tsx # Nút gọi điện & Zalo nổi góc dưới bên trái có hiệu ứng gợn sóng
│       ├── FloatingElements.tsx# Các bông tuyết và hình tròn chuyển động parallax theo chuột
│       ├── Footer.tsx          # Chân trang chứa thông tin liên hệ và link nhanh
│       ├── Header.tsx          # Thanh điều hướng header (Kính mờ, hỗ trợ responsive di động)
│       ├── HeroSection.tsx     # Banner đầu trang chủ với hiệu ứng Ken Burns và nút CTA
│       ├── LoadingScreen.tsx   # Màn hình chờ khi tải trang ban đầu (Global Loader)
│       ├── ProductsSection.tsx # Section giới thiệu sản phẩm tiêu biểu ở trang chủ
│       ├── ScrollProgressBar.tsx# Thanh đo tiến trình cuộn trang nằm trên cùng màn hình
│       ├── ServicesSection.tsx # Phân đoạn giới thiệu 6 dịch vụ cốt lõi ở trang chủ
│       ├── TestimonialsSection.tsx# Carousel đánh giá/phản hồi từ khách hàng thực tế
│       └── WorkflowSection.tsx # Biểu đồ dòng thời gian 4 bước làm việc chuyên nghiệp
├── AGENTS.md                   # Các quy tắc của Next.js Agent (Quan trọng cho AI)
├── CLAUDE.md                   # Chỉ định cấu hình Agent
├── eslint.config.mjs           # Cấu hình kiểm tra lỗi mã nguồn ESLint
├── next-env.d.ts               # Khai báo TypeScript cho môi trường Next.js
├── next.config.ts              # Cấu hình Next.js
├── package.json                # Liệt kê các script và thư viện phụ thuộc
├── postcss.config.mjs          # Cấu hình xử lý CSS PostCSS
├── tsconfig.json               # Cấu hình trình biên dịch TypeScript
└── PROJECT_CONTEXT.md          # File tài liệu này (Ngữ cảnh dự án)
```

---

## 5. LOGIC CHI TIẾT & CÁC TÍNH NĂNG CHÍNH (LOGIC & WORKFLOWS)

### A. Trang Chủ (`src/app/page.tsx`)
Bao gồm các phân đoạn (sections) ghép lại nhằm cung cấp một luồng trải nghiệm khách hàng tối ưu:
1.  **HeroSection:** Quảng cáo khẩu hiệu dịch vụ "Có mặt sau 30 phút", liên kết gọi điện khẩn cấp và đặt lịch hẹn.
2.  **ServicesSection:** Tóm tắt 6 mảng dịch vụ chính. Di chuột vào thẻ dịch vụ sẽ phóng to nhẹ và xoay icon Lucide.
3.  **CounterSection:** Thống kê thành tích nổi bật của cửa hàng (Năm kinh nghiệm, Khách hàng hài lòng, Dự án hoàn thành, Kỹ thuật viên) với hiệu ứng số chạy tăng dần khi xuất hiện trên màn hình.
4.  **ProductsSection:** Hiển thị 6 sản phẩm thanh lý mẫu. Có các tab lọc nhanh danh mục sản phẩm. Hover vào sản phẩm sẽ hiện nút liên hệ Zalo nhanh.
5.  **WorkflowSection:** Giới thiệu quy trình làm việc 4 bước chuẩn hóa: (1) Tiếp nhận -> (2) Kiểm tra & Báo giá -> (3) Tiến hành sửa chữa -> (4) Nghiệm thu & Bảo hành.
6.  **TestimonialsSection:** Hiển thị các đánh giá từ khách hàng bằng một Carousel tự động trượt, có thể tương tác chuyển slide.
7.  **CTASection:** Kêu gọi khách hàng đặt lịch hoặc liên hệ Hotline nhanh.

### B. Trang Dịch Vụ & Bảng Giá (`src/app/dich-vu/page.tsx`)
*   **Bảng giá tham khảo:** Bảng liệt kê chi phí vệ sinh máy lạnh, sạc gas, vệ sinh máy giặt và tháo lắp máy. Thiết kế trực quan, responsive ẩn cột ghi chú trên di động để giữ giao diện gọn gàng.
*   **Chi tiết dịch vụ:** Grid chi tiết 6 dịch vụ kèm các bullet point cụ thể được tích dấu check màu xanh lục.
*   **Form đăng ký lịch hẹn:**
    *   Người dùng nhập: Họ và Tên, Số điện thoại, Chọn dịch vụ yêu cầu, Ghi chú.
    *   **Logic Validation:** Kiểm tra số điện thoại theo định dạng Việt Nam (`/^(0[3|5|7|8|9])([0-9]{8})$/`). Yêu cầu bắt buộc nhập đầy đủ Tên & SĐT.
    *   Sau khi gửi thành công, form tự động reset và hiển thị thông báo thành công dạng hộp màu xanh lá trong 5 giây.

### C. Trang Danh Sách Sản Phẩm (`src/app/san-pham/page.tsx`)
*   **Hệ thống lọc sản phẩm (Dynamic Filtering):**
    *   Lọc theo **Danh mục** (Máy Lạnh, Tủ Lạnh, Máy Giặt, Khác).
    *   Lọc theo **Hãng sản xuất** (Daikin, Panasonic, LG, Khác).
    *   Lọc theo **Tầm giá** (Dưới 5 triệu, 5-8 triệu, Trên 8 triệu).
    *   Sử dụng cơ chế cập nhật state của React và lọc danh sách gốc `initialProducts`. Hiệu ứng chuyển đổi mượt mà bằng `<AnimatePresence>` của Framer Motion.
*   **Hộp thoại Chi tiết thông số (Product Specification Modal):**
    *   Khi click vào sản phẩm, một Modal dạng Pop-up mở lên hiển thị ảnh đặc trưng (dưới dạng icon SVG nghệ thuật trên nền gradient), mô tả sản phẩm, và **bảng thông số kỹ thuật chi tiết** dưới dạng key-value.
    *   Modal cung cấp hai nút gọi điện khẩn cấp và nút nhắn tin Zalo được định dạng nội dung sẵn: `"Tôi muốn hỏi sản phẩm [ID] - [Tên sản phẩm]"`.

### D. Trang Liên Hệ (`src/app/lien-he/page.tsx`)
*   Hiển thị 4 thẻ thông tin liên lạc chính: Địa chỉ, Số điện thoại (Tâm), Giờ mở cửa, và Đường dẫn Zalo chat.
*   Nhúng bản đồ Google Maps tương tác của cửa hàng tại địa chỉ `36 Đường Số 1, Bình Hưng Hòa, Bình Tân, TP.HCM`.
*   Form phản hồi ý kiến dịch vụ với logic validation SĐT tương tự trang dịch vụ, hiển thị thông báo thành công màu xanh lá trong 5 giây sau khi gửi.

### E. Các Hiệu Ứng Toàn Cục (Global Layout Features)
*   **ScrollProgressBar:** Hiển thị thanh đo tiến trình cuộn trang nằm trên cùng màn hình dạng dải màu xanh `#0a84ff`.
*   **LoadingScreen:** Màn hình chờ loading toàn trang xuất hiện trong khoảng 1.2 giây khi người dùng truy cập website lần đầu, mang đến cảm giác tải trang mượt mà.
*   **FloatingContact (Zalo & Hotline):** Hai nút tròn trôi nổi cố định ở góc dưới bên trái.
    *   Nút Zalo nhảy nhẹ (bounce) sau mỗi 5 giây để thu hút tương tác.
    *   Nút Hotline nhấp nháy phát sóng liên tục (`btn-pulse`).
    *   **Hiệu ứng gợn sóng (Ripple Effect):** Khi click vào một trong hai nút nổi này, các vòng tròn gợn sóng màu trắng sẽ lan tỏa ra từ điểm click chuột của người dùng trước khi biến mất.
*   **BackToTop:** Nút mũi tên tròn ở góc dưới bên phải tự động hiển thị khi người dùng cuộn trang quá 400px, giúp cuộn nhanh lên đầu trang bằng hiệu ứng cuộn mượt (`scroll-behavior: smooth`).

---

## 6. HƯỚNG DẪN DÀNH CHO AI AGENT THẾ HỆ KẾ TIẾP (DEV GUIDELINES)

1.  **Quy tắc Next.js 16/React 19:**
    *   Dự án này sử dụng Next.js phiên bản mới với React 19. Cần lưu ý các thay đổi đột phá (breaking changes) về API và quy ước so với Next.js 14/15. Hãy kiểm tra kỹ trong thư mục `node_modules/next/dist/docs/` nếu cần chỉnh sửa cấu trúc Next.js sâu.
    *   Tránh sử dụng các API đã bị loại bỏ hoặc cảnh báo không khuyến khích (deprecated).
2.  **Cập nhật CSS với Tailwind CSS v4:**
    *   Cấu hình theme được thực hiện trực tiếp trong `src/app/globals.css` bằng cú pháp `@theme` mới của Tailwind v4 (Dòng 3 - 11). Tránh định cấu hình theme trong `tailwind.config.js` (không có file này do Tailwind v4 xử lý cấu hình qua CSS).
    *   Các biến màu sắc chính như `--color-primary` được định nghĩa trong `@theme` và sử dụng trong code thông qua class `bg-primary`, `text-primary`, v.v.
3.  **Bảo toàn các hiệu ứng chuyển động:**
    *   Khi sửa đổi các component như `HeroSection`, `FloatingElements` hay các danh mục dịch vụ/sản phẩm, hãy luôn giữ các thuộc tính chuyển động `framer-motion` như `staggerChildren`, `whileHover` để đảm bảo trải nghiệm người dùng cao cấp nguyên bản.
    *   Các sự kiện click chuột trên nút liên hệ nổi cần giữ hàm `handleButtonClick` để duy trì hiệu ứng gợn sóng (Ripple Effect) tương tác.
4.  **SEO & Metadata:**
    *   Trang web đã được cấu hình tối ưu SEO tốt trong `src/app/layout.tsx` với đầy đủ tiêu đề, mô tả, từ khóa tiếng Việt có dấu, thông tin tác giả, robot index, og:title, og:description chi tiết. Khi thêm trang mới, hãy khai báo `metadata` tương tự để giữ hiệu suất SEO.
5.  **Dữ liệu Mock Data:**
    *   Hiện tại danh sách dịch vụ và sản phẩm đang được lưu trực tiếp dưới dạng mảng tĩnh (`initialProducts` và `servicesDetails`) trong các file page tương ứng để đảm bảo tốc độ tải trang nhanh và đơn giản. Nếu cần tích hợp CMS hoặc API trong tương lai, hãy chuyển đổi mảng tĩnh này sang dạng fetch dữ liệu bất đồng bộ nhưng vẫn giữ nguyên cấu trúc kiểu dữ liệu.
