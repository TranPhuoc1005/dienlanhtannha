"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Phone, MessageCircle } from "lucide-react";
import Image from "next/image";
import { dbService, Product } from "@/lib/dbService";

interface MappedProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  capacity: string;
  priceRange: string;
  price: string;
  status: string;
  badge: string;
  image: string;
  desc: string;
  specs: Record<string, string>;
}

function ProductCard({ p, onClick }: { p: MappedProduct; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="bg-white rounded-[20px] overflow-hidden border border-slate-100 shadow-sm flex flex-col group cursor-pointer hover:border-[#1066e6]/30 transition-all duration-300 glow-border-hover frost-container hover:shadow-md"
    >
      {/* Dynamic Water Drop Condensation simulation inside the card cover */}
      <div className="absolute top-2 left-1/3 water-drop opacity-0 group-hover:opacity-100 z-10" style={{ animationDelay: "0s" }} />
      <div className="absolute top-8 right-1/4 water-drop opacity-0 group-hover:opacity-100 z-10" style={{ animationDelay: "2s" }} />

      {/* Photo Visual */}
      <div className="h-48 relative bg-gradient-to-b from-[#f5f9ff] to-white overflow-hidden flex items-center justify-center select-none border-b border-slate-100/80 ice-shimmer">
        {/* Frost Layer overlay */}
        <div className="frost-overlay" />
        
        {/* Actual Realistic Product Image */}
        <div className="relative w-36 h-36 group-hover:scale-105 transition-transform duration-500 z-[1]">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-2"
          />
        </div>
        
        {/* Breathing animated badge */}
        <motion.span
          animate={{ opacity: [0.75, 1, 0.75], scale: [0.98, 1, 0.98] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
          className="absolute top-4 left-4 bg-emerald-500 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm z-[3]"
        >
          {p.badge}
        </motion.span>
      </div>

      {/* Body Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1066e6] uppercase tracking-wider">{p.category}</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{p.status}</span>
          </div>
          <h3 className="text-base font-bold text-[#1e293b] group-hover:text-[#1066e6] transition-colors">{p.name}</h3>
          <p className="text-xs text-[#1e293b]/60 leading-relaxed mt-2 line-clamp-2">{p.desc}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between">
          <span className="text-base font-extrabold text-[#1066e6]">{p.price}</span>
          <span className="text-xs font-bold text-[#1066e6] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Xem chi tiết
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SanPham() {
  const [selectedCat, setSelectedCat] = useState("Tất Cả");
  const [selectedBrand, setSelectedBrand] = useState("Tất Cả");
  const [selectedPrice, setSelectedPrice] = useState("Tất Cả");
  const [activeProduct, setActiveProduct] = useState<MappedProduct | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeProduct]);

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await dbService.getProducts();
        setDbProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ["Tất Cả", "Máy Lạnh", "Tủ Lạnh", "Máy Giặt", "Khác"];
  const brands = ["Tất Cả", "Daikin", "Panasonic", "LG", "Khác"];
  const priceRanges = ["Tất Cả", "Dưới 5 triệu", "5-8 triệu", "Trên 8 triệu"];

  // Mapping from DB format to page format
  const mappedProducts: MappedProduct[] = dbProducts.map((p) => {
    const nameLower = p.name.toLowerCase();
    
    // Brand
    let brand = "Khác";
    if (nameLower.includes("daikin")) brand = "Daikin";
    else if (nameLower.includes("panasonic")) brand = "Panasonic";
    else if (nameLower.includes("lg")) brand = "LG";

    // Capacity
    let capacity = "Khác";
    if (nameLower.includes("1.5 hp") || nameLower.includes("1.5hp")) capacity = "1.5 HP";
    else if (nameLower.includes("1 hp") || nameLower.includes("1hp")) capacity = "1 HP";
    else if (nameLower.includes("9 kg") || nameLower.includes("9kg")) capacity = "9 kg";
    else if (nameLower.includes("322")) capacity = "Trên 300L";
    else if (nameLower.includes("220") || nameLower.includes("300")) capacity = "Dưới 300L";

    // Price range
    let priceRange = "Dưới 5 triệu";
    if (p.price >= 5000000 && p.price <= 8000000) priceRange = "5-8 triệu";
    else if (p.price > 8000000) priceRange = "Trên 8 triệu";

    // Specs
    let specs: Record<string, string> = {
      "Thời gian bảo hành": "6 tháng tại cửa hàng"
    };
    if (p.category === "Máy Lạnh") {
      specs = {
        "Công suất làm lạnh": nameLower.includes("1.5") ? "1.5 HP - 11.900 BTU" : "1.0 HP - 9.000 BTU",
        "Công nghệ Inverter": "Có (Tiết kiệm điện)",
        "Loại gas": "R32 (Thân thiện môi trường)",
        "Nơi sản xuất": "Thái Lan",
        "Thời gian bảo hành": "6 tháng tại cửa hàng"
      };
    } else if (p.category === "Tủ Lạnh") {
      specs = {
        "Dung tích": "322 Lít",
        "Số cửa": "2 cửa (Ngăn đá dưới)",
        "Công nghệ Inverter": "Có (Tiết kiệm điện)",
        "Khử mùi kháng khuẩn": "Blue Ag+ kháng khuẩn 99.99%",
        "Thời gian bảo hành": "6 tháng tại cửa hàng"
      };
    } else if (p.category === "Máy Giặt") {
      specs = {
        "Khối lượng giặt": "9.0 kg",
        "Kiểu máy giặt": "Lồng ngang (Cửa trước)",
        "Động cơ": "Truyền động trực tiếp - AI DD",
        "Tiết kiệm điện": "Inverter",
        "Thời gian bảo hành": "6 tháng tại cửa hàng"
      };
    } else if (p.category === "Khác") {
      specs = {
        "Dung tích": nameLower.includes("đông") ? "220 Lít" : "4.5 kW",
        "Dàn lạnh/Công suất": nameLower.includes("đông") ? "Đồng nguyên chất" : "4500 W",
        "Tính năng nổi bật": nameLower.includes("đông") ? "Đông sâu -24°C" : "Chống giật ELCB",
        "Thời gian bảo hành": "6 tháng tại cửa hàng"
      };
    }

    return {
      id: p.id.toString(),
      name: p.name,
      category: p.category,
      brand,
      capacity,
      priceRange,
      price: p.price > 0 ? p.price.toLocaleString("vi-VN") + "đ" : "Liên hệ báo giá",
      status: p.status || "Mới 95%",
      badge: p.badge || "Giá Tốt",
      image: p.image_url || "/products/ml-daikin.png",
      desc: p.desc || "Thiết bị điện lạnh chất lượng cao đã qua kiểm định kỹ lưỡng.",
      specs
    };
  });

  // Filter logic
  const filteredProducts = mappedProducts.filter((p) => {
    const matchCat = selectedCat === "Tất Cả" || p.category === selectedCat;
    const matchBrand = selectedBrand === "Tất Cả" || p.brand === selectedBrand;
    const matchPrice = selectedPrice === "Tất Cả" || p.priceRange === selectedPrice;
    return matchCat && matchBrand && matchPrice;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-[#f5f9ff] min-h-screen py-12 md:py-20 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold text-[#1066e6] tracking-widest">Sản phẩm thanh lý</span>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1e293b]">
            Danh Sách Thiết Bị Giá Tốt
          </h1>
          <div className="h-1 bg-[#1066e6] w-16 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-[#1e293b]/70 text-sm sm:text-base leading-relaxed">
            Các thiết bị điện lạnh cũ nguyên zin được kỹ thuật viên của Điện Lạnh Tận Nhà kiểm thử, vệ sinh và bảo dưỡng kỹ trước khi bàn giao.
          </p>
        </div>

        {/* Filter controls sidebar/topbar */}
        <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-sm mb-12 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          {/* Category tabs */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#1e293b]/55 uppercase tracking-wider">Danh mục</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCat === cat
                      ? "bg-[#1066e6] text-white"
                      : "bg-[#f5f9ff] text-[#1e293b]/70 hover:bg-[#1066e6]/5 border border-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand select */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#1e293b]/55 uppercase tracking-wider">Hãng sản xuất</span>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedBrand === brand
                      ? "bg-[#1066e6] text-white"
                      : "bg-[#f5f9ff] text-[#1e293b]/70 hover:bg-[#1066e6]/5 border border-slate-100"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Price select */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#1e293b]/55 uppercase tracking-wider">Tầm giá</span>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((pr) => (
                <button
                  key={pr}
                  onClick={() => setSelectedPrice(pr)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPrice === pr
                      ? "bg-[#1066e6] text-white"
                      : "bg-[#f5f9ff] text-[#1e293b]/70 hover:bg-[#1066e6]/5 border border-slate-100"
                  }`}
                >
                  {pr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            Đang tải danh sách sản phẩm...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} p={p} onClick={() => setActiveProduct(p)} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#1e293b]/55 font-bold">Không tìm thấy sản phẩm phù hợp bộ lọc!</p>
            <button
              onClick={() => {
                setSelectedCat("Tất Cả");
                setSelectedBrand("Tất Cả");
                setSelectedPrice("Tất Cả");
              }}
              className="mt-4 text-[#1066e6] font-bold text-sm hover:underline cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Product Specification Modal (Pop-up) */}
      <AnimatePresence>
        {activeProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[25px] max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProduct(null)}
                className="absolute top-4 right-4 z-10 text-[#1e293b] hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer bg-white/80 backdrop-blur-sm shadow-sm"
                aria-label="Đóng bảng thông số"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Banner - Product Showcase in a light frosty studio showcase */}
              {(() => {
                const imageUrls = activeProduct.image.split(/(?<!base64),/).map(s => s.trim()).filter(Boolean);
                return (
                  <div className="bg-gradient-to-b from-[#f5f9ff] to-white flex flex-col items-center justify-center relative select-none border-b border-slate-100 p-6 pb-4">
                    <div className="frost-overlay opacity-100 backdrop-blur-[2px] pointer-events-none" />
                    
                    {/* Main Image */}
                    <div className="relative w-40 h-40 z-[1] mb-4">
                      <Image
                        src={imageUrls[activeImageIndex] || "/products/ml-daikin.png"}
                        alt={activeProduct.name}
                        fill
                        sizes="160px"
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Image thumbnails list */}
                    {imageUrls.length > 1 && (
                      <div className="flex justify-center gap-2 z-[1] w-full overflow-x-auto py-1">
                        {imageUrls.map((url, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`w-12 h-12 rounded-lg overflow-hidden border bg-white p-0.5 transition-all shadow-sm cursor-pointer shrink-0 ${
                              activeImageIndex === idx
                                ? "border-primary scale-105 ring-2 ring-primary/20"
                                : "border-slate-200 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <div className="relative w-full h-full">
                              <img
                                src={url}
                                alt={`${activeProduct.name} thumbnail ${idx}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="text-[10px] font-extrabold tracking-wider bg-[#f5f9ff] text-[#1066e6] uppercase px-2 py-0.5 rounded-md">
                      {activeProduct.category}
                    </span>
                    <span className="text-[10px] font-extrabold tracking-wider bg-emerald-50 text-emerald-500 uppercase px-2 py-0.5 rounded-md">
                      {activeProduct.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1e293b]">{activeProduct.name}</h2>
                  <p className="text-xs text-[#1e293b]/70 mt-2 leading-relaxed">{activeProduct.desc}</p>
                </div>

                {/* Specs List Table */}
                <div>
                  <h3 className="text-xs font-bold text-[#1e293b]/50 uppercase tracking-widest mb-3">Thông số kỹ thuật</h3>
                  <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                    {Object.entries(activeProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex p-3 justify-between bg-slate-50/30">
                        <span className="font-semibold text-[#1e293b]/60">{key}</span>
                        <span className="font-bold text-[#1e293b]">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Inquiry CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-bold text-[#1e293b]/50 uppercase tracking-wider block">Giá bán thanh lý</span>
                    <span className="text-xl font-extrabold text-[#1066e6]">{activeProduct.price}</span>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <a
                      href={`https://zalo.me/0932188892?text=Tôi%20muốn%20hỏi%20sản%20phẩm%20${activeProduct.id}%20-%20${encodeURIComponent(activeProduct.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#0068ff] hover:bg-[#094cb0] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat Zalo
                    </a>
                    <a
                      href="tel:0989577792"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#1066e6] hover:bg-[#094cb0] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      Gọi điện
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
