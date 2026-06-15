"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Anh Hoàng Nguyễn",
    role: "Khách hàng tại Quận Bình Tân",
    text: "Kỹ thuật viên đến rất đúng giờ, sửa máy lạnh bị chảy nước cực kỳ nhanh chóng. Giá cả minh bạch rõ ràng đúng như báo giá tổng đài, thái độ phục vụ lịch sự và dọn dẹp sạch sẽ sau khi làm.",
    rating: 5,
  },
  {
    name: "Chị Ngọc Mai",
    role: "Khách hàng tại Quận Tân Phú",
    text: "Tôi đặt lịch vệ sinh máy lạnh định kỳ, nhân viên làm việc rất tỉ mỉ, tháo rời mặt nạ rửa sạch sâu. Sau khi rửa xong máy chạy êm ru, lạnh buốt và không còn mùi hôi. Rất đáng đồng tiền bát gạo.",
    rating: 5,
  },
  {
    name: "Chú Năm Sơn",
    role: "Khách hàng tại Quận 12, TP.HCM",
    text: "Tủ lạnh nhà tôi đột ngột không lạnh, gọi Điện Lạnh Tận Nhà có thợ đến kiểm tra ngay sau 25 phút. Thay thế block chính hãng, viết phiếu bảo hành rõ ràng 6 tháng. Dịch vụ chuyên nghiệp rất đáng tin cậy.",
    rating: 5,
  },
  {
    name: "Chị Khánh Linh",
    role: "Khách hàng tại Quận Bình Thạnh",
    text: "Tôi đã thanh lý máy giặt cũ và nâng cấp lên máy giặt Inverter mới tại đây. Thủ tục định giá nhanh chóng, giá thu mua cao và được hỗ trợ vận chuyển lắp đặt tận nhà. Nhân viên tư vấn cực kỳ nhiệt tình.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="danh-gia" className="py-24 bg-white relative overflow-hidden z-10 font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <Quote className="absolute top-10 left-10 w-96 h-96 text-[#0a84ff]" aria-hidden="true" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase font-extrabold text-[#0a84ff] tracking-widest"
          >
            Đánh giá từ khách hàng
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1e293b]"
          >
            Sự Hài Lòng Của Bạn Là Uy Tín Của Chúng Tôi
          </motion.h3>
        </div>

        {/* Carousel Slider */}
        <div 
          className="relative max-w-3xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Card Viewport */}
          <div className="overflow-hidden min-h-[300px] flex items-center justify-center px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                animate={{ opacity: 1, scale: 1.02, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full glass-card p-8 md:p-12 rounded-[20px] relative border border-slate-100 shadow-xl flex flex-col justify-between"
              >
                {/* Quote Icon */}
                <Quote className="absolute top-6 right-8 w-12 h-12 text-[#0a84ff]/10 rotate-180" aria-hidden="true" />

                {/* Rating stars */}
                <div className="flex gap-1 mb-6 text-amber-400">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" aria-hidden="true" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-[#1e293b] text-base sm:text-lg md:text-xl font-medium leading-relaxed italic mb-8">
                  &ldquo;{testimonials[activeIndex].text}&rdquo;
                </p>

                {/* Customer Meta */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-[#0a84ff] to-[#0056b3] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {testimonials[activeIndex].name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e293b]">{testimonials[activeIndex].name}</h4>
                    <p className="text-xs font-semibold text-[#0a84ff] uppercase tracking-wider mt-0.5">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left / Right Arrow navigation buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-[-20px] md:left-[-60px] top-1/2 -translate-y-1/2 bg-white text-[#1e293b] p-3 rounded-full shadow-lg border border-slate-100 cursor-pointer hover:text-[#0a84ff] hover:scale-110 transition-all z-20"
            aria-label="Đánh giá trước"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-[-20px] md:right-[-60px] top-1/2 -translate-y-1/2 bg-white text-[#1e293b] p-3 rounded-full shadow-lg border border-slate-100 cursor-pointer hover:text-[#0a84ff] hover:scale-110 transition-all z-20"
            aria-label="Đánh giá tiếp theo"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Bullet dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  activeIndex === index ? "w-8 bg-[#0a84ff]" : "w-2.5 bg-slate-200"
                }`}
                aria-label={`Đi tới đánh giá ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
