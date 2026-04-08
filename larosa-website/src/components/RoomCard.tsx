"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, Layout, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Room } from "@/hooks/use-queries";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  room: Room;
  featured?: boolean;
  index?: number;
  /** Rich card styling for the home Signature Suites section */
  variant?: "default" | "showcase";
}

export function RoomCard({
  room,
  featured,
  index = 0,
  variant = "default",
}: RoomCardProps) {
  const imageSrc = room.images[0] ?? "/room-deluxe.png";
  const isShowcase = variant === "showcase";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.21, 0.45, 0.32, 0.9],
      }}
      className={cn(
        "group flex h-full flex-col overflow-hidden",
        isShowcase
          ? "rounded-2xl border border-border/45 bg-card/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] backdrop-blur-[2px] transition-all duration-500 dark:border-border/30 dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] dark:bg-card/40 sm:rounded-3xl hover:border-primary/35 hover:shadow-[0_28px_60px_-14px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_28px_60px_-14px_rgba(0,0,0,0.55)]"
          : "rounded-2xl border border-border/45 bg-gradient-to-b from-card via-card to-muted/10 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_28px_54px_-20px_rgba(0,0,0,0.26)] dark:from-card/95 dark:to-card/80",
        !isShowcase && featured && "border-primary/35 shadow-lg ring-1 ring-primary/10"
      )}
    >
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden",
          isShowcase
            ? "aspect-[16/10] sm:aspect-[16/9] lg:aspect-[1.6/1]"
            : "h-72"
        )}
      >
        <Image
          src={imageSrc}
          alt={room.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "object-cover transition-transform duration-[1.1s] ease-out",
            isShowcase ? "group-hover:scale-[1.04]" : "group-hover:scale-[1.06]"
          )}
        />
        {/* Image overlays */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/35 to-transparent opacity-95 dark:from-background dark:via-background/40"
          aria-hidden
        />
        {isShowcase && (
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />
        )}

        <div className="absolute left-4 top-4 right-4 flex items-start justify-between gap-2 sm:left-5 sm:top-5 sm:right-5">
          <span
            className={cn(
              "max-w-[65%] truncate rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md sm:px-3 sm:text-[11px]",
              isShowcase
                ? "border-white/25 bg-background/75 text-foreground dark:border-white/15 dark:bg-background/65"
                : "border-border/45 bg-background/88 text-foreground shadow-sm"
            )}
          >
            {room.type}
          </span>
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md sm:text-[11px]",
              isShowcase
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "border border-primary/20 bg-primary/10 text-primary shadow-sm"
            )}
          >
            From ${room.price}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col",
          isShowcase ? "p-5 sm:p-6" : "p-6 sm:p-7"
        )}
      >
        <h3
          className={cn(
            "font-serif text-foreground transition-colors duration-300 group-hover:text-primary",
            isShowcase
              ? "mb-2 text-lg leading-snug sm:text-xl"
              : "mb-2 text-xl leading-tight sm:text-2xl"
          )}
        >
          {room.title}
        </h3>
        <p
          className={cn(
            "text-muted-foreground line-clamp-2 leading-relaxed",
            isShowcase ? "mb-5 text-sm" : "mb-5 text-sm sm:text-[15px]"
          )}
        >
          {room.description}
        </p>

        <div
          className={cn(
            "mb-5 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:mb-6 sm:text-[11px]",
            isShowcase ? "border-t border-border/50 pt-4 sm:pt-5" : "border-t border-border/45 pt-4"
          )}
        >
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/35 px-3 py-1.5">
            <Users
              size={14}
              className="text-primary/70 shrink-0"
              aria-hidden
            />
            <span>{room.capacity} Guests</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/35 px-3 py-1.5">
            <Layout
              size={14}
              className="text-primary/70 shrink-0"
              aria-hidden
            />
            <span>{room.sizeSqFt} sq ft</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            asChild
            variant="outline"
            className={cn(
              "group/btn w-full font-serif tracking-[0.18em] transition-all duration-300",
              isShowcase
                ? "h-11 rounded-lg border-border/60 bg-background/50 text-[10px] hover:border-primary hover:bg-primary hover:text-primary-foreground sm:h-12 sm:rounded-xl sm:text-xs"
                : "h-11 rounded-xl border-border/60 bg-background/70 text-[11px] hover:border-primary hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <Link
              href={`/rooms/${room.id}`}
              className="inline-flex items-center justify-center gap-2"
            >
              Explore suite
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
                aria-hidden
              />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
