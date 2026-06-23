"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Trang Chủ", href: "/" },
    { name: "Giới Thiệu", href: "/gioi-thieu" },
    { name: "Dịch Vụ", href: "/dich-vu" },
    { name: "Sản Phẩm", href: "/san-pham" },
    { name: "Liên Hệ", href: "/lien-he" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "h-16 glass-header shadow-md"
          : "h-20 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Link */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            animate={{ scale: scrolled ? 0.95 : 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <div className="relative w-10 h-10 group-hover:rotate-12 transition-transform duration-300 filter drop-shadow-md">
              <Image
                src="/logo.png"
                alt="Logo Điện Lạnh Tận Nhà"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-lg md:text-xl text-[#1e293b] tracking-wider">
              ĐIỆN LẠNH TẬN NHÀ
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-semibold text-sm transition-colors py-2 ${
                  isActive ? "text-[#0a84ff]" : "text-[#1e293b]/70 hover:text-[#0a84ff]"
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0a84ff] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Header CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:0989577792"
            className="flex items-center gap-2 bg-[#0a84ff] hover:bg-[#0056b3] text-white px-4 py-2 rounded-2xl font-bold text-sm transition-all shadow-md shadow-[#0a84ff]/20 btn-pulse cursor-pointer"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            0989.577.792
          </a>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#1e293b] p-2 hover:bg-[#0a84ff]/10 rounded-xl transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-b border-[#0a84ff]/10 glass-header absolute top-full left-0 right-0 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-2xl font-semibold text-sm transition-colors ${
                      isActive
                        ? "bg-[#0a84ff]/10 text-[#0a84ff]"
                        : "text-[#1e293b]/70 hover:bg-[#0a84ff]/5 hover:text-[#0a84ff]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 px-4">
                <a
                  href="tel:0989577792"
                  className="flex items-center justify-center gap-2 bg-[#0a84ff] hover:bg-[#0056b3] text-white py-3 rounded-2xl font-bold transition-all shadow-md shadow-[#0a84ff]/25"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  Gọi Ngay: 0989.577.792
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
