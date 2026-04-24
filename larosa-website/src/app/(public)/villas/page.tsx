"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { 
  ArrowRight, 
  CheckCircle2, 
  Trees, 
  Waves, 
  Utensils, 
  UserCheck, 
  ShieldCheck,
  Sparkles,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VILLAS = [
  {
    name: "Garden Retreat Villa",
    tagline: "A Sanctuary of Verdant Peace",
    desc: "Secluded one-bedroom villa with private plunge pool surrounded by lush tropical gardens. Perfect for couples seeking intimate tranquility away from the world.",
    size: "120 m²",
    guests: "2 Guests",
    img: "/poolview1.jpeg",
    secondaryImg: "/room2.jpeg",
    highlights: [
      "Private heated plunge pool",
      "Garden-facing master suite",
      "Dedicated villa host",
      "Sunset dining deck",
    ],
  },
  {
    name: "Ocean View Villa",
    tagline: "Horizon-Bound Elegance",
    desc: "Elevated two-bedroom villa with breathtaking panoramic ocean views and a private terrace. Designed for those who live for the sea and infinite horizons.",
    size: "200 m²",
    guests: "4 Guests",
    img: "/poolview2.jpeg",
    secondaryImg: "/room3.jpeg",
    highlights: [
      "Panoramic ocean terrace",
      "Indoor-outdoor lounge",
      "Curated in-villa minibar",
      "Priority concierge service",
    ],
  },
];

const LIFESTYLE_FEATURES = [
  {
    title: "Dedicated Butler",
    desc: "Personalized service that anticipates your every need, from unpacking to dinner arrangements.",
    icon: UserCheck,
  },
  {
    title: "Private Chef",
    desc: "Exquisite culinary creations prepared in the privacy of your villa's gourmet kitchen.",
    icon: Utensils,
  },
  {
    title: "Total Privacy",
    desc: "Gated entrances and clever landscaping ensure your estate remains a completely private world.",
    icon: ShieldCheck,
  },
  {
    title: "Wellness Rituals",
    desc: "In-villa spa treatments and yoga sessions tailored to your personal wellness journey.",
    icon: Sparkles,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } }
};

const HERO_IMAGES = [
  "/Hero1.jpeg",
  "/Hero2.jpeg",
  "/Hero3.jpeg",
  "/Hero4.jpeg",
];

export default function VillasPage() {
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main ref={containerRef} className="min-h-screen bg-background selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-full">
          {HERO_IMAGES.map((src, idx) => (
            <motion.div
              key={src}
              initial={false}
              animate={{ 
                opacity: idx === currentHeroIdx ? 1 : 0, 
                scale: idx === currentHeroIdx ? 1 : 1.05 
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: idx === currentHeroIdx ? "auto" : "none" }}
            >
              <Image
                src={src}
                alt={`Luxury Villa Exterior ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover"
              />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-black/20 z-10" />
        </motion.div>
        
        <div className="container relative z-10 mx-auto px-6 text-center md:text-left mt-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-6 py-2 border border-white/20 bg-black/20 backdrop-blur-md rounded-full text-[10px] font-semibold uppercase tracking-[0.4em] text-white/90 mb-8 shadow-2xl">
              <Sparkles className="h-3 w-3 text-primary" />
              The Private Collection
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[7rem] text-white mb-8 leading-[0.9] drop-shadow-2xl">
              Absolute <br />
              <span className="italic font-light text-white/90">Stillness</span>
            </h1>
            <p className="max-w-2xl mx-auto md:mx-0 text-base md:text-xl text-white/70 font-light leading-relaxed drop-shadow-lg">
              A sanctuary where time slows down. Discover our exclusive private estates designed for the ultimate retreat.
            </p>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/50">Scroll to explore</span>
          <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Intro Statement */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-primary/50 to-transparent" />
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            className="space-y-8"
          >
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-6xl text-foreground leading-tight">
              A World <span className="italic text-muted-foreground">Apart</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
              Each Larosa Villa is a masterpiece of architectural harmony, designed to blend 
              seamlessly with its natural surroundings while providing the height of modern 
              sophistication. Here, luxury is not just seen, but felt.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* The Villas - Asymmetrical Layout */}
      <section className="pb-32 px-4 md:px-8 overflow-hidden bg-background">
        <div className="container mx-auto max-w-[1400px] space-y-40">
          {VILLAS.map((villa, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={villa.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "flex flex-col lg:items-center gap-16 lg:gap-24 relative",
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                )}
              >
                {/* Background Accent */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] bg-primary/[0.02] rounded-full blur-3xl -z-10" />

                {/* Overlapping Images */}
                <div className="lg:w-1/2 relative h-[500px] md:h-[700px] w-full">
                  {/* Main Portrait Image */}
                  <div className={cn(
                    "absolute top-0 w-4/5 h-[85%] rounded-3xl overflow-hidden shadow-2xl border border-border/50 group z-10",
                    isEven ? "left-0" : "right-0"
                  )}>
                    <Image
                      src={villa.img}
                      alt={villa.name}
                      fill
                      className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
                  </div>
                  
                  {/* Secondary Landscape Image Overlapping */}
                  {villa.secondaryImg && (
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className={cn(
                        "absolute bottom-0 w-2/3 h-[45%] rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-background z-20 group hidden md:block",
                        isEven ? "right-0" : "left-0"
                      )}
                    >
                      <Image
                        src={villa.secondaryImg}
                        alt={`${villa.name} Interior`}
                        fill
                        className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <div className="lg:w-1/2 relative z-30">
                  <div className="space-y-8">
                    <div>
                      <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">
                        {villa.tagline}
                      </span>
                      <h3 className="text-4xl md:text-6xl font-serif text-foreground leading-[1.1]">
                        {villa.name}
                      </h3>
                    </div>

                    <div className="flex gap-4 border-b border-border/50 pb-8">
                      <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                         <span className="text-xs uppercase tracking-widest font-medium text-muted-foreground">{villa.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                         <span className="text-xs uppercase tracking-widest font-medium text-muted-foreground">{villa.guests}</span>
                      </div>
                    </div>

                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                      {villa.desc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-4">
                      {villa.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-3 group">
                          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm text-foreground/80 font-medium">{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8">
                      <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif tracking-[0.2em] px-10 h-14 shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px]">
                        <Link href="/contact">ENQUIRE FOR STAY</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Villa Lifestyle - Glassmorphic Aesthetic */}
      <section className="py-32 relative overflow-hidden">
        {/* Fixed background image for parallax effect */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Hero3.jpeg"
            alt="Villa Lifestyle"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-[1400px]">
          <div className="text-center mb-20">
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">The Villa Life</span>
            <h2 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-[1.1]">
              Service as Subtle <br /> <span className="italic text-white/80">as a Whisper</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LIFESTYLE_FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={feature.title} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300 group"
                >
                  <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif text-2xl text-white mb-4">{feature.title}</h4>
                  <p className="text-white/60 leading-relaxed font-light">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 text-center relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container relative z-10 mx-auto px-6 max-w-4xl space-y-12">
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
          >
            <Leaf className="h-10 w-10 text-primary/50 mx-auto mb-8" />
            <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-8 leading-tight">Your Private Sanctuary <span className="italic text-muted-foreground">Awaits</span></h2>
            <p className="text-xl text-muted-foreground font-light mb-12 max-w-2xl mx-auto">
              Step into a world designed exclusively for your peace. 
              Discover the absolute stillness of Larosa Villas.
            </p>
            <Button asChild size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-serif tracking-[0.2em] px-14 h-16 text-sm shadow-2xl transition-all hover:scale-105">
               <Link href="/contact">CONTACT OUR CONCIERGE</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

