"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Wrench, Star, Clock3, BadgeCheck } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: ShieldCheck,
    title: "Uy tín hàng đầu",
    desc: "Chúng tôi coi trọng uy tín hơn doanh số. Kiểm tra đúng lỗi, sửa đúng kỹ thuật, dán tem và viết phiếu bảo hành minh bạch.",
  },
  {
    icon: Wrench,
    title: "Chuyên nghiệp",
    desc: "Đội ngũ kỹ thuật viên tay nghề vững vàng, được đào tạo chuyên sâu về kỹ thuật điện lạnh và kỹ năng giao tiếp chu đáo.",
  },
  {
    icon: Star,
    title: "100% Tận tâm",
    desc: "Tư vấn nhiệt tình, tìm phương án tối ưu để tiết kiệm chi phí cho khách hàng. Hỗ trợ hết mình kể cả ngày nghỉ lễ.",
  },
  {
    icon: Clock3,
    title: "Nhanh chóng",
    desc: "Mạng lưới kỹ thuật phủ rộng khắp TP.HCM. Có mặt đúng hẹn sau 30 phút tiếp nhận cuộc gọi từ khách hàng.",
  },
];

export default function GioiThieu() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-[#f5f9ff] min-h-screen py-12 md:py-20 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subpage Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold text-[#1066e6] tracking-widest">Về Chúng Tôi</span>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1e293b]">
            Điện Lạnh Tận Nhà
          </h1>
          <div className="h-1 bg-[#1066e6] w-16 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-[#1e293b]/70 text-base md:text-lg">
            Hành trình xây dựng niềm tin từ chất lượng dịch vụ sửa chữa và bảo dưỡng thiết bị gia dụng tại khu vực TP.HCM.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1e293b]">
              Chúng tôi là ai?
            </h2>
            <p className="text-[#1e293b]/75 text-sm sm:text-base leading-relaxed">
              Thành lập từ một đội ngũ thợ điện lạnh tay nghề cao hoạt động tự do tại TP.HCM, **Điện Lạnh Tận Nhà** đã phát triển thành một địa chỉ uy tín quen thuộc phục vụ hàng ngàn hộ gia đình, văn phòng và doanh nghiệp.
            </p>
            <p className="text-[#1e293b]/75 text-sm sm:text-base leading-relaxed">
              Chúng tôi chuyên nhận trao đổi cũ - mới, sửa chữa, vệ sinh và bảo dưỡng toàn bộ hệ thống máy lạnh (treo tường, âm trần), tủ lạnh, máy giặt, máy nước nóng của hầu hết các thương hiệu nổi tiếng như Daikin, Panasonic, Toshiba, LG, Samsung, Electrolux...
            </p>
            <p className="text-[#1e293b]/75 text-sm sm:text-base leading-relaxed">
              Với phương châm **&ldquo;Nhanh chóng - Hiệu quả - Giá rẻ&rdquo;**, Điện Lạnh Tận Nhà mong muốn đồng hành bền vững cùng sự tiện nghi của ngôi nhà bạn.
            </p>
          </div>
          
          {/* Card Showcase */}
          <div className="bg-gradient-to-tr from-[#094cb0] to-[#1066e6] p-8 rounded-[30px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BadgeCheck className="w-6 h-6" />
              Cam Kết Chất Lượng Dịch Vụ
            </h3>
            <ul className="space-y-4 text-white/90 text-sm sm:text-base">
              <li className="flex items-start gap-2.5">
                <span className="text-sky-300 font-bold shrink-0">✓</span>
                Kỹ thuật viên lành nghề, trung thực, lịch sự.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sky-300 font-bold shrink-0">✓</span>
                Linh kiện thay thế chính hãng 100%, bảo hành dài hạn.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sky-300 font-bold shrink-0">✓</span>
                Báo giá rõ ràng trước khi tiến hành sửa chữa.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sky-300 font-bold shrink-0">✓</span>
                Bảo hành nghiêm túc, chu đáo, phục vụ nhanh 24/7.
              </li>
            </ul>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1e293b] text-center mb-12">
            Giá Trị Cốt Lõi Của Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm transition-all duration-300 group"
                >
                  <div className="mb-4 inline-flex p-3 bg-[#f5f9ff] rounded-xl text-[#1066e6] group-hover:scale-110 group-hover:rotate-8 transition-all">
                    <Icon className="w-6 h-6 text-[#1066e6]" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1e293b] mb-2">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-[#1e293b]/70 leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-[20px] p-8 border border-slate-100 shadow-sm text-center max-w-2xl mx-auto mt-16">
          <h3 className="text-xl font-bold text-[#1e293b]">Cần Hỗ Trợ Tư Vấn Ngay?</h3>
          <p className="text-[#1e293b]/70 text-sm mt-2">Chúng tôi phục vụ khách hàng trên toàn địa bàn các quận, huyện tại TP.HCM.</p>
          <div className="mt-6 flex justify-center gap-4">
            <a href="tel:0989577792" className="bg-[#1066e6] hover:bg-[#094cb0] text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm transition-all">
              Gọi Sửa Máy Ngay
            </a>
            <Link href="/lien-he" className="bg-[#f5f9ff] text-[#1066e6] border border-[#1066e6]/20 hover:bg-[#1066e6]/5 font-bold px-6 py-3 rounded-xl text-sm transition-all">
              Đặt Lịch Hẹn
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
