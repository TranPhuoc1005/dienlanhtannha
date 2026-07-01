"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import CounterSection from "@/components/CounterSection";
import ProductsSection from "@/components/ProductsSection";
import WorkflowSection from "@/components/WorkflowSection";
import DeliveryCanvas from "@/components/DeliveryCanvas";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full min-h-screen flex flex-col"
    >
      {/* 1. Hero banner with Ken Burns background */}
      <HeroSection />

      {/* 2. Core services grid */}
      <ServicesSection />

      {/* 3. Achievements / Counter stats */}
      <CounterSection />

      {/* 4. Product showcase with Quick filter tabs */}
      <ProductsSection />

      {/* 5. Service delivery timeline */}
      <WorkflowSection />

      {/* 6. Shipping & Delivery Canvas Animation */}
      <DeliveryCanvas />

      {/* 7. Customer feedback carousel */}
      <TestimonialsSection />

      {/* 8. Quick phone / Booking CTA */}
      <CTASection />
    </motion.div>
  );
}
