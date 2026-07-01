"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { dbService, Product } from "@/lib/dbService";

const categories = ["Tất Cả", "Máy Lạnh", "Tủ Lạnh", "Máy Giặt", "Khác"];

function ProductCard({ p }: { p: Product }) {
  const imageUrls = p.image_url ? p.image_url.split(/(?<!base64),/).map(s => s.trim()).filter(Boolean) : [];
  const imageUrl = imageUrls[0] || "/products/ml-daikin.png";
  const badgeText = p.badge || (p.stock > 0 ? "Còn hàng" : "Hết hàng");
  const statusText = p.status || "Mới 95%";
  const descText = p.desc || "Thiết bị điện lạnh chất lượng cao đã qua kiểm định kỹ lưỡng.";
  const priceText = p.price > 0 ? p.price.toLocaleString("vi-VN") + "đ" : "Liên hệ báo giá";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white rounded-[20px] overflow-hidden border border-slate-100 shadow-sm flex flex-col group relative glow-border-hover frost-container transition-all duration-300 hover:shadow-md"
    >
      {/* Dynamic Water Drop Condensation simulation inside the card cover */}
      <div className="absolute top-2 left-1/3 water-drop opacity-0 group-hover:opacity-100 z-10" style={{ animationDelay: "0s" }} />
      <div className="absolute top-8 right-1/4 water-drop opacity-0 group-hover:opacity-100 z-10" style={{ animationDelay: "2s" }} />
      
      {/* Image wrapper */}
      <div className="h-56 relative bg-gradient-to-b from-[#f5f9ff] to-white overflow-hidden flex items-center justify-center select-none border-b border-slate-100/80 ice-shimmer">
        {/* Frost Layer overlay */}
        <div className="frost-overlay" />
        
        {/* Actual Realistic Product Image */}
        <div className="relative w-44 h-44 group-hover:scale-105 transition-transform duration-500 z-[1]">
          <Image
            src={imageUrl}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-2"
          />
        </div>
        
        {/* Dark gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[2]" />

        {/* Sliding action button on hover */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <a
            href={`https://zalo.me/0932188892?text=Tôi%20quan%20tâm%20sản%20phẩm%20${encodeURIComponent(p.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white py-3 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            Liên hệ Zalo tư vấn
          </a>
        </div>

        {/* Breathing animated badge */}
        <motion.span
          animate={{ opacity: [0.75, 1, 0.75], scale: [0.98, 1, 0.98] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
          className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm z-[3]"
        >
          {badgeText}
        </motion.span>
      </div>

      {/* Body Details */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{p.category}</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-0.5 rounded-full">{statusText}</span>
          </div>
          <h4 className="text-base font-bold text-[#1e293b] group-hover:text-primary transition-colors line-clamp-1">
            {p.name}
          </h4>
          <p className="text-xs text-[#1e293b]/60 leading-relaxed mt-2 line-clamp-2">
            {descText}
          </p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between">
          <span className="text-base font-extrabold text-primary">{priceText}</span>
          <Link href="/san-pham" className="text-xs font-bold text-[#1e293b]/50 hover:text-primary inline-flex items-center gap-1">
            Xem tất cả
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductsSection() {
  const [selectedCat, setSelectedCat] = useState("Tất Cả");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await dbService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
              className="text-xs uppercase font-extrabold text-primary tracking-widest"
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
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-brand-light text-[#1e293b]/70 hover:bg-primary/5 hover:text-primary border border-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid and Animation */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            Đang tải sản phẩm...
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
