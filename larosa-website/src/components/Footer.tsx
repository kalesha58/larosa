"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  ArrowRight,
  Mail,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SITE_EMAIL,
  SITE_INSTAGRAM_URL,
} from "@/lib/contact-info";
import { BRAND_NAME } from "@/lib/brand";

const FOOTER_LINK_CLASS =
  "transition-colors text-zinc-300 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/50 rounded-sm";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-zinc-800 bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/Brand.jpeg"
          alt=""
          fill
          className="object-cover object-bottom opacity-40 saturate-50"
          aria-hidden
        />
        <div className="absolute inset-0 bg-zinc-950/92" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950/70"
          aria-hidden
        />
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />

      <div className="container relative z-10 mx-auto px-4 pt-20 pb-10 sm:pt-24 sm:pb-12 md:px-6 lg:px-8">
        {/* Brand + newsletter */}
        <div className="mb-16 flex flex-col items-start justify-between gap-12 lg:mb-20 lg:flex-row lg:gap-16">
          <div className="max-w-xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/30 bg-amber-200/10">
                <Sparkles className="h-4 w-4 text-amber-200" aria-hidden />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-amber-200">
                The Sanctuary
              </span>
            </div>
            <h2 className="mb-6 font-serif text-3xl font-semibold tracking-[0.1em] text-white md:text-[2.25rem]">
              {BRAND_NAME}
            </h2>
            <p className="mb-8 max-w-lg text-[15px] leading-relaxed text-zinc-300 md:text-lg font-light">
              Where quiet opulence meets unhurried elegance. Private villas and
              curated stays for those who seek the extraordinary.
            </p>
            <a
              href={SITE_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-200 transition-colors hover:border-amber-200/50 hover:bg-amber-200/10 hover:text-amber-200"
            >
              <Instagram size={18} strokeWidth={1.5} />
            </a>
          </div>

          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-900/70 p-8 md:p-10">
            <h3 className="mb-2 font-serif text-2xl tracking-tight text-white md:text-[1.65rem]">
              Join the Inner Circle
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-zinc-300 md:text-[15px] font-light">
              Subscribe for seasonal offers and private event invitations.
            </p>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1">
                <Mail
                  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  className="h-14 rounded-xl border-zinc-600 bg-zinc-950 pl-12 text-white placeholder:text-zinc-500 focus-visible:border-amber-200/50 focus-visible:ring-amber-200/30"
                />
              </div>
              <Button
                type="submit"
                className="h-14 shrink-0 rounded-xl border border-amber-200/20 bg-amber-200 px-8 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-950 hover:bg-amber-100"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Link columns */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-5 py-12 sm:px-8 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 gap-10 border-b border-zinc-800 pb-14 sm:grid-cols-2 md:grid-cols-3 lg:pb-16">
            <div className="space-y-5">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200">
                The Stay
              </h4>
              <ul className="space-y-3.5 text-[13px] font-light">
                <li>
                  <Link href="/rooms" className={`group inline-flex items-center gap-2 ${FOOTER_LINK_CLASS}`}>
                    Rooms & Suites
                    <ArrowRight
                      size={10}
                      className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </li>
                <li>
                  <Link href="/villas" className={FOOTER_LINK_CLASS}>
                    Private Villas
                  </Link>
                </li>
                <li>
                  <Link href="/rooms" className={FOOTER_LINK_CLASS}>
                    Check Availability
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200">
                Discover
              </h4>
              <ul className="space-y-3.5 text-[13px] font-light">
                <li>
                  <Link href="/about" className={FOOTER_LINK_CLASS}>
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/#amenities" className={FOOTER_LINK_CLASS}>
                    Experiences
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={FOOTER_LINK_CLASS}>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-5 sm:col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200">
                Connect
              </h4>
              <ul className="space-y-4 text-sm font-light">
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" aria-hidden />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5">
                      Email
                    </p>
                    <a href={`mailto:${SITE_EMAIL}`} className={FOOTER_LINK_CLASS}>
                      {SITE_EMAIL}
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal bar */}
          <div className="flex flex-col items-center justify-between gap-6 pt-10 md:flex-row md:gap-8">
            <div className="flex flex-col items-center gap-1.5 text-center md:items-start md:text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                &copy; {new Date().getFullYear()} Larosa Sanctuary
              </p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                Larosa Villas — India
              </p>
            </div>
            <Link
              href="/contact"
              className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${FOOTER_LINK_CLASS} text-zinc-500`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
