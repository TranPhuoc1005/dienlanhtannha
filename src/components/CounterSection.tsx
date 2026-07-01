"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BadgeCheck, Clock3, Phone, Star } from "lucide-react";

interface CounterProps {
  value: number;
  suffix: string;
}

function Counter({ value, suffix }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1500; // 1.5 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercent = Math.min(progress / duration, 1);
      
      setCount(Math.floor(progressPercent * value));

      if (progressPercent < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isInView]);

  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  {
    icon: BadgeCheck,
    value: 5000,
    suffix: "+",
    label: "Khách hàng tin dùng",
  },
  {
    icon: Clock3,
    value: 10,
    suffix: "+",
    label: "Năm kinh nghiệm",
  },
  {
    icon: Phone,
    value: 24,
    suffix: "/7",
    label: "Hỗ trợ kỹ thuật",
  },
  {
    icon: Star,
    value: 100,
    suffix: "%",
    label: "Tận tâm phục vụ",
  },
];

export default function CounterSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-r from-[#094cb0] to-[#1066e6] relative overflow-hidden z-10 font-sans select-none">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center p-4"
              >
                {/* Icon with Bounce Animation */}
                <motion.div
                  className="mb-4 bg-white/10 p-4 rounded-2xl border border-white/20 text-white"
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                  whileHover={{ scale: 1.15 }}
                >
                  <Icon className="w-8 h-8" aria-hidden="true" />
                </motion.div>

                {/* Count Up Number */}
                <Counter value={stat.value} suffix={stat.suffix} />

                {/* Label */}
                <span className="mt-2 text-sm md:text-base text-white/80 font-medium">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
