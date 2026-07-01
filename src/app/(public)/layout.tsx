import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import LoadingScreen from "@/components/LoadingScreen";
import CursorGlow from "@/components/CursorGlow";
import FloatingElements from "@/components/FloatingElements";
import FloatingContact from "@/components/FloatingContact";
import BackToTop from "@/components/BackToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Scroll Progress Bar at the top */}
      <ScrollProgressBar />

      {/* Global Loading Screen */}
      <LoadingScreen />

      {/* Interactive Desktop cursor glow */}
      <CursorGlow />

      {/* Floating snowflakes and gradient shapes */}
      <FloatingElements />

      {/* Sticky Header */}
      <Header />

      {/* Main page content layout */}
      <main className="flex-grow pt-20 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Zalo and Call Quick Actions */}
      <FloatingContact />

      {/* Back To Top Scroll Trigger */}
      <BackToTop />
    </>
  );
}
