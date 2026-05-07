"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Room } from "@/hooks/use-queries";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 1, 
      ease: [0.16, 1, 0.3, 1] as const 
    },
  },
};

interface SignatureSuitesSectionProps {
  isLoading: boolean;
  rooms: Room[] | undefined;
}

export function SignatureSuitesSection({
  isLoading,
  rooms,
}: SignatureSuitesSectionProps) {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-24 bg-[hsl(var(--section-warm))]/70"
      aria-labelledby="signature-suites-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              The Collection
            </span>
            <h2
              id="signature-suites-heading"
              className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-[1.1] text-foreground"
            >
              Signature <span className="italic text-primary/90">Suites</span>
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              A curated collection of our most exceptional spaces, where every detail is 
              an expression of refined luxury and absolute tranquility.
            </p>
          </motion.div>
        </div>

        {/* Suites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-card/40 rounded-[3rem] animate-pulse" />
            ))
          ) : (
            rooms?.map((room, idx) => (
              <motion.article
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-border/50 bg-card/40 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <Link href={`/rooms/${room.id}`} className="block h-full">
                  <Image
                    src={room.images[0] ?? "/room-deluxe.png"}
                    alt={room.title}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end text-white">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/90">
                            {room.type}
                          </span>
                          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight">
                            {room.title}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-white/60 mb-1">From</p>
                          <p className="font-serif text-xl sm:text-2xl">₹{room.price.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="h-px w-full bg-white/20 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                      
                      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-white/80">
                          <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            {room.capacity} Guests
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Layout size={14} />
                            {room.sizeSqFt} FT²
                          </div>
                        </div>
                        <ArrowRight size={20} className="text-primary" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          )}
        </div>

        {/* Footer Button */}
        <div className="mt-16 sm:mt-24 text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 rounded-full border-primary/30 bg-transparent px-12 font-serif text-xs tracking-[0.25em] transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground shadow-xl"
          >
            <Link href="/rooms">DISCOVER ALL ACCOMMODATIONS</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


