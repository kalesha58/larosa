"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Clock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATS = [
  { num: "37+", label: "Years of Excellence" },
  { num: "124", label: "Rooms & Suites" },
  { num: "98%", label: "Guest Satisfaction" },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
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

export function StorySection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-16 sm:py-24 bg-[hsl(var(--section-warm))]"
      aria-labelledby="story-heading"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Image Column */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-[3rem] overflow-hidden border border-border/50 shadow-2xl"
              >
                <Image
                  src="/Brand.jpeg"
                  alt="Larosa Story"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </motion.div>

              {/* Floating Stat - Modern Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -bottom-8 -left-8 bg-card/90 backdrop-blur-xl border border-border/50 p-8 rounded-[2rem] shadow-2xl z-20 hidden sm:block"
              >
                <p className="font-serif text-4xl text-primary mb-1">Est. 1987</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Beverly Hills landmark</p>
              </motion.div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-6 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                The Heritage
              </span>
              <h2
                id="story-heading"
                className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-[1.1] text-foreground"
              >
                Born from a <br />
                <span className="italic text-primary/90">Vision</span>
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground font-light leading-relaxed">
                <p>
                  Larosa began as a singular vision: to craft a sanctuary that would 
                  honour the traveller who seeks not spectacle, but substance.
                </p>
                <p>
                  Nestled between heritage architecture and modern sensibility, 
                  we have become a landmark of quiet distinction.
                </p>
              </div>
            </motion.div>

            {/* Integrated Stats */}
            <div className="grid grid-cols-3 gap-8 border-y border-border/50 py-10">
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="space-y-1"
                >
                  <p className="font-serif text-3xl sm:text-4xl text-foreground">{stat.num}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-tight">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                asChild
                variant="outline"
                className="h-14 rounded-full px-10 font-serif text-xs tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Link href="/about">READ OUR FULL STORY</Link>
              </Button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

