"use client";

import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function VideoSection() {
  return (
    <section className="py-14 sm:py-20 relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
            className="order-2 lg:order-1 space-y-8"
          >
            <div>
              <motion.span variants={item} className="inline-block px-4 py-1.5 border border-primary/20 bg-primary/5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">
                A Visual Journey
              </motion.span>
              <motion.h2 variants={item} className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-[1.1] text-foreground mb-8">
                Immerse in <br />
                <span className="italic text-primary/90">Tranquility</span>
              </motion.h2>
              <motion.p variants={item} className="text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
                Experience the breathtaking architecture and the serene atmosphere of Larosa before you even arrive. 
                Our sanctuary is designed to harmonize with nature.
              </motion.p>
            </div>
            
            <motion.div variants={item} className="pt-4 flex items-center gap-4">
               <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                 <PlayCircle size={20} />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Press play to experience</span>
            </motion.div>
          </motion.div>

          {/* Right Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-square md:aspect-video lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-border/50 group">
              <video 
                src="/larosa.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
