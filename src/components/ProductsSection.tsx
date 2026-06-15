"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake, Refrigerator, WashingMachine, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = ["Tất Cả", "Máy Lạnh", "Tủ Lạnh", "Máy Giặt", "Khác"];

const products = [
  {
    id: 1,
    name: "Máy lạnh Daikin Inverter 1.5 HP",
    category: "Máy Lạnh",
    price: "Liên hệ báo giá",
    status: "Mới 95%",
    badge: "Bán chạy",
    icon: Snowflake,
    desc: "Máy lạnh chạy êm ái, tiết kiệm điện vượt trội, làm mát phòng nhanh chóng.",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    id: 2,
    name: "Tủ lạnh Panasonic Inverter 322L",
    category: "Tủ Lạnh",
    price: "Liên hệ báo giá",
    status: "Mới 98%",
    badge: "Tiết Kiệm Điện",
    icon: Refrigerator,
    desc: "Công nghệ cấp đông mềm thế hệ mới Prime Fresh+ bảo quản thực phẩm trọn vị.",
    gradient: "from-sky-400 to-blue-500",
  },
  {
    id: 3,
    name: "Máy giặt LG Lồng Ngang 9 kg",
    category: "Máy Giặt",
    price: "Liên hệ báo giá",
    status: "Mới 99%",
    badge: "Giá Cực Tốt",
    icon: WashingMachine,
    desc: "Hệ thống truyền động trực tiếp AI DD tự động bảo vệ quần áo tối ưu.",
    gradient: "from-cyan-400 to-teal-500",
  },
  {
    id: 4,
    name: "Máy lạnh Panasonic Inverter 1 HP",
    category: "Máy Lạnh",
    price: "Liên hệ báo giá",
    status: "Mới 90%",
    badge: "Giá Rẻ",
    icon: Snowflake,
    desc: "Bộ lọc kháng khuẩn Nanoe-G, cảm biến Eco tích hợp thông minh tiết kiệm năng lượng.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 5,
    name: "Tủ đông Aqua 220L",
    category: "Khác",
    price: "Liên hệ báo giá",
    status: "Mới 97%",
    badge: "Đông Sâu",
    icon: Refrigerator,
    desc: "Hệ thống làm lạnh đa chiều 3D, đông lạnh nhanh, thích hợp trữ đông gia đình.",
    gradient: "from-indigo-400 to-purple-500",
  },
  {
    id: 6,
    name: "Máy nước nóng Ariston 4500W",
    category: "Khác",
    price: "Liên hệ báo giá",
    status: "Mới 99%",
    badge: "Hàng Lướt",
    icon: Zap,
    desc: "Hệ thống an toàn kép TSS, làm nóng tức thì, thiết kế mỏng nhẹ sang trọng.",
    gradient: "from-emerald-400 to-teal-500",
  },
];

export default function ProductsSection() {
  const [selectedCat, setSelectedCat] = useState("Tất Cả");

  const filteredProducts = selectedCat === "Tất Cả"
    ? products
    : products.filter(p => p.category === selectedCat);

  return (
    <section id="san-pham" className="py-24 bg-white relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase font-extrabold text-[#0a84ff] tracking-widest"
            >
              Sản Phẩm Thanh Lý
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1e293b] leading-tight"
            >
              Thiết Bị Điện Lạnh Chất Lượng Cao
            </motion.h3>
          </div>

          {/* Categories */}
          <div className="mt-8 md:mt-0 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? "bg-[#0a84ff] text-white shadow-md shadow-[#0a84ff]/25"
                    : "bg-[#f5f9ff] text-[#1e293b]/70 hover:bg-[#0a84ff]/5 hover:text-[#0a84ff] border border-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid and Animation */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-[20px] overflow-hidden border border-slate-100 shadow-sm flex flex-col group relative"
                >
                  {/* Image wrapper */}
                  <div className="h-56 relative bg-slate-900 overflow-hidden flex items-center justify-center select-none">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${p.gradient} opacity-20`} />
                    
                    {/* Zoom icon mockup instead of raw image placeholders */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                        <Icon className="w-12 h-12 text-white" aria-hidden="true" />
                      </div>
                    </motion.div>
                    
                    {/* Dark gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-[#1e293b]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Sliding action button on hover */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                      <a
                        href={`https://zalo.me/0932188892?text=Tôi%20quan%20tâm%20sản%20phẩm%20${encodeURIComponent(p.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#0a84ff] hover:bg-[#0056b3] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-colors"
                      >
                        Liên hệ Zalo tư vấn
                      </a>
                    </div>

                    {/* Breathing animated badge */}
                    <motion.span
                      animate={{ opacity: [0.65, 1, 0.65], scale: [0.98, 1, 0.98] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                      }}
                      className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm"
                    >
                      {p.badge}
                    </motion.span>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-[#0a84ff] uppercase tracking-wider">{p.category}</span>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-0.5 rounded-full">{p.status}</span>
                      </div>
                      <h4 className="text-lg font-bold text-[#1e293b] group-hover:text-[#0a84ff] transition-colors line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-xs text-[#1e293b]/60 leading-relaxed mt-2 line-clamp-2">
                        {p.desc}
                      </p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-base font-extrabold text-[#0a84ff]">{p.price}</span>
                      <Link href="/san-pham" className="text-xs font-bold text-[#1e293b]/50 hover:text-[#0a84ff] inline-flex items-center gap-1">
                        Xem tất cả
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
