"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Calendar, ArrowRight } from "lucide-react";

export default function HeroSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 25, scale: 0.96 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" as const },
        },
    };

    return (
        <section className="relative h-[85vh] md:h-[90vh] flex items-center overflow-hidden bg-black select-none">
            {/* Background with Ken Burns effect */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/hero-bg.png')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut" as const,
                }}
            />

            {/* Dark overlay with color matching style */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e293b]/90 via-[#1e293b]/70 to-transparent" />

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-2xl">
                    {/* Tagline */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1066e6]/20 border border-[#1066e6]/30 text-[#1066e6] text-xs font-bold uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#1066e6] animate-ping" />
                        Có mặt nhanh sau 30 phút • TP.HCM
                    </motion.div>

                    {/* Main Title with Fade Up + Scale */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        Dịch Vụ Điện Lạnh <br />
                        <span className="text-[#1066e6] bg-clip-text">Chuyên Nghiệp Tận Nhà</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemVariants}
                        className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed max-w-lg">
                        Đội ngũ kỹ thuật tay nghề cao, tận tâm, có mặt ngay khi bạn cần. Sửa chữa, lắp đặt, vệ sinh
                        thiết bị nhanh chóng tại TP.HCM. Bảo hành uy tín lên đến 12 tháng.
                    </motion.p>

                    {/* CTA Buttons with Stagger */}
                    <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-4">
                        <a
                            href="tel:0989577792"
                            className="flex items-center gap-2 bg-[#1066e6] hover:bg-[#094cb0] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#1066e6]/30 btn-pulse cursor-pointer">
                            <Phone className="w-5 h-5" aria-hidden="true" />
                            Gọi Sửa Ngay
                        </a>

                        <Link
                            href="/lien-he"
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold transition-all backdrop-blur-sm group cursor-pointer">
                            <Calendar className="w-5 h-5" aria-hidden="true" />
                            Đặt Lịch Hẹn
                            <ArrowRight
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                aria-hidden="true"
                            />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative Bottom Wave Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f5f9ff] to-transparent pointer-events-none" />
        </section>
    );
}
