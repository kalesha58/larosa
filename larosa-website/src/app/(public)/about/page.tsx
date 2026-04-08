"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, Heart, Leaf, Star } from "lucide-react";
import Image from "next/image";

const MILESTONES = [
  { year: "1987", title: "Founded", desc: "La Rosa opened its doors in Beverly Hills with 24 bespoke rooms, a singular vision: quiet luxury." },
  { year: "1995", title: "First Expansion", desc: "Added the East Wing — 40 additional suites and the Obsidian Spa, our acclaimed wellness sanctuary." },
  { year: "2003", title: "Michelin Recognition", desc: "Aureate, our flagship restaurant, earned its first Michelin star under Chef Isabelle Moreau." },
  { year: "2012", title: "The Villas", desc: "Launched La Rosa Private Villas — five standalone estate residences for the most discerning guests." },
  { year: "2019", title: "Global Award", desc: "Voted #1 Boutique Luxury Hotel in North America by Condé Nast Traveler readers for the third time." },
  { year: "2024", title: "Today", desc: "124 rooms, 5 private villas, two restaurants, and an unwavering commitment to the art of elevated stillness." },
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

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background pt-20">

      {/* Hero */}
      <section className="relative h-[65vh] min-h-[420px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
            alt="La Rosa Hotel"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-background/60 dark:bg-background/70" />
        </div>
        <div className="relative z-10 text-center pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="text-primary uppercase tracking-[0.35em] text-xs mb-4">Our Heritage</p>
            <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-4 leading-tight">
              The La Rosa <br /><span className="italic text-primary/90">Story</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary uppercase tracking-[0.3em] text-xs mb-6">Est. 1987</p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-10 leading-tight">
              Born from a vision of <br /><span className="italic text-primary/80">timeless grace</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              La Rosa was conceived by Élise Fontaine, a Parisian-born hotelier who believed that true luxury was not about abundance — it was about absence. Absence of noise. Absence of urgency. Absence of anything that did not serve the guest's deepest comfort.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              What began as a 24-room property on the edges of Beverly Hills grew, through four decades of patient refinement, into one of America's most celebrated luxury sanctuaries. Not through volume, but through virtue.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Today, La Rosa is managed by the second generation of the Fontaine family, still committed to the same principle that guided Élise: to make every guest feel that the world has slowed down, just for them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-border overflow-hidden">
            {[
              { num: "37+", label: "Years of Excellence" },
              { num: "124", label: "Rooms & Suites" },
              { num: "5", label: "Private Villas" },
              { num: "98%", label: "Guest Satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`text-center py-12 px-6 ${i < 3 ? "border-r border-border" : ""}`}
              >
                <div className="font-serif text-4xl md:text-5xl text-primary mb-3">{stat.num}</div>
                <div className="text-xs text-muted-foreground tracking-[0.2em] uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-[0.3em] text-xs mb-4">What We Stand For</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`p-10 flex gap-6 ${i % 2 === 0 ? "border-r border-border" : ""} ${i < 2 ? "border-b border-border" : ""}`}
              >
                <div className="w-12 h-12 border border-primary/40 flex items-center justify-center flex-shrink-0">
                  <v.icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-foreground mb-3">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-28 bg-card border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-[0.3em] text-xs mb-4">Through the Decades</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">Our Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-12">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-10 items-start"
                >
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="font-serif text-primary text-lg">{m.year}</span>
                  </div>
                  <div className="relative flex-1 pb-0">
                    <div className="absolute -left-[29px] top-2 w-3 h-3 border-2 border-primary bg-card" />
                    <h3 className="font-serif text-lg text-foreground mb-2">{m.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background border-t border-border text-center px-4">
        <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6">
          Be Part of the Story
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Every guest who chooses La Rosa adds a chapter to our legacy. We would be honoured to welcome you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="h-14 px-12 rounded-none font-serif tracking-widest text-sm bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href="/rooms">RESERVE YOUR STAY</Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-12 rounded-none font-serif tracking-widest text-sm border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground" asChild>
            <Link href="/contact">CONTACT US</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
