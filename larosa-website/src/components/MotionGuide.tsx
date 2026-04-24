"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function MotionGuide() {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Vertical movement across the whole page
  const y = useTransform(smoothProgress, [0, 1], ["0vh", "90vh"]);
  
  // Subtle horizontal "wandering" to interact with sections
  const x = useTransform(
    smoothProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["0px", "15px", "-10px", "12px", "-5px", "0px"]
  );

  // Rotate based on scroll speed/progress
  const rotate = useTransform(smoothProgress, [0, 1], [0, 360]);

  // Label opacity
  const labelOpacity = useTransform(smoothProgress, [0.05, 0.1], [0, 1]);

  return (
    <div className={cn(
      "pointer-events-none fixed left-8 top-0 z-[60] h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent transition-opacity duration-500",
      isMobile ? "opacity-0" : "opacity-100"
    )}>
      <motion.div
        style={{ y, x }}
        className="absolute left-[-12px] flex flex-col items-center"
      >
        {/* The "Traveler" object */}
        <div className="relative">
          <motion.div
            style={{ rotate }}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-background/80 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] backdrop-blur-sm"
          >
            <Sparkles size={12} className="opacity-80" />
          </motion.div>
          
          {/* Decorative glow/trail */}
          <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/10 blur-md" />
        </div>

        {/* Small label that changes based on progress */}
        <motion.span
          style={{ opacity: labelOpacity }}
          className="mt-3 text-[9px] font-bold uppercase tracking-[0.3em] text-primary/60 [writing-mode:vertical-lr]"
        >
          Discover Larosa
        </motion.span>
      </motion.div>
    </div>
  );
}
