"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Hammer, Droplets, ShieldCheck, RefreshCw, Package, Phone, Check } from "lucide-react";

const servicesDetails = [
  {
    id: "sua-chua",
    title: "Sửa Chữa Điện Lạnh",
    desc: "Khắc phục triệt để các sự cố hỏng hóc thiết bị điện lạnh tại nhà:",
    bullet: [
      "Máy lạnh không lạnh, kém lạnh, chảy nước, rò rỉ gas.",
      "Tủ lạnh không đông đá, hỏng block, kêu to, không xả đá.",
      "Máy giặt không vắt, không cấp nước, lỗi bo mạch, rò điện.",
      "Máy nước nóng không nóng, rò rỉ nước, hỏng bộ chống giật."
    ],
    icon: Wrench,
  },
  {
    id: "lap-dat",
    title: "Lắp Đặt Thiết Bị",
    desc: "Thi công lắp đặt trọn gói hệ thống điều hòa và thiết bị gia dụng:",
    bullet: [
      "Khảo sát địa thế lắp đặt dàn nóng, dàn lạnh đạt thẩm mỹ và hiệu quả.",
      "Thi công đi âm đường ống đồng, ống nước thải máy lạnh.",
      "Lắp đặt tủ lạnh side-by-side, máy giặt lồng ngang phức tạp.",
      "Hỗ trợ di dời máy lạnh cũ từ địa chỉ này sang địa chỉ khác."
    ],
    icon: Hammer,
  },
  {
    id: "ve-sinh",
    title: "Vệ Sinh Thiết Bị",
    desc: "Bảo dưỡng chuyên sâu giúp máy hoạt động trơn chu và trong lành:",
    bullet: [
      "Rửa mặt nạ, lưới lọc bụi, xịt rửa dàn nóng và dàn lạnh máy lạnh.",
      "Vệ sinh lồng giặt máy giặt cửa ngang/cửa dọc bằng chất tẩy cặn bẩn chuyên dụng.",
      "Thông tắc đường ống thoát nước thải tránh chảy nước.",
      "Lau dọn dàn lạnh, khử mùi hôi tủ lạnh."
    ],
    icon: Droplets,
  },
  {
    id: "bao-tri",
    title: "Bảo Trì Định Kỳ",
    desc: "Gói kiểm định kỹ thuật định kỳ cho gia đình và doanh nghiệp:",
    bullet: [
      "Kiểm tra lưu lượng gas, dòng định mức làm việc của block.",
      "Bảo dưỡng định kỳ hàng tháng/quý cho văn phòng, nhà hàng, khách sạn.",
      "Đo đạc kiểm tra an toàn hệ thống điện nguồn nối đất.",
      "Ưu đãi sạc gas bổ sung miễn phí đi kèm gói dịch vụ bảo trì."
    ],
    icon: ShieldCheck,
  },
  {
    id: "trao-doi",
    title: "Trao Đổi Cũ - Mới",
    desc: "Chương trình thu cũ đổi mới thiết bị điện lạnh hỗ trợ khách hàng:",
    bullet: [
      "Thu mua máy cũ hỏng nát giá hợp lý nhất thị trường.",
      "Tư vấn lên đời dòng máy Inverter tiết kiệm điện cao cấp.",
      "Hỗ trợ vận chuyển, miễn phí tháo dỡ máy cũ và lắp ráp máy mới.",
      "Bù tiền chênh lệch linh hoạt, trả góp lãi suất thấp."
    ],
    icon: RefreshCw,
  },
  {
    id: "thanh-ly",
    title: "Thanh Lý Điện Lạnh Cũ",
    desc: "Mua bán thiết bị điện lạnh cũ đã qua kiểm định nghiêm ngặt:",
    bullet: [
      "Bán thanh lý máy lạnh, tủ lạnh cũ zin 100%, chạy êm ái.",
      "Chế độ bảo hành dài hạn từ 6 đến 12 tháng giống như máy mới.",
      "Hỗ trợ bao test máy đổi trả trong 7 ngày đầu sử dụng.",
      "Giao hàng tận nơi miễn phí lắp đặt vật tư phụ."
    ],
    icon: Package,
  },
];

const priceList = [
  { item: "Vệ sinh máy lạnh treo tường (1 HP - 2.5 HP)", price: "150.000đ - 200.000đ", note: "Bao gồm rửa lưới lọc & xịt dàn lạnh/nóng" },
  { item: "Vệ sinh máy lạnh Âm trần / Tủ đứng", price: "350.000đ - 450.000đ", note: "Quy trình rửa chuyên dụng" },
  { item: "Sạc gas bổ sung R22, R32, R410A", price: "100.000đ - 250.000đ", note: "Đo lường psi thực tế nạp bổ sung" },
  { item: "Vệ sinh máy giặt cửa trên (Lồng đứng)", price: "250.000đ - 300.000đ", note: "Tháo lồng xịt rửa cặn bám" },
  { item: "Vệ sinh máy giặt cửa trước (Lồng ngang)", price: "400.000đ - 500.000đ", note: "Tháo rã vệ sinh chi tiết" },
  { item: "Công tháo gỡ máy lạnh cũ", price: "200.000đ - 250.000đ", note: "Thu hồi gas an toàn" },
  { item: "Công lắp đặt máy lạnh mới (treo tường)", price: "300.000đ - 350.000đ", note: "Đã bao gồm hút chân không" },
];

export default function DichVu() {
  const [formData, setFormData] = useState({ name: "", phone: "", service: "Sửa máy lạnh", note: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError("Vui lòng điền đầy đủ Tên và Số điện thoại!");
      return;
    }
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Số điện thoại không đúng định dạng Việt Nam!");
      return;
    }
    setError("");
    setSubmitted(true);
    setFormData({ name: "", phone: "", service: "Sửa máy lạnh", note: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-[#f5f9ff] min-h-screen py-12 md:py-20 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold text-[#1066e6] tracking-widest">Dịch vụ & Bảng giá</span>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1e293b]">
            Chi Tiết Dịch Vụ Điện Lạnh
          </h1>
          <div className="h-1 bg-[#1066e6] w-16 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-[#1e293b]/70 text-base">
            Bảng giá minh bạch công khai cùng chi tiết quy trình xử lý chuyên nghiệp của Điện Lạnh Tận Nhà.
          </p>
        </div>

        {/* Detailed Price List Table */}
        <div className="bg-white rounded-[20px] p-6 md:p-8 border border-slate-100 shadow-sm mb-20">
          <h2 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-6 text-center">
            Bảng Giá Tham Khảo (Công Khai - Minh Bạch)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[#1e293b]/60">
                  <th className="py-4 font-bold uppercase tracking-wider">Hạng mục dịch vụ</th>
                  <th className="py-4 font-bold uppercase tracking-wider">Đơn giá tham khảo</th>
                  <th className="py-4 font-bold uppercase tracking-wider hidden md:table-cell">Ghi chú chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[#1e293b]">
                {priceList.map((row, i) => (
                  <tr key={i} className="hover:bg-[#f5f9ff]/50 transition-colors">
                    <td className="py-4 font-bold">{row.item}</td>
                    <td className="py-4 text-[#1066e6] font-extrabold">{row.price}</td>
                    <td className="py-4 text-[#1e293b]/60 hidden md:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#1e293b]/50 mt-6 leading-relaxed">
            * Lưu ý: Bảng giá trên là bảng giá sàn để quý khách tham khảo. Đơn giá thực tế có thể dao động nhẹ tùy thuộc vào vị trí lắp đặt máy (cao, khó leo trèo), loại gas máy lạnh sử dụng, hoặc độ phức tạp của sự cố. Thợ của chúng tôi sẽ báo giá chính xác trực tiếp trước khi làm.
          </p>
        </div>

        {/* Services Detail List */}
        <div className="space-y-12 mb-20">
          <h2 className="text-2xl font-bold text-[#1e293b] text-center mb-8">
            Chi Tiết Từng Dịch Vụ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesDetails.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  id={s.id}
                  className="bg-white p-8 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between scroll-mt-24"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-[#f5f9ff] text-[#1066e6] rounded-xl border border-slate-50">
                        <Icon className="w-6 h-6 text-[#1066e6]" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1e293b]">{s.title}</h3>
                    </div>
                    <p className="text-sm font-semibold text-[#1e293b]/80 mb-3">{s.desc}</p>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#1e293b]/70">
                      {s.bullet.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Form Card */}
        <div className="bg-white rounded-[25px] p-8 md:p-12 border border-slate-100 shadow-lg max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#1e293b]">Đăng Ký Đặt Hẹn Dịch Vụ</h2>
            <p className="text-sm text-[#1e293b]/60 mt-1">Kỹ thuật viên sẽ liên hệ lại xác nhận lịch hẹn trong 10 phút.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-[#1e293b]/70 uppercase tracking-wider mb-2">Họ và Tên</label>
              <input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#f5f9ff] border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1066e6] transition-all font-sans"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-[#1e293b]/70 uppercase tracking-wider mb-2">Số điện thoại liên hệ</label>
              <input
                id="phone"
                type="tel"
                placeholder="0989577792"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#f5f9ff] border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1066e6] transition-all font-sans"
              />
            </div>

            <div>
              <label htmlFor="service" className="block text-xs font-bold text-[#1e293b]/70 uppercase tracking-wider mb-2">Yêu cầu cần dịch vụ</label>
              <select
                id="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full bg-[#f5f9ff] border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1066e6] transition-all font-sans"
              >
                <option value="Sửa máy lạnh">Sửa chữa máy lạnh / tủ lạnh / máy giặt</option>
                <option value="Vệ sinh máy lạnh">Vệ sinh máy lạnh / máy giặt</option>
                <option value="Lắp đặt di dời">Lắp đặt, tháo dỡ, di dời thiết bị</option>
                <option value="Bảo trì định kỳ">Bảo trì dòng điện, bơm gas định kỳ</option>
                <option value="Trao đổi mua bán">Trao đổi cũ - mới / Thanh lý cũ</option>
              </select>
            </div>

            <div>
              <label htmlFor="note" className="block text-xs font-bold text-[#1e293b]/70 uppercase tracking-wider mb-2">Ghi chú (nếu có)</label>
              <textarea
                id="note"
                rows={3}
                placeholder="Máy lạnh hiệu Daikin chớp đèn đỏ không lạnh..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full bg-[#f5f9ff] border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1066e6] transition-all font-sans"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-semibold">{error}</p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#1066e6] hover:bg-[#094cb0] text-white py-4 rounded-xl font-bold transition-all shadow-md shadow-[#1066e6]/20 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              Gửi yêu cầu sửa chữa
            </button>
          </form>

          {submitted && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-sm font-semibold flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              Gửi lịch hẹn thành công! Kỹ thuật viên sẽ liên hệ lại ngay.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
