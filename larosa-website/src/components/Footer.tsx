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
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="relative border-t border-border overflow-hidden bg-background">
      {/* Luminous Background Effects */}
      <div 
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" 
        aria-hidden="true" 
      />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[400px] bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_70%)] -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.03),transparent_70%)] -z-10" 
        aria-hidden="true" 
      />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Newsletter & Brand Intro */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20 mb-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-5 w-5 text-primary opacity-80" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">The Sanctuary</span>
            </div>
            <h2 className="font-serif text-4xl font-bold tracking-[0.15em] text-primary mb-6">LA ROSA</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
              Where quiet opulence meets unhurried elegance. Our sanctuary is designed for those who seek the extraordinary in every detail.
            </p>
            <div className="flex gap-4">
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
                  className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-500 group"
                >
                  <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="relative w-full max-w-xl bg-card/40 backdrop-blur-md border border-border/50 p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-primary/5">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <h3 className="font-serif text-2xl mb-3 text-foreground">Join the Inner Circle</h3>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              Experience the unhurried life. Subscribe for exclusive seasonal offers and invitations to private events.
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Email address" 
                  className="h-14 pl-12 bg-background/60 border-border/60 rounded-xl focus-visible:ring-primary/30"
                />
              </div>
              <Button className="h-14 px-8 rounded-xl uppercase tracking-[0.2em] text-[10px] font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8 py-16 border-y border-border/40">
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/80">The Stay</h4>
            <ul className="space-y-4 text-[13px] text-muted-foreground/90 font-medium">
              <li><Link href="/rooms" className="hover:text-primary transition-colors flex items-center gap-2 group">Rooms & Suites <ArrowRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
              <li><Link href="/rooms#villas" className="hover:text-primary transition-colors">Private Villas</Link></li>
              <li><Link href="/offers" className="hover:text-primary transition-colors">Special Offers</Link></li>
              <li><Link href="/amenities" className="hover:text-primary transition-colors">Experiences</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/80">Dining & Wellness</h4>
            <ul className="space-y-4 text-[13px] text-muted-foreground/90 font-medium">
              <li><Link href="/dining" className="hover:text-primary transition-colors">The Rose Grill</Link></li>
              <li><Link href="/spa" className="hover:text-primary transition-colors">Lumina Spa</Link></li>
              <li><Link href="/wellness" className="hover:text-primary transition-colors">Wellness Retreats</Link></li>
              <li><Link href="/dining#bar" className="hover:text-primary transition-colors">The Azure Bar</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/80">Events</h4>
            <ul className="space-y-4 text-[13px] text-muted-foreground/90 font-medium">
              <li><Link href="/events" className="hover:text-primary transition-colors">Weddings</Link></li>
              <li><Link href="/meetings" className="hover:text-primary transition-colors">Meetings</Link></li>
              <li><Link href="/celebrations" className="hover:text-primary transition-colors">Private Dining</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Event Gallery</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/80">The Maison</h4>
            <ul className="space-y-4 text-[13px] text-muted-foreground/90 font-medium">
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/sustainability" className="hover:text-primary transition-colors">Sustainability</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:pl-4 space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/80">The Address</h4>
            <ul className="space-y-5 text-sm text-muted-foreground/90">
              <li className="flex gap-4">
                <MapPin className="h-4 w-4 shrink-0 text-primary opacity-70 mt-0.5" />
                <span className="leading-relaxed">123 Luxury Avenue<br />Beverly Hills, CA 90210</span>
              </li>
              <li className="flex gap-4">
                <Phone className="h-4 w-4 shrink-0 text-primary opacity-70" />
                <span className="font-serif">1 (800) LA-ROSA-1</span>
              </li>
              <li className="flex items-center gap-2 text-xs pt-4 border-t border-border/40">
                <Clock className="h-3.5 w-3.5 text-primary/60" />
                <span>GMT -7:00 | Beverly Hills</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Final Bar */}
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              &copy; {new Date().getFullYear()} La Rosa Sanctuary
            </p>
            <p className="text-[9px] tracking-widest text-muted-foreground/50 uppercase">
              Part of the La Rosa Hospitality Collective
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/accessibility" className="hover:text-primary transition-colors">Accessibility</Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
