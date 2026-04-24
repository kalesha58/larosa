"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, Clock, Heart, Leaf, Mail, Phone, Star, Sparkles, Quote } from "lucide-react";
import Image from "next/image";

const MILESTONES = [
  { year: "1987", title: "The Vision", desc: "Larosa opened its doors in Beverly Hills with 24 bespoke rooms and a singular vision: quiet luxury." },
  { year: "1995", title: "Sanctuary Growth", desc: "The addition of the East Wing introduced 40 suites and the Obsidian Spa, our acclaimed wellness sanctuary." },
  { year: "2003", title: "Culinary Star", desc: "Aureate, our flagship restaurant, earned its first Michelin star under Chef Isabelle Moreau." },
  { year: "2012", title: "Estate Living", desc: "Launched Larosa Private Villas — five standalone estate residences for absolute seclusion." },
  { year: "2019", title: "Global Acclaim", desc: "Voted #1 Boutique Luxury Hotel in North America by Condé Nast Traveler for the third consecutive time." },
  { year: "Today", title: "Our Legacy", desc: "124 rooms, 5 private villas, and an unwavering commitment to the art of elevated stillness." },
];

const VALUES = [
  {
    icon: Star,
    title: "Uncompromising Excellence",
    desc: "Every detail — from the thread count of our linens to the curvature of our light fittings — is chosen with intention.",
  },
  {
    icon: Heart,
    title: "Genuine Hospitality",
    desc: "We train not for perfection, but for warmth. Every guest deserves to feel they are the only guest.",
  },
  {
    icon: Leaf,
    title: "Conscious Luxury",
    desc: "Our sustainability programme ensures that our carbon footprint is offset through regenerative local initiatives.",
  },
  {
    icon: Award,
    title: "Heritage & Craft",
    desc: "We partner with local artisans, heritage brands, and culinary masters who share our belief in doing things properly.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image
            src="/Hero4.jpeg"
            alt="Larosa Grand Lobby"
            fill
            className="object-cover saturate-[1.1]"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
        
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-white backdrop-blur-md mb-8 shadow-lg">
              <Sparkles className="h-4 w-4" />
              Our Heritage
            </span>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white mb-8 leading-[0.9] drop-shadow-2xl">
              The Larosa <br />
              <span className="italic text-white font-light">Legacy</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Brand Story / Legacy */}
      <section className="py-32 bg-background relative">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-border/50">
                <Image
                  src="/Brand.jpeg"
                  alt="Élise Fontaine - Founder"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20">
                  <Quote className="text-white/40 h-10 w-10 mb-4" />
                  <p className="text-white text-lg italic font-serif leading-relaxed">
                    &ldquo;True luxury is not about abundance — it is about the absence of anything that does not serve a guest&apos;s peace.&rdquo;
                  </p>
                  <div className="mt-4 text-white/70 text-xs font-bold uppercase tracking-widest">
                    — Élise Fontaine, Founder
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 h-64 w-64 bg-primary/5 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -right-10 h-80 w-80 bg-primary/10 rounded-full blur-3xl -z-10" />
            </motion.div>

            {/* Text Side */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-8"
            >
              <span className="text-primary text-[11px] font-bold uppercase tracking-[0.3em] block">Est. 1987</span>
              <h2 className="font-serif text-5xl md:text-6xl text-foreground leading-[1.1]">
                Born from a Vision of <br />
                <span className="italic font-light">Timeless Grace</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
                <p>
                  Larosa was conceived by Élise Fontaine, a Parisian-born hotelier who believed that 
                  the ultimate sanctuary was built on stillness. What began as a 24-room property 
                  on the edges of Beverly Hills grew, through four decades of patient refinement, 
                  into one of the world&apos;s most celebrated luxury sanctuaries.
                </p>
                <p>
                  Not through volume, but through virtue. Today, managed by the second generation of 
                  the Fontaine family, we remain committed to the same principle that guided Élise: 
                  to make every guest feel that the world has slowed down, just for them.
                </p>
              </div>
              <div className="pt-8">
                 <div className="grid grid-cols-2 gap-10">
                    <div>
                      <div className="text-3xl font-serif text-primary mb-1">37+</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Years of Heritage</div>
                    </div>
                    <div>
                      <div className="text-3xl font-serif text-primary mb-1">124</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Bespoke Rooms</div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-32 bg-muted/20 border-y border-border/50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
             <span className="text-primary text-[11px] font-bold uppercase tracking-[0.3em]">Our Philosophy</span>
             <h2 className="font-serif text-5xl text-foreground">The Pillars of Larosa</h2>
             <p className="text-muted-foreground font-light text-lg">
               Our commitment to excellence is anchored in four core values that define every 
               interaction and every detail within our walls.
             </p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={item}
                  className="group p-10 rounded-[2.5rem] bg-background border border-border/60 shadow-sm transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2"
                >
                  <div className="h-16 w-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-4">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {value.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-4 sticky top-32 space-y-6">
              <span className="text-primary text-[11px] font-bold uppercase tracking-[0.3em]">Our Journey</span>
              <h2 className="font-serif text-5xl text-foreground leading-tight">Through the <br /> <span className="italic font-light text-primary/80">Decades</span></h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                From a singular vision in 1987 to a world-renowned landmark, follow the 
                milestones that have shaped the Larosa legacy.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-20 pl-0 lg:pl-20 border-l border-border/60">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="relative group"
                >
                  {/* Large background year */}
                  <span className="absolute -left-16 lg:-left-36 top-0 text-7xl md:text-8xl font-serif text-primary/[0.04] select-none pointer-events-none group-hover:text-primary/[0.08] transition-colors duration-700">
                    {m.year}
                  </span>
                  
                  <div className="relative pt-4 lg:pt-8">
                    <div className="flex items-center gap-4 mb-3">
                       <div className="h-2 w-2 rounded-full bg-primary" />
                       <span className="text-primary font-serif text-xl">{m.year}</span>
                    </div>
                    <h3 className="font-serif text-3xl text-foreground mb-4">{m.title}</h3>
                    <p className="text-muted-foreground font-light text-lg leading-relaxed max-w-2xl">
                      {m.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-y border-border/50 bg-muted/15 py-20">
        <div className="container mx-auto max-w-[1000px] px-6">
          <div className="mb-10 text-center">
            <span className="text-primary text-[11px] font-bold uppercase tracking-[0.3em]">
              Reach us
            </span>
            <h2 className="mt-3 font-serif text-3xl text-foreground md:text-4xl">
              We&apos;re here to help
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 rounded-[2rem] border border-border/50 bg-background/80 p-8 shadow-sm backdrop-blur-sm md:grid-cols-3 md:gap-6 md:p-10">
            <div className="flex gap-4 md:flex-col md:items-center md:text-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/5">
                <Mail className="h-[18px] w-[18px] text-primary" aria-hidden />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </p>
                <a
                  href="mailto:info@larosa.co.in"
                  className="mt-1 block text-sm text-foreground underline-offset-4 hover:underline md:text-[15px]"
                >
                  info@larosa.co.in
                </a>
              </div>
            </div>
            <div className="flex gap-4 md:flex-col md:items-center md:text-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/5">
                <Phone className="h-[18px] w-[18px] text-primary" aria-hidden />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Phone
                </p>
                <a
                  href="tel:+917093939312"
                  className="mt-1 block text-sm text-foreground underline-offset-4 hover:underline md:text-[15px]"
                >
                  +91 7093939312
                </a>
              </div>
            </div>
            <div className="flex gap-4 md:flex-col md:items-center md:text-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/5">
                <Clock className="h-[18px] w-[18px] text-primary" aria-hidden />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Available
                </p>
                <p className="mt-1 text-sm font-medium text-foreground md:text-[15px]">
                  24/7 for Inquiries
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Immersive CTA */}
      <section className="py-40 relative overflow-hidden border-t border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="container relative z-10 mx-auto px-6 text-center space-y-12">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-8">
              Become Part of <br /> the <span className="italic font-light">Story</span>
            </h2>
            <p className="text-xl text-muted-foreground font-light mb-12 max-w-2xl mx-auto">
              Every guest who chooses Larosa adds a unique chapter to our legacy. 
              We invite you to experience the stillness.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild size="lg" className="rounded-none font-serif tracking-[0.2em] px-14 h-16 text-base bg-primary shadow-xl shadow-primary/20">
                <Link href="/rooms">RESERVE YOUR STAY</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-none font-serif tracking-[0.2em] px-14 h-16 text-base border-primary/40 hover:bg-primary/5">
                <Link href="/contact">ENQUIRE DETAILS</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
