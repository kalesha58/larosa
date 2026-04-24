"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useGetFeaturedRooms } from "@/hooks/use-queries";
import { BookingWidget } from "@/components/BookingWidget";
import { SignatureSuitesSection } from "@/components/SignatureSuitesSection";
import { VillasSection } from "@/components/VillasSection";
import { ExperiencesSection } from "@/components/ExperiencesSection";
import { VillaAmenitiesSection } from "@/components/VillaAmenitiesSection";
import { StorySection } from "@/components/StorySection";
import { VideoSection } from "@/components/VideoSection";
import { HomeContactSection } from "@/components/HomeContactSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HERO_SLIDES = [
  {
    src: "/Hero1.jpeg",
    label: "Grand Entry",
  },
  {
    src: "/Hero2.jpeg",
    label: "Luxury Stay",
  },
  {
    src: "/Hero3.jpeg",
    label: "Serene Views",
  },
  {
    src: "/Hero4.jpeg",
    label: "Exclusive Experience",
  },
  {
    src: "/Hero5.jpeg",
    label: "Premium Comfort",
  },
  {
    src: "/WhatsApp Image 2026-04-24 at 12.18.54 PM.jpeg",
    label: "Larosa Sanctuary",
  },
];

export default function Home() {
  const { data: featuredRooms, isLoading } = useGetFeaturedRooms();
  const [heroIndex, setHeroIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={heroIndex}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <Image
              src={HERO_SLIDES[heroIndex].src}
              alt={HERO_SLIDES[heroIndex].label}
              fill
              priority={heroIndex === 0}
              sizes="100vw"
              className="object-cover saturate-[1.1]"
            />
            <div className="absolute inset-0 bg-black/25 dark:bg-black/40" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-40 md:bottom-36 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setHeroIndex(i);
                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = setInterval(
                  () =>
                    setHeroIndex((idx) => (idx + 1) % HERO_SLIDES.length),
                  5000
                );
              }}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === heroIndex ? "w-8 bg-primary" : "w-2 bg-foreground/30"
              }`}
              aria-label={`Hero slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-white/80 uppercase tracking-[0.35em] text-xs mb-4 font-medium">
              Welcome to the extraordinary
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-5 leading-tight">
              A Sanctuary of <br />
              <span className="italic text-white/90">Quiet Opulence</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light">
              Experience an unhurried, elevated stay where every detail is
              meticulously crafted for your absolute comfort.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="hidden w-full px-4 md:block md:-mb-24"
          >
            <BookingWidget />
          </motion.div>
        </div>
      </section>

      <div className="bg-background px-4 pb-5 -mt-8 md:hidden">
        <BookingWidget />
      </div>

      <div className="h-4 md:h-12 bg-background" />

      <SignatureSuitesSection
        isLoading={isLoading}
        rooms={featuredRooms}
      />

      <VillasSection />

      <ExperiencesSection />

      <VillaAmenitiesSection />

      <StorySection />

      <VideoSection />

      <HomeContactSection />

      <section className="py-20 md:py-24 lg:py-28 bg-card border-t border-border text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-primary uppercase tracking-[0.3em] text-xs mb-3">
            Begin your journey
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-5">
            Your Sanctuary Awaits
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 font-light">
            Step away from the noise. Discover the art of sophisticated rest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-14 px-12 rounded-none font-serif tracking-widest text-sm bg-primary hover:bg-primary/90 text-primary-foreground"
              asChild
            >
              <Link href="/rooms">RESERVE YOUR STAY</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-12 rounded-none font-serif tracking-widest text-sm border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              asChild
            >
              <Link href="/contact">CONTACT CONCIERGE</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
