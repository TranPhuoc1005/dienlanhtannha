"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake } from "lucide-react";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after 1.2 seconds
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 bg-[#f5f9ff] flex flex-col items-center justify-center z-[10000]"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -30, 
            transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } 
          }}
        >
          <div className="flex flex-col items-center max-w-xs text-center">
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.8, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-4 bg-white p-4 rounded-3xl shadow-xl border border-white/60 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              >
                <Snowflake className="w-12 h-12 text-[#1066e6]" aria-hidden="true" />
              </motion.div>
            </motion.div>
            
            {/* Brand Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-bold text-[#1e293b] tracking-wider"
            >
              ĐIỆN LẠNH TẬN NHÀ
            </motion.h1>
            
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-xs text-[#1e293b] mt-1 font-semibold tracking-widest uppercase"
            >
              Chuyên Nghiệp • Uy Tín • Tận Tâm
            </motion.p>

            {/* Bottom Progress bar */}
            <div className="w-32 h-1 bg-[#1066e6]/10 rounded-full mt-6 overflow-hidden">
              <motion.div
                className="h-full bg-[#1066e6] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
