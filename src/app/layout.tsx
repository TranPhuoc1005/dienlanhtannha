import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Điện Lạnh Tận Nhà | Sửa Chữa, Lắp Đặt, Vệ Sinh Điện Lạnh TP.HCM",
  description: "Dịch vụ Điện Lạnh Tận Nhà chuyên nghiệp: Sửa chữa, Lắp đặt, Vệ sinh, Bảo trì máy lạnh, tủ lạnh, máy giặt, máy nước nóng tại TP.HCM. Kỹ thuật viên đến nhanh sau 30 phút. Giá rẻ, bảo hành dài hạn. Hotline: 0989.577.792 - 0932.188.892 (Anh Tâm).",
  keywords: [
    "điện lạnh tận nhà", 
    "sửa máy lạnh tại nhà", 
    "vệ sinh máy lạnh", 
    "bảo trì máy lạnh", 
    "sửa máy giặt quận bình tân", 
    "sửa tủ lạnh tphcm", 
    "lắp đặt máy lạnh",
    "thanh lý tủ lạnh cũ",
    "trao đổi máy lạnh cũ mới"
  ],
  authors: [{ name: "Điện Lạnh Tận Nhà" }],
  robots: "index, follow",
  openGraph: {
    title: "Điện Lạnh Tận Nhà | Sửa Chữa, Lắp Đặt, Vệ Sinh Điện Lạnh Uy Tín TP.HCM",
    description: "Gọi ngay 0989.577.792. Dịch vụ sửa chữa, vệ sinh máy lạnh, máy giặt, tủ lạnh chuyên nghiệp tại nhà. Đội ngũ tay nghề cao, uy tín, minh bạch.",
    url: "https://dienlanhtannha.com",
    siteName: "Điện Lạnh Tận Nhà",
    locale: "vi_VN",
    type: "website",
  },
  alternates: {
    canonical: "https://dienlanhtannha.com",
  },
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-[#f5f9ff] text-[#1e293b]">
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
