"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Sparkles,
  Star,
  Utensils,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EXPERIENCES = [
  {
    title: "The Obsidian Spa",
    body: "Dark stone and still waters create a profound silence. Specialized treatments designed to restore your deepest equilibrium.",
    icon: Star,
  },
  {
    title: "Aureate Dining",
    body: "Michelin-starred culinary artistry served in an intimate, candlelit setting with panoramic views.",
    icon: Utensils,
  },
  {
    title: "Private Concierge",
    body: "Unobtrusive, anticipatory service available 24/7. Whatever you need, arranged effortlessly.",
    icon: Wifi,
  },
  {
    title: "Infinity Pool & Fitness",
    body: "A resort-style infinity pool overlooking the city, alongside a fully-equipped private wellness suite.",
    icon: Dumbbell,
  },
] as const;

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
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] as const 
    },
  },
};

export function ExperiencesSection() {
  return (
    <section
      id="amenities"
      className="relative overflow-hidden py-16 sm:py-24 bg-background"
      aria-labelledby="experiences-heading"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          
          {/* Content Column */}
          <div className="lg:col-span-5 space-y-12 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                The Larosa Lifestyle
              </span>
              <h2
                id="experiences-heading"
                className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground"
              >
                Curated <br />
                <span className="italic text-primary/90">Moments</span>
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Beyond luxury accommodation, we offer a collection of experiences 
                designed to engage the senses and restore the spirit.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={container}
              className="space-y-8"
            >
              {EXPERIENCES.map((exp, i) => {
                const Icon = exp.icon;
                return (
                  <motion.div
                    key={exp.title}
                    variants={item}
                    className="group flex items-start gap-6"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/5 border border-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">
                        {exp.body}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Image Composition Column */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-square">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-[3rem] overflow-hidden border border-border/50 shadow-2xl"
              >
                <Image
                  src="/DinningHall.jpeg"
                  alt="Aureate Dining"
                  fill
                  className="object-cover saturate-[1.1] hover:scale-105 transition-transform duration-[3s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </motion.div>

              {/* Overlapping Small Image */}
              <motion.div
                initial={{ opacity: 0, y: 50, x: 50 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="absolute -bottom-8 -right-8 w-1/2 aspect-square rounded-[2rem] overflow-hidden border-8 border-background shadow-2xl z-20 hidden sm:block"
              >
                <Image
                  src="/Accessories.jpeg"
                  alt="Spa Detail"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
                className="absolute top-12 -left-8 w-32 h-32 rounded-full bg-primary/95 backdrop-blur-md flex items-center justify-center text-center p-4 shadow-2xl z-30 hidden lg:flex"
              >
                <p className="text-primary-foreground text-[10px] font-bold uppercase tracking-widest leading-tight">
                  Voted #1 <br /> Wellness <br /> Sanctuary
                </p>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
