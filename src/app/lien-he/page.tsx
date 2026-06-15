"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail, MessageCircle, Send } from "lucide-react";

export default function LienHe() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setError("Vui lòng điền đầy đủ các thông tin!");
      return;
    }
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Số điện thoại không đúng định dạng Việt Nam!");
      return;
    }
    setError("");
    setSubmitted(true);
    setFormData({ name: "", phone: "", message: "" });
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
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold text-[#0a84ff] tracking-widest">Liên hệ nhanh</span>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1e293b]">
            Kết Nối Với Chúng Tôi
          </h1>
          <div className="h-1 bg-[#0a84ff] w-16 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-[#1e293b]/70 text-sm sm:text-base leading-relaxed">
            Điện Lạnh Tận Nhà hân hạnh phục vụ quý khách. Liên hệ đặt lịch hoặc phản ánh chất lượng dịch vụ qua các kênh sau.
          </p>
        </div>

        {/* Contact layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Info cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1e293b] mb-4">Thông Tin Cửa Hàng</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Address card */}
              <div className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-[#f5f9ff] text-[#0a84ff] rounded-xl inline-flex mb-4">
                    <MapPin className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-[#1e293b]">Địa chỉ cửa hàng</h3>
                  <p className="text-xs text-[#1e293b]/70 mt-2 leading-relaxed">
                    36 Đường Số 1, Phường Bình Hưng Hòa, Quận Bình Tân, TP.HCM
                  </p>
                </div>
              </div>

              {/* Hotline card */}
              <div className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-[#f5f9ff] text-[#0a84ff] rounded-xl inline-flex mb-4">
                    <Phone className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-[#1e293b]">Số Điện Thoại</h3>
                  <div className="flex flex-col text-xs text-[#1e293b]/70 mt-2">
                    <a href="tel:0989577792" className="hover:text-[#0a84ff] font-bold text-sm text-[#0a84ff]">0989.577.792</a>
                    <a href="tel:0932188892" className="hover:text-[#0a84ff] font-bold text-sm text-[#0a84ff] mt-1">0932.188.892 (Anh Tâm)</a>
                  </div>
                </div>
              </div>

              {/* Open hour card */}
              <div className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-[#f5f9ff] text-[#0a84ff] rounded-xl inline-flex mb-4">
                    <Clock className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-[#1e293b]">Giờ Hoạt Động</h3>
                  <p className="text-xs text-[#1e293b]/70 mt-2">
                    7:00 - 21:00 (Cả Chủ Nhật & Ngày Lễ)
                  </p>
                </div>
              </div>

              {/* Chat online card */}
              <div className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-[#f5f9ff] text-[#0a84ff] rounded-xl inline-flex mb-4">
                    <MessageCircle className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-[#1e293b]">Hỗ trợ Zalo</h3>
                  <p className="text-xs text-[#1e293b]/70 mt-2">
                    Hỗ trợ nhanh 24/7 trực tuyến.
                  </p>
                  <a
                    href="https://zalo.me/0932188892"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#0a84ff] hover:underline mt-2 inline-block"
                  >
                    Nhắn Zalo Ngay
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Map Embed */}
            <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm h-64 overflow-hidden relative">
              <iframe
                title="Bản đồ chỉ đường Điện Lạnh Tận Nhà"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4674720935544!2d106.60014767469733!3d10.775845589373111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752c1598f80479%3A0xe54e6015c61a55b0!2zMzYgxJDGsOG7nW5nIFPhu5EgMSwgQsOsbmggSMawbmcgSMOyYSwgQsOsbmggVMOibiwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1718440000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact form card */}
          <div className="bg-white p-8 rounded-[25px] border border-slate-100 shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#1e293b] mb-2">Gửi Tin Nhắn Cho Chúng Tôi</h2>
              <p className="text-sm text-[#1e293b]/60 mb-6">Đóng góp ý kiến hoặc phản ánh dịch vụ trực tiếp cho chúng tôi.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-[#1e293b]/70 uppercase tracking-wider mb-2">Họ và Tên</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#f5f9ff] border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a84ff] transition-all font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-bold text-[#1e293b]/70 uppercase tracking-wider mb-2">Số Điện Thoại</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="0989577792"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#f5f9ff] border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a84ff] transition-all font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-[#1e293b]/70 uppercase tracking-wider mb-2">Nội dung tin nhắn</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tôi cần đóng góp ý kiến..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#f5f9ff] border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a84ff] transition-all font-sans"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-semibold">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#0a84ff] hover:bg-[#0056b3] text-white py-4 rounded-xl font-bold transition-all shadow-md shadow-[#0a84ff]/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Gửi Phản Hồi
                </button>
              </form>

              {submitted && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-sm font-semibold flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  Tin nhắn của bạn đã được tiếp nhận. Xin cảm ơn đóng góp của bạn!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
