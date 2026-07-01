"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Snowflake } from "lucide-react";

export default function FloatingElements() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth mouse parallax
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse positions between [-0.5, 0.5]
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    if (isDesktop) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Element-specific translations based on mouse springs for 3D parallax depth
  const el1X = useTransform(springX, (x) => x * 35);
  const el1Y = useTransform(springY, (y) => y * 35);

  const el2X = useTransform(springX, (x) => x * -45);
  const el2Y = useTransform(springY, (y) => y * -45);

  const el3X = useTransform(springX, (x) => x * 50);
  const el3Y = useTransform(springY, (y) => y * 50);

  const el4X = useTransform(springX, (x) => x * -25);
  const el4Y = useTransform(springY, (y) => y * -25);

  const el5X = useTransform(springX, (x) => x * 40);
  const el5Y = useTransform(springY, (y) => y * 40);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden="true">
      {/* 1. Snowflake Top Left */}
      <motion.div
        className="absolute top-[15%] left-[6%] text-[#1066e6]/10 hidden md:block"
        style={{ x: el1X, y: el1Y }}
        animate={{
          y: [0, -18, 0],
          rotate: [0, 360],
        }}
        transition={{
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
        }}
      >
        <Snowflake className="w-12 h-12" />
      </motion.div>

      {/* 2. Gradient Circle Top Right */}
      <motion.div
        className="absolute top-[20%] right-[8%] w-40 h-40 rounded-full bg-gradient-to-tr from-[#1066e6]/10 to-[#094cb0]/5 blur-3xl"
        style={{ x: el2X, y: el2Y }}
        animate={{
          y: [0, 25, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3. Snowflake Mid Left */}
      <motion.div
        className="absolute top-[50%] left-[4%] text-[#1066e6]/8"
        style={{ x: el3X, y: el3Y }}
        animate={{
          y: [0, -22, 0],
          rotate: [0, -360],
        }}
        transition={{
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
        }}
      >
        <Snowflake className="w-9 h-9" />
      </motion.div>

      {/* 4. Gradient Circle Bottom Left */}
      <motion.div
        className="absolute bottom-[20%] left-[8%] w-56 h-56 rounded-full bg-gradient-to-br from-[#1066e6]/5 to-[#094cb0]/10 blur-3xl"
        style={{ x: el4X, y: el4Y }}
        animate={{
          y: [0, -35, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 5. Snowflake Bottom Right */}
      <motion.div
        className="absolute bottom-[15%] right-[5%] text-[#1066e6]/12 hidden md:block"
        style={{ x: el5X, y: el5Y }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, 360],
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
      >
        <Snowflake className="w-14 h-14" />
      </motion.div>

      {/* 6. Dashed Light Curve (SVG) */}
      <svg
        className="absolute top-[40%] right-[3%] w-[320px] h-[220px] opacity-10 stroke-[#1066e6] hidden lg:block"
        viewBox="0 0 300 200"
        fill="none"
      >
        <motion.path
          d="M 10 80 Q 90 40, 160 90 T 290 70"
          strokeWidth="2"
          strokeDasharray="6 6"
          animate={{
            strokeDashoffset: [0, -120],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>
    </div>
  );
}
