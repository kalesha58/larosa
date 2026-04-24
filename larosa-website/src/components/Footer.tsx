"use client";

import Link from "next/link";
import Image from "next/image";
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
    <footer className="relative overflow-hidden border-t border-white/10 bg-zinc-950 text-white">
      {/* Rich Image Background */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/Brand.jpeg"
          alt="Larosa Luxury Footer"
          fill
          className="object-cover object-bottom saturate-50"
        />
        <div className="absolute inset-0 bg-zinc-950/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      {/* Soft spotlight from top */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_55%_at_50%_-10%,hsl(var(--primary)/0.15),transparent_52%)]"
        aria-hidden
      />
      {/* Champagne / warm orb — right */}
      <div
        className="pointer-events-none absolute -top-32 right-[8%] -z-10 h-[min(28rem,70vw)] w-[min(28rem,70vw)] rounded-full bg-[radial-gradient(circle_at_center,hsl(38_42%_50%/0.3)_0%,transparent_68%)] blur-3xl"
        aria-hidden
      />
      {/* Subtle grain / dot veil */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.15] [background-image:radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px]"
        aria-hidden
      />
      {/* Top hairline */}
      <div
        className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden
      />

      <div className="container relative mx-auto px-4 pt-20 pb-10 sm:pt-24 sm:pb-12 md:px-6 lg:px-8">
        {/* Brand + newsletter */}
        <div className="mb-16 flex flex-col items-start justify-between gap-12 lg:mb-20 lg:flex-row lg:gap-20">
          <div className="max-w-xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-transparent shadow-[0_1px_0_rgba(255,255,255,0.1)_inset]">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary">
                The Sanctuary
              </span>
            </div>
            <h2 className="mb-6 font-serif text-4xl font-semibold tracking-[0.12em] text-white md:text-[2.75rem]">
              <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                LAROSA
              </span>
            </h2>
            <p className="mb-8 max-w-lg text-[15px] leading-relaxed text-white/70 md:text-lg font-light">
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
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_8px_20px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/20 hover:text-primary"
                >
                  <social.icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_28px_64px_-32px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-10 md:rounded-[1.75rem]">
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/20 blur-3xl"
              aria-hidden
            />
            <div className="relative">
              <h3 className="mb-2 font-serif text-2xl tracking-tight text-white md:text-[1.65rem]">
                Join the Inner Circle
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-white/70 md:text-[15px] font-light">
                Experience the unhurried life. Subscribe for exclusive seasonal
                offers and invitations to private events.
              </p>
              <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative flex-1">
                  <Mail
                    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
                    aria-hidden
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="h-14 rounded-xl border-white/20 bg-black/40 pl-12 text-white placeholder:text-white/40 shadow-inner backdrop-blur-md focus-visible:border-primary/50 focus-visible:ring-primary/30"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-14 shrink-0 rounded-xl px-8 text-[10px] font-bold uppercase tracking-[0.22em] bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-0.5"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Link columns — inset panel */}
        <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:px-8 md:px-10 lg:px-12">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 border-b border-white/10 pb-14 md:grid-cols-4 lg:grid-cols-5 lg:pb-16">
            <div className="space-y-5">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                The Stay
              </h4>
              <ul className="space-y-3.5 text-[13px] font-light text-white/70">
                <li>
                  <Link
                    href="/rooms"
                    className="group inline-flex items-center gap-2 transition-colors hover:text-white"
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
                    className="transition-colors hover:text-white"
                  >
                    Private Villas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/offers"
                    className="transition-colors hover:text-white"
                  >
                    Special Offers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/amenities"
                    className="transition-colors hover:text-white"
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
              <ul className="space-y-3.5 text-[13px] font-light text-white/70">
                <li>
                  <Link
                    href="/dining"
                    className="transition-colors hover:text-white"
                  >
                    The Rose Grill
                  </Link>
                </li>
                <li>
                  <Link
                    href="/spa"
                    className="transition-colors hover:text-white"
                  >
                    Lumina Spa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wellness"
                    className="transition-colors hover:text-white"
                  >
                    Wellness Retreats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dining#bar"
                    className="transition-colors hover:text-white"
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
              <ul className="space-y-3.5 text-[13px] font-light text-white/70">
                <li>
                  <Link
                    href="/events"
                    className="transition-colors hover:text-white"
                  >
                    Weddings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/meetings"
                    className="transition-colors hover:text-white"
                  >
                    Meetings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/celebrations"
                    className="transition-colors hover:text-white"
                  >
                    Private Dining
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="transition-colors hover:text-white"
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
              <ul className="space-y-3.5 text-[13px] font-light text-white/70">
                <li>
                  <Link
                    href="/about"
                    className="transition-colors hover:text-white"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="transition-colors hover:text-white"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="transition-colors hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 space-y-5 rounded-xl border border-white/10 bg-white/5 p-5 md:col-span-4 lg:col-span-1 lg:ml-1 lg:p-6 backdrop-blur-sm">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                The Address
              </h4>
              <ul className="space-y-4 text-sm text-white/80 font-light">
                <li className="flex gap-3.5">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
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
                    className="h-4 w-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span className="font-serif tracking-wide text-white">
                    1 (800) LA-ROSA-1
                  </span>
                </li>
                <li className="flex items-start gap-2 border-t border-white/10 pt-4 text-xs text-white/60">
                  <Clock
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70"
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                &copy; {new Date().getFullYear()} Larosa Sanctuary
              </p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                Part of the Larosa Hospitality Collective
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
              <Link
                href="/privacy"
                className="transition-colors hover:text-white"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-white"
              >
                Terms
              </Link>
              <Link
                href="/accessibility"
                className="transition-colors hover:text-white"
              >
                Accessibility
              </Link>
              <Link
                href="/sitemap"
                className="transition-colors hover:text-white"
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
