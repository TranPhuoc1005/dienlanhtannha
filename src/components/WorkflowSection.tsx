"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Phone, FileText, MapPin, Wrench, ShieldCheck } from "lucide-react";

const steps = [
  {
    title: "Tiếp nhận yêu cầu",
    desc: "Khách hàng liên hệ qua Hotline hoặc Zalo. Đội ngũ trực tổng đài ghi nhận thông tin tình trạng máy và hẹn lịch thuận tiện nhất.",
    icon: Phone,
  },
  {
    title: "Khảo sát & Tư vấn",
    desc: "Đưa ra phương án xử lý sơ bộ. Kỹ thuật viên chuẩn bị trang thiết bị chuyên dụng tương ứng với tình hình thực tế.",
    icon: FileText,
  },
  {
    title: "Kỹ thuật đến tận nơi",
    desc: "Kỹ thuật viên di chuyển nhanh chóng đến địa chỉ yêu cầu sau 30 phút, tiến hành kiểm tra đo đạc chi tiết thiết bị hoàn toàn miễn phí.",
    icon: MapPin,
  },
  {
    title: "Sửa chữa & Lắp đặt",
    desc: "Tiến hành sửa chữa, vệ sinh hoặc lắp đặt sau khi khách hàng đồng ý bảng giá công khai. Quy trình sạch sẽ, đúng kỹ thuật.",
    icon: Wrench,
  },
  {
    title: "Nghiệm thu & Bảo hành",
    desc: "Khách hàng chạy thử máy nghiệm thu hài lòng, dán tem bảo hành và viết hóa đơn thanh toán. Chăm sóc sau dịch vụ chu đáo.",
    icon: ShieldCheck,
  },
];

export default function WorkflowSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Smooth the scroll line height drawing
  const scaleYSpring = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
  });

  return (
    <section ref={containerRef} className="py-24 bg-[#f5f9ff] relative overflow-hidden z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase font-extrabold text-[#0a84ff] tracking-widest"
          >
            Quy trình làm việc
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1e293b]"
          >
            5 Bước Dịch Vụ Tận Nơi Nhanh Chóng
          </motion.h3>
        </div>

        {/* Timeline container */}
        <div className="relative mt-12 max-w-4xl mx-auto">
          {/* Vertical central line (Desktop) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] bg-slate-200 transform md:-translate-x-1/2 rounded-full overflow-hidden" aria-hidden="true">
            <motion.div
              className="w-full bg-[#0a84ff] origin-top h-full"
              style={{ scaleY: scaleYSpring }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-12 md:space-y-20 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-stretch ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Left / Right content holder */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8 flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 35 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="bg-white/90 backdrop-blur-sm p-6 rounded-[20px] border border-slate-100 shadow-sm relative group hover:border-[#0a84ff]/30 transition-all duration-300"
                    >
                      {/* Triangle pointer for desktop */}
                      <div
                        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-b border-l border-slate-100 rotate-45 ${
                          isEven
                            ? "-left-2 border-slate-100/0 border-b-slate-100 border-l-slate-100"
                            : "-right-2 border-slate-100/0 border-t-slate-100 border-r-slate-100 rotate-225"
                        }`}
                        aria-hidden="true"
                      />

                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-bold text-[#0a84ff] uppercase tracking-wider bg-[#f5f9ff] px-2.5 py-1 rounded-lg">
                          Bước {index + 1}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-[#1e293b] group-hover:text-[#0a84ff] transition-colors">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-xs sm:text-sm text-[#1e293b]/70 leading-relaxed">
                        {step.desc}
                      </p>
                    </motion.div>
                  </div>

                  {/* Icon separator node */}
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center z-10">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                      className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#0a84ff] text-white flex items-center justify-center shadow-md border-4 border-[#f5f9ff]"
                    >
                      <Icon className="w-4.5 h-4.5 md:w-5 md:h-5" aria-hidden="true" />
                    </motion.div>
                  </div>

                  {/* Empty spacing for desktop */}
                  <div className="hidden md:block w-1/2" aria-hidden="true" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
