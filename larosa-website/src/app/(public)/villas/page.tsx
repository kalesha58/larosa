"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Trees, 
  Waves, 
  Utensils, 
  UserCheck, 
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VILLAS = [
  {
    name: "Garden Retreat Villa",
    tagline: "A Sanctuary of Verdant Peace",
    desc: "Secluded one-bedroom villa with private plunge pool surrounded by lush tropical gardens. Perfect for couples seeking intimate tranquility.",
    size: "120 m²",
    guests: "2 Guests",
    img: "/aqua-1.png",
    highlights: [
      "Private plunge pool",
      "Garden-facing master suite",
      "Dedicated villa host",
      "Sunset dining deck",
    ],
  },
  {
    name: "Ocean View Villa",
    tagline: "Horizon-Bound Elegance",
    desc: "Elevated two-bedroom villa with breathtaking panoramic ocean views and a private terrace. Designed for those who live for the sea.",
    size: "200 m²",
    guests: "4 Guests",
    img: "/aqua-2.png",
    highlights: [
      "Panoramic ocean terrace",
      "Indoor-outdoor lounge",
      "Curated in-villa minibar",
      "Priority concierge service",
    ],
  },
  {
    name: "Royal Estate Villa",
    tagline: "The Pinnacle of Seclusion",
    desc: "The absolute peak of Larosa luxury — a full three-bedroom estate with a private infinity pool, personal chef, and 24/7 butler service.",
    size: "450 m²",
    guests: "6 Guests",
    img: "/villa-exterior.png",
    highlights: [
      "Three-suite private estate",
      "Butler and private chef",
      "Infinity-edge pool",
      "24/7 discreet security",
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
    desc: "Gated entrances and clever landscaping ensure your estate remains a private world.",
    icon: ShieldCheck,
  },
  {
    title: "Wellness Rituals",
    desc: "In-villa spa treatments and yoga sessions tailored to your personal wellness journey.",
    icon: Sparkles,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function VillasPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/villas-hero.png"
          alt="Luxury Villa Exterior"
          fill
          priority
          className="object-cover saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-black/15" />
        
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-white backdrop-blur-md mb-8">
              <Trees className="h-4 w-4" />
              Private Grandeur
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight drop-shadow-2xl">
              Absolute <br />
              <span className="italic text-white">Stillness</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 font-light leading-relaxed">
              Experience the ultimate expression of Larosa. Our private estates offer 
              an entirely separate world of tranquil grandeur and personalized service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">A World Apart</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Each Larosa Villa is a masterpiece of architectural harmony, designed to blend 
              seamlessly with its natural surroundings while providing the height of modern 
              sophistication. Here, luxury is not just seen, but felt in the absolute privacy 
              and the unhurried pace of villa life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Villas Listing */}
      <section className="pb-32 px-6">
        <div className="container mx-auto max-w-[1400px]">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-32"
          >
            {VILLAS.map((villa, index) => (
              <motion.div
                key={villa.name}
                variants={item}
                className={cn(
                  "flex flex-col gap-12 lg:items-center",
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                )}
              >
                {/* Villa Image */}
                <div className="lg:w-3/5">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border/50 shadow-2xl group">
                    <Image
                      src={villa.img}
                      alt={villa.name}
                      fill
                      className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute bottom-8 left-8">
                       <span className="text-white text-sm tracking-[0.2em] uppercase mb-2 block drop-shadow-md">{villa.tagline}</span>
                       <h3 className="text-white text-4xl font-serif drop-shadow-lg">{villa.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Villa Info */}
                <div className="lg:w-2/5 space-y-8">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                        {villa.size}
                      </span>
                      <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                        {villa.guests}
                      </span>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {villa.desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {villa.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-3 text-sm text-foreground/80">
                        <CheckCircle2 className="h-5 w-5 text-primary/70 shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>

                  <div className="pt-6">
                    <Button asChild size="lg" className="rounded-none font-serif tracking-[0.2em] px-10 h-14">
                      <Link href="/contact">ENQUIRE FOR STAY</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Villa Lifestyle */}
      <section className="py-32 bg-muted/30 relative overflow-hidden border-y border-border/50">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-primary text-[11px] font-bold uppercase tracking-[0.3em] mb-6 block">The Villa Life</span>
              <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-10 leading-[1.1]">
                Service as Subtle <br /> as a Whisper
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                {LIFESTYLE_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="space-y-3">
                      <div className="h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center text-primary shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h4 className="font-serif text-lg">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-border/50"
            >
              <Image
                src="/villa-lifestyle.png"
                alt="Villa Lifestyle Butler Service"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/5" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container relative z-10 mx-auto px-6 max-w-4xl space-y-10">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-8">Your Private Sanctuary Awaits</h2>
            <p className="text-xl text-muted-foreground font-light mb-12">
              Step into a world designed exclusively for your peace. 
              Discover the absolute stillness of Larosa Villas.
            </p>
            <Button asChild size="lg" className="rounded-none font-serif tracking-[0.2em] px-14 h-16 text-base shadow-xl shadow-primary/20">
               <Link href="/contact">CONTACT OUR CONCIERGE</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
