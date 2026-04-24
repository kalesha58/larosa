"use client";

import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/50">
      {/* Base wash — warm stone in light, deep zinc in dark */}
      <div
        className="absolute inset-0 -z-20 bg-gradient-to-b from-stone-100 via-[hsl(40_18%_97%)] to-stone-200/80 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900"
        aria-hidden
      />
      {/* Soft spotlight from top */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_55%_at_50%_-10%,hsl(var(--primary)/0.07),transparent_52%)] dark:bg-[radial-gradient(ellipse_100%_50%_at_50%_-5%,hsl(var(--primary)/0.12),transparent_55%)]"
        aria-hidden
      />
      {/* Champagne / warm orb — right */}
      <div
        className="pointer-events-none absolute -top-32 right-[8%] -z-10 h-[min(28rem,70vw)] w-[min(28rem,70vw)] rounded-full bg-[radial-gradient(circle_at_center,hsl(38_42%_90%/0.72)_0%,hsl(35_35%_94%/0.35)_40%,transparent_68%)] blur-2xl dark:bg-[radial-gradient(circle_at_center,hsl(35_30%_18%/0.45)_0%,transparent_65%)]"
        aria-hidden
      />
      {/* Cool depth — bottom left */}
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.06)_0%,transparent_62%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,hsl(220_20%_12%/0.5)_0%,transparent_65%)]"
        aria-hidden
      />
      {/* Subtle grain / dot veil */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.2] [background-image:radial-gradient(hsl(var(--foreground)/0.06)_0.8px,transparent_0.8px)] [background-size:20px_20px]"
        aria-hidden
      />
      {/* Top hairline */}
      <div
        className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
        aria-hidden
      />

      <div className="container relative mx-auto px-4 pt-20 pb-10 sm:pt-24 sm:pb-12 md:px-6 lg:px-8">
        {/* Brand + newsletter */}
        <div className="mb-16 flex flex-col items-start justify-between gap-12 lg:mb-20 lg:flex-row lg:gap-20">
          <div className="max-w-xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-gradient-to-br from-primary/[0.08] to-transparent shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary">
                The Sanctuary
              </span>
            </div>
            <h2 className="mb-6 font-serif text-4xl font-semibold tracking-[0.12em] text-foreground md:text-[2.75rem]">
              <span className="bg-gradient-to-b from-foreground to-foreground/75 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/85">
                LAROSA
              </span>
            </h2>
            <p className="mb-8 max-w-lg text-[15px] leading-relaxed text-muted-foreground md:text-lg">
              Where quiet opulence meets unhurried elegance. Our sanctuary is
              designed for those who seek the extraordinary in every detail.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "X" },
                { icon: Facebook, label: "Facebook" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/50 text-muted-foreground shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_8px_20px_-12px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.07] hover:text-primary dark:bg-card/30 dark:shadow-none dark:hover:bg-primary/10"
                >
                  <social.icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/95 via-card/90 to-muted/25 p-8 shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_28px_64px_-32px_rgba(0,0,0,0.14),0_0_0_1px_rgba(0,0,0,0.02)] backdrop-blur-md dark:from-card/70 dark:via-card/55 dark:to-muted/15 dark:shadow-[0_24px_56px_-28px_rgba(0,0,0,0.55)] md:p-10 md:rounded-[1.75rem]">
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/[0.07] blur-3xl dark:bg-primary/15"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.04)_0%,transparent_45%)]"
              aria-hidden
            />
            <div className="relative">
              <h3 className="mb-2 font-serif text-2xl tracking-tight text-foreground md:text-[1.65rem]">
                Join the Inner Circle
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                Experience the unhurried life. Subscribe for exclusive seasonal
                offers and invitations to private events.
              </p>
              <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative flex-1">
                  <Mail
                    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80"
                    aria-hidden
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="h-14 rounded-xl border-border/60 bg-background/70 pl-12 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm focus-visible:border-primary/35 focus-visible:ring-primary/20 dark:bg-background/40"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-14 shrink-0 rounded-xl px-8 text-[10px] font-bold uppercase tracking-[0.22em] shadow-[0_12px_28px_-12px_rgba(0,0,0,0.35)] transition-shadow hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.4)]"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Link columns — inset panel */}
        <div className="rounded-2xl border border-border/40 bg-card/25 px-5 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-[8px] dark:bg-card/15 dark:shadow-none sm:px-8 md:px-10 lg:px-12">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 border-b border-border/35 pb-14 md:grid-cols-4 lg:grid-cols-5 lg:pb-16">
            <div className="space-y-5">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                The Stay
              </h4>
              <ul className="space-y-3.5 text-[13px] font-medium text-muted-foreground/95">
                <li>
                  <Link
                    href="/rooms"
                    className="group inline-flex items-center gap-2 transition-colors hover:text-foreground"
                  >
                    Rooms & Suites
                    <ArrowRight
                      size={10}
                      className="opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1"
                      aria-hidden
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rooms#villas"
                    className="transition-colors hover:text-foreground"
                  >
                    Private Villas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/offers"
                    className="transition-colors hover:text-foreground"
                  >
                    Special Offers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/amenities"
                    className="transition-colors hover:text-foreground"
                  >
                    Experiences
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                Dining & Wellness
              </h4>
              <ul className="space-y-3.5 text-[13px] font-medium text-muted-foreground/95">
                <li>
                  <Link
                    href="/dining"
                    className="transition-colors hover:text-foreground"
                  >
                    The Rose Grill
                  </Link>
                </li>
                <li>
                  <Link
                    href="/spa"
                    className="transition-colors hover:text-foreground"
                  >
                    Lumina Spa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wellness"
                    className="transition-colors hover:text-foreground"
                  >
                    Wellness Retreats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dining#bar"
                    className="transition-colors hover:text-foreground"
                  >
                    The Azure Bar
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                Events
              </h4>
              <ul className="space-y-3.5 text-[13px] font-medium text-muted-foreground/95">
                <li>
                  <Link
                    href="/events"
                    className="transition-colors hover:text-foreground"
                  >
                    Weddings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/meetings"
                    className="transition-colors hover:text-foreground"
                  >
                    Meetings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/celebrations"
                    className="transition-colors hover:text-foreground"
                  >
                    Private Dining
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="transition-colors hover:text-foreground"
                  >
                    Event Gallery
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                The Maison
              </h4>
              <ul className="space-y-3.5 text-[13px] font-medium text-muted-foreground/95">
                <li>
                  <Link
                    href="/about"
                    className="transition-colors hover:text-foreground"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="transition-colors hover:text-foreground"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="transition-colors hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-foreground"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 space-y-5 rounded-xl border border-border/40 bg-background/40 p-5 md:col-span-4 lg:col-span-1 lg:ml-1 lg:p-6 dark:bg-background/20">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                The Address
              </h4>
              <ul className="space-y-4 text-sm text-muted-foreground/95">
                <li className="flex gap-3.5">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary/75"
                    aria-hidden
                  />
                  <span className="leading-relaxed">
                    123 Luxury Avenue
                    <br />
                    Beverly Hills, CA 90210
                  </span>
                </li>
                <li className="flex gap-3.5">
                  <Phone
                    className="h-4 w-4 shrink-0 text-primary/75"
                    aria-hidden
                  />
                  <span className="font-serif tracking-wide">
                    1 (800) LA-ROSA-1
                  </span>
                </li>
                <li className="flex items-start gap-2 border-t border-border/40 pt-4 text-xs">
                  <Clock
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60"
                    aria-hidden
                  />
                  <span>GMT -7:00 | Beverly Hills</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal bar */}
          <div className="flex flex-col items-center justify-between gap-6 pt-10 md:flex-row md:gap-8">
            <div className="flex flex-col items-center gap-1.5 text-center md:items-start md:text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                &copy; {new Date().getFullYear()} Larosa Sanctuary
              </p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/55">
                Part of the Larosa Hospitality Collective
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/75">
              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="/accessibility"
                className="transition-colors hover:text-foreground"
              >
                Accessibility
              </Link>
              <Link
                href="/sitemap"
                className="transition-colors hover:text-foreground"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
