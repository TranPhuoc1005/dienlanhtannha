"use client";

import { motion } from "framer-motion";
import { Wrench, Hammer, Droplets, ShieldCheck, RefreshCw, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Sửa Chữa Điện Lạnh",
    description: "Sửa chữa nhanh chóng, triệt để các lỗi máy lạnh, máy giặt, tủ lạnh, lò vi sóng. Thay thế linh kiện chính hãng, bảo hành dài hạn.",
    icon: Wrench,
    link: "/dich-vu#sua-chua",
  },
  {
    title: "Lắp Đặt Thiết Bị",
    description: "Khảo sát địa hình, tư vấn công suất phù hợp và lắp đặt máy lạnh, máy giặt, tủ lạnh đúng tiêu chuẩn an toàn kỹ thuật.",
    icon: Hammer,
    link: "/dich-vu#lap-dat",
  },
  {
    title: "Vệ Sinh Thiết Bị",
    description: "Vệ sinh máy lạnh sâu, sạc gas đầy đủ, vệ sinh lồng giặt máy giặt loại bỏ cặn bẩn, vi khuẩn có hại và mùi hôi.",
    icon: Droplets,
    link: "/dich-vu#ve-sinh",
  },
  {
    title: "Bảo Trì Định Kỳ",
    description: "Kiểm tra dòng điện, đo lường nhiệt độ, nạp gas bổ sung. Gói bảo trì định kỳ cho gia đình, nhà hàng, văn phòng.",
    icon: ShieldCheck,
    link: "/dich-vu#bao-tri",
  },
  {
    title: "Trao Đổi Cũ - Mới",
    description: "Hỗ trợ khách hàng nâng cấp hệ thống điều hòa cũ lên dòng Inverter tiết kiệm điện đời mới với mức bù tiền tối ưu.",
    icon: RefreshCw,
    link: "/dich-vu#trao-doi",
  },
  {
    title: "Thanh Lý Điện Lạnh Cũ",
    description: "Mua bán thanh lý máy lạnh, tủ lạnh, máy giặt cũ giá tốt, bảo hành đầy đủ. Máy chạy êm, tiết kiệm điện năng.",
    icon: Package,
    link: "/dich-vu#thanh-ly",
  },
];

export default function ServicesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Stagger animation for children
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section id="dich-vu" className="py-24 bg-[#f5f9ff] relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase font-extrabold text-[#0a84ff] tracking-widest"
          >
            Dịch Vụ Của Chúng Tôi
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1e293b] leading-tight"
          >
            Giải Pháp Điện Lạnh Toàn Diện
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 60 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1 bg-[#0a84ff] mx-auto mt-4 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-[#1e293b]/70 text-sm sm:text-base leading-relaxed"
          >
            Điện Lạnh Tận Nhà cam kết đem đến dịch vụ chất lượng cao, quy trình minh bạch, kiểm tra tận nơi báo giá rõ ràng, không phát sinh chi phí phụ.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{
                  y: -12, // TranslateY(-12px)
                  scale: 1.03, // Scale 1 -> 1.03
                  borderColor: "#0a84ff", // Blue glow border color
                  boxShadow: "0 20px 40px -15px rgba(10, 132, 255, 0.15)",
                }}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-[20px] border border-slate-100 shadow-sm transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Icon wrapper with custom transition */}
                  <div className="mb-6 inline-flex p-4 bg-[#f5f9ff] rounded-2xl text-[#0a84ff] border border-slate-50 transition-all duration-300">
                    {/* SVG Icon: sizes 32px (28-40px range) with scale(1.1) rotate(8deg) hover animation */}
                    <Icon 
                      className="w-8 h-8 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-8 text-[#0a84ff]" 
                      aria-hidden="true" 
                    />
                  </div>
                  
                  <h4 className="text-xl font-bold text-[#1e293b] mb-3 group-hover:text-[#0a84ff] transition-colors">
                    {service.title}
                  </h4>
                  
                  <p className="text-[#1e293b]/65 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <Link
                  href={service.link}
                  className="inline-flex items-center gap-1.5 text-[#0a84ff] hover:text-[#0056b3] font-bold text-sm group-hover:translate-x-1 transition-transform"
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
