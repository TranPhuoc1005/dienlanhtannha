"use client";

import { motion } from "framer-motion";
import { Phone, Calendar } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0056b3] to-[#0a84ff] relative overflow-hidden z-10 font-sans select-none" aria-labelledby="cta-heading">
      <h2 id="cta-heading" className="sr-only">Kêu gọi hành động</h2>
      
      {/* 3D Glowing Lights Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-30%] left-[-15%] w-[600px] h-[600px] rounded-full bg-white blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-30%] right-[-10%] w-[700px] h-[700px] rounded-full bg-sky-300 blur-3xl"
        />
      </div>

      {/* SVG Wave Effect at bottom */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-10" aria-hidden="true">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <motion.path
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            fill="white"
            animate={{
              d: [
                "M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z",
                "M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,74.7C840,75,960,53,1080,42.7C1200,32,1320,32,1380,32L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z",
                "M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
        >
          Hệ Thống Điện Lạnh Gặp Sự Cố? <br />
          <span className="text-sky-200">Đã Có Điện Lạnh Tận Nhà!</span>
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto leading-relaxed"
        >
          Liên hệ ngay với chúng tôi để được tư vấn miễn phí, đặt lịch kiểm tra tận nhà nhanh chóng sau 30 phút. Khắc phục triệt để lỗi, bảo trì chuyên nghiệp với giá thành tốt nhất.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <a
            href="tel:0932188892"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#0a84ff] hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-black/10 shimmer-btn cursor-pointer"
          >
            <Phone className="w-5 h-5" aria-hidden="true" />
            0932.188.892 (Anh Tâm)
          </a>
          <Link
            href="/lien-he"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold transition-all backdrop-blur-sm cursor-pointer"
          >
            <Calendar className="w-5 h-5" aria-hidden="true" />
            Đặt lịch trực tuyến
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
