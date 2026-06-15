"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

export default function FloatingContact() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Generate ripple circle coordinate relative to button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);
    
    // Cleanup ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-4" aria-label="Liên hệ nhanh">
      {/* Zalo Button */}
      <motion.a
        href="https://zalo.me/0932188892"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleButtonClick}
        className="relative w-14 h-14 bg-[#0068ff] text-white rounded-full flex flex-col items-center justify-center shadow-xl cursor-pointer overflow-hidden border border-white/20 select-none"
        animate={{
          y: [0, -10, 0, -5, 0],
        }}
        transition={{
          repeat: Infinity,
          repeatDelay: 5, // Bounce every 5 seconds
          duration: 0.8,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Render interactive ripples */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute bg-white/40 rounded-full pointer-events-none"
              style={{
                width: 100,
                height: 100,
                left: ripple.x - 50,
                top: ripple.y - 50,
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
        
        {/* Zalo signature style icon */}
        <MessageCircle className="w-5 h-5" aria-hidden="true" />
        <span className="text-[9px] font-extrabold tracking-widest uppercase leading-none mt-0.5">Zalo</span>
      </motion.a>

      {/* Floating Hotline Button */}
      <motion.a
        href="tel:0989577792"
        onClick={handleButtonClick}
        className="relative w-14 h-14 bg-[#0a84ff] text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer overflow-hidden border border-white/20 btn-pulse"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute bg-white/45 rounded-full pointer-events-none"
              style={{
                width: 100,
                height: 100,
                left: ripple.x - 50,
                top: ripple.y - 50,
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
        <Phone className="w-6 h-6 animate-pulse" aria-hidden="true" />
      </motion.a>
    </div>
  );
}
