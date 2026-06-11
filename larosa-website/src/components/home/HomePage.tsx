"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BookingWidget } from "@/components/BookingWidget";
import { CinematicHero } from "@/components/cinematic/CinematicHero";
import { LenisProvider } from "@/components/LenisProvider";
import { VillasSection } from "@/components/VillasSection";
import { VillaAmenitiesSection } from "@/components/VillaAmenitiesSection";
import { LarosaCollectionSection } from "@/components/LarosaCollectionSection";
import { CampaignShowcase } from "@/components/campaigns/CampaignShowcase";
import { VideoSection } from "@/components/VideoSection";
import { HomeContactSection } from "@/components/HomeContactSection";
import { Button } from "@/components/ui/button";

export function HomePage() {
  const [heroInteractive, setHeroInteractive] = useState(false);
  const handleHeroInteractiveChange = useCallback((interactive: boolean) => {
    setHeroInteractive(interactive);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LenisProvider scrollEnabled={heroInteractive}>
      <div className="flex min-h-screen flex-col">
        <CinematicHero onInteractiveChange={handleHeroInteractiveChange} />

        <div
          className={cn(
            "relative z-20 bg-background px-4 pb-5 transition-opacity duration-500 md:hidden",
            heroInteractive
              ? "-mt-8 opacity-100"
              : "pointer-events-none mt-0 opacity-0"
          )}
        >
          <BookingWidget />
        </div>

        <div
          className={cn(
            "relative z-10 overflow-hidden transition-opacity duration-500",
            heroInteractive
              ? "-mt-[18vh] opacity-100 md:-mt-[22vh]"
              : "pointer-events-none mt-0 opacity-0"
          )}
        >
          <VillasSection />
        </div>

        <VillaAmenitiesSection />

        <LarosaCollectionSection />

        <CampaignShowcase placement="after_collection" />

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
