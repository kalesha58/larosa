"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookingWidget } from "@/components/BookingWidget";
import { CinematicHero } from "@/components/cinematic/CinematicHero";
import { LenisProvider } from "@/components/LenisProvider";
import { VillasSection } from "@/components/VillasSection";
import { VillaAmenitiesSection } from "@/components/VillaAmenitiesSection";
import { LarosaCollectionSection } from "@/components/LarosaCollectionSection";
import { VideoSection } from "@/components/VideoSection";
import { HomeContactSection } from "@/components/HomeContactSection";
import { Button } from "@/components/ui/button";

/* Legacy carousel hero — preserved for reference
const HERO_SLIDES = [
  { src: "/Hero1.jpeg", label: "Grand Entry" },
  { src: "/Hero2.jpeg", label: "Luxury Stay" },
  { src: "/Hero3.jpeg", label: "Serene Views" },
  { src: "/Hero4.jpeg", label: "Exclusive Experience" },
  { src: "/Hero5.jpeg", label: "Premium Comfort" },
  {
    src: "/WhatsApp Image 2026-04-24 at 12.18.54 PM.jpeg",
    label: "Larosa Sanctuary",
  },
];
*/

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LenisProvider>
      <div className="flex min-h-screen flex-col">
        <CinematicHero />

        {/*
        <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
          ... carousel hero with HERO_SLIDES, AnimatePresence, slide dots ...
        </section>
        */}

        <div className="relative z-20 bg-background px-4 pb-5 -mt-8 md:hidden">
          <BookingWidget />
        </div>

        <div className="relative z-10 -mt-[18vh] overflow-hidden md:-mt-[22vh]">
          <VillasSection />
        </div>

        <VillaAmenitiesSection />

        <LarosaCollectionSection />

        <VideoSection />

        <HomeContactSection />

        <section className="relative overflow-hidden border-t border-border bg-card px-4 py-16 text-center sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">
              Begin your journey
            </p>
            <h2 className="mb-5 font-serif text-4xl text-foreground md:text-6xl">
              Your Sanctuary Awaits
            </h2>
            <p className="mb-8 text-lg font-light text-muted-foreground md:text-xl">
              Step away from the noise. Discover the art of sophisticated rest.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-14 rounded-none bg-primary px-12 font-serif text-sm tracking-widest text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/rooms">RESERVE YOUR STAY</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-none border-primary/50 px-12 font-serif text-sm tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <Link href="/contact">CONTACT CONCIERGE</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </LenisProvider>
  );
}
