import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Clock3 } from "lucide-react";

// Inline custom SVG component for Facebook to avoid package export incompatibilities
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// Inline custom SVG component for YouTube
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1e293b] text-white/80 pt-16 pb-8 border-t border-white/5 relative z-10 font-sans" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 group-hover:rotate-12 transition-transform duration-300 filter drop-shadow-md">
                <Image
                  src="/logo.png"
                  alt="Logo Điện Lạnh Tận Nhà"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg text-white tracking-wider">
                ĐIỆN LẠNH TẬN NHÀ
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Dịch vụ điện lạnh tại nhà chuyên nghiệp, uy tín hàng đầu TP.HCM. Chuyên lắp đặt, sửa chữa, vệ sinh, bảo trì máy lạnh, tủ lạnh, máy giặt cũ mới với giá cả cạnh tranh nhất.
            </p>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Dịch Vụ Chính</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dich-vu" className="hover:text-[#1066e6] transition-colors">Sửa chữa điện lạnh</Link></li>
              <li><Link href="/dich-vu" className="hover:text-[#1066e6] transition-colors">Lắp đặt thiết bị</Link></li>
              <li><Link href="/dich-vu" className="hover:text-[#1066e6] transition-colors">Vệ sinh máy giặt, máy lạnh</Link></li>
              <li><Link href="/dich-vu" className="hover:text-[#1066e6] transition-colors">Bảo trì định kỳ</Link></li>
              <li><Link href="/dich-vu" className="hover:text-[#1066e6] transition-colors">Trao đổi cũ - mới</Link></li>
              <li><Link href="/dich-vu" className="hover:text-[#1066e6] transition-colors">Thanh lý điện lạnh cũ</Link></li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#1066e6] transition-colors">Trang chủ</Link></li>
              <li><Link href="/gioi-thieu" className="hover:text-[#1066e6] transition-colors">Giới thiệu</Link></li>
              <li><Link href="/dich-vu" className="hover:text-[#1066e6] transition-colors">Bảng giá dịch vụ</Link></li>
              <li><Link href="/san-pham" className="hover:text-[#1066e6] transition-colors">Sản phẩm thanh lý</Link></li>
              <li><Link href="/lien-he" className="hover:text-[#1066e6] transition-colors">Liên hệ & Đặt hẹn</Link></li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Thông Tin Liên Hệ</h3>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-5 h-5 text-[#1066e6] shrink-0 mt-0.5" aria-hidden="true" />
              <span>36 Đường Số 1, Phường Bình Hưng Hòa, Quận Bình Tân, TP.HCM</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Phone className="w-5 h-5 text-[#1066e6] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex flex-col">
                <a href="tel:0989577792" className="hover:text-[#1066e6] transition-colors font-bold">0989.577.792</a>
                <a href="tel:0932188892" className="hover:text-[#1066e6] transition-colors font-bold">0932.188.892 (Anh Tâm)</a>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock3 className="w-5 h-5 text-[#1066e6] shrink-0" aria-hidden="true" />
              <span>Hoạt động: 7:00 - 21:00 (Cả CN & Ngày lễ)</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & socials */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {currentYear} Điện Lạnh Tận Nhà. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#1066e6] hover:scale-110 hover:rotate-[8deg] transition-all duration-300"
              aria-label="Liên kết Facebook"
            >
              <FacebookIcon className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#1066e6] hover:scale-110 hover:rotate-[8deg] transition-all duration-300"
              aria-label="Liên kết Youtube"
            >
              <YoutubeIcon className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
