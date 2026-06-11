"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValue,
  useTransform,
  useInView,
} from "framer-motion";
import { useGetCampaigns } from "@/hooks/use-queries";
import type { CampaignClient } from "@/lib/campaign-api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  showcaseAccentClasses,
  showcaseTextClasses,
} from "@/lib/campaign-display";

type Placement = "main_top" | "after_collection";

type CampaignShowcaseProps = {
  placement: Placement;
};

/* ------------------------------------------------------------------ */
/*  Shimmer accent line that sweeps across the card top                */
/* ------------------------------------------------------------------ */
function ShimmerLine({ accent }: { accent: CampaignClient["accent"] }) {
  const color =
    accent === "gold"
      ? "from-transparent via-brand-gold/60 to-transparent"
      : accent === "navy"
        ? "from-transparent via-white/30 to-transparent"
        : "from-transparent via-foreground/15 to-transparent";

  return (
    <div className="absolute inset-x-0 top-0 z-20 h-[2px] overflow-hidden">
      <motion.div
        className={cn("h-full w-[200%] bg-gradient-to-r", color)}
        animate={{ x: ["-50%", "0%"] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating decorative particles for visual depth                     */
/* ------------------------------------------------------------------ */
function FloatingParticles({ accent }: { accent: CampaignClient["accent"] }) {
  const particleColor =
    accent === "gold"
      ? "bg-brand-gold/20"
      : accent === "navy"
        ? "bg-white/10"
        : "bg-foreground/5";

  const particles = [
    { size: 6, x: "15%", y: "20%", delay: 0, duration: 6 },
    { size: 4, x: "80%", y: "30%", delay: 1.5, duration: 5 },
    { size: 8, x: "65%", y: "70%", delay: 0.8, duration: 7 },
    { size: 3, x: "35%", y: "80%", delay: 2, duration: 4.5 },
    { size: 5, x: "90%", y: "55%", delay: 0.3, duration: 5.5 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={cn("absolute rounded-full", particleColor)}
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stagger wrapper for child animations                              */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Showcase card with rich animations                                */
/* ------------------------------------------------------------------ */
function ShowcaseCard({ campaign }: { campaign: CampaignClient }) {
  const text = showcaseTextClasses(campaign.accent);
  const isExternal = campaign.ctaUrl?.startsWith("http");
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });

  /* Parallax hover on the image */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const imgX = useTransform(mouseX, [0, 1], [4, -4]);
  const imgY = useTransform(mouseY, [0, 1], [4, -4]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  /* CTA button appearance */
  const ctaClasses = cn(
    "group/btn relative overflow-hidden rounded-none px-8 py-3 font-serif text-xs tracking-[0.25em] uppercase",
    "transition-all duration-500",
    campaign.accent === "gold"
      ? "bg-brand-gold text-white hover:shadow-[0_0_30px_rgba(201,169,110,0.4)]"
      : campaign.accent === "navy"
        ? "bg-white text-brand-navy hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        : "bg-primary text-primary-foreground hover:shadow-[0_0_30px_rgba(0,0,0,0.15)]"
  );

  const CtaInner = ({ children }: { children: React.ReactNode }) => (
    <>
      <span className="relative z-10">{children}</span>
      {/* Hover sweep effect */}
      <span
        className={cn(
          "absolute inset-0 z-0 translate-x-[-100%] transition-transform duration-500 group-hover/btn:translate-x-0",
          campaign.accent === "gold"
            ? "bg-brand-navy"
            : campaign.accent === "navy"
              ? "bg-brand-gold"
              : "bg-foreground/20"
        )}
      />
    </>
  );

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-3xl border shadow-2xl",
        "transition-shadow duration-700 hover:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.25)]",
        showcaseAccentClasses(campaign.accent)
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Animated shimmer line across top */}
      <ShimmerLine accent={campaign.accent} />

      {/* Floating ambient particles */}
      <FloatingParticles accent={campaign.accent} />

      <div className="relative grid md:grid-cols-12">
        {/* ───── Image section ───── */}
        {campaign.imageUrl ? (
          <div className="relative min-h-[220px] overflow-hidden md:col-span-5 md:min-h-[320px]">
            {/* Parallax + hover-zoom image */}
            <motion.div
              className="absolute inset-[-8px]"
              style={{ x: imgX, y: imgY }}
            >
              <Image
                src={campaign.imageUrl}
                alt={campaign.headline}
                fill
                className={cn(
                  "object-cover transition-transform duration-[1.2s] ease-out",
                  "group-hover:scale-[1.06]"
                )}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </motion.div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent md:bg-gradient-to-r md:from-black/55 md:via-black/20 md:to-transparent" />

            {/* Corner decorative accent */}
            <motion.div
              className={cn(
                "absolute bottom-4 left-4 z-10 h-12 w-[2px]",
                campaign.accent === "gold"
                  ? "bg-brand-gold/70"
                  : campaign.accent === "navy"
                    ? "bg-white/40"
                    : "bg-foreground/20"
              )}
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              style={{ originY: 1 }}
            />
            <motion.div
              className={cn(
                "absolute bottom-4 left-4 z-10 h-[2px] w-12",
                campaign.accent === "gold"
                  ? "bg-brand-gold/70"
                  : campaign.accent === "navy"
                    ? "bg-white/40"
                    : "bg-foreground/20"
              )}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              style={{ originX: 0 }}
            />
          </div>
        ) : null}

        {/* ───── Content section ───── */}
        <motion.div
          className={cn(
            "relative z-10 flex flex-col justify-center p-8 md:p-12",
            campaign.imageUrl ? "md:col-span-7" : "md:col-span-12"
          )}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* "Featured" label with letter-spacing reveal */}
          <motion.p
            className="mb-3 text-[10px] font-bold uppercase tracking-[0.35em] text-brand-gold"
            variants={itemVariants}
          >
            <motion.span
              animate={isInView ? { letterSpacing: "0.35em" } : { letterSpacing: "0em" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              Featured
            </motion.span>
          </motion.p>

          {/* Headline */}
          <motion.h2
            className={cn(
              "mb-4 font-serif text-3xl leading-tight md:text-4xl lg:text-[2.75rem]",
              text.headline
            )}
            variants={itemVariants}
          >
            {campaign.headline}
          </motion.h2>

          {/* Decorative separator line */}
          <motion.div
            className={cn(
              "mb-5 h-[1.5px] w-16",
              campaign.accent === "gold"
                ? "bg-brand-gold/50"
                : campaign.accent === "navy"
                  ? "bg-white/25"
                  : "bg-foreground/15"
            )}
            variants={itemVariants}
            initial={{ width: 0, opacity: 0 }}
            animate={isInView ? { width: 64, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          />

          {/* Message */}
          {campaign.message && (
            <motion.p
              className={cn(
                "mb-8 max-w-xl text-sm leading-relaxed md:text-base",
                text.message
              )}
              variants={itemVariants}
            >
              {campaign.message}
            </motion.p>
          )}

          {/* CTA button with sweep hover */}
          {campaign.ctaUrl && campaign.ctaLabel && (
            <motion.div variants={itemVariants}>
              {isExternal ? (
                <Button asChild className={ctaClasses}>
                  <a
                    href={campaign.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CtaInner>{campaign.ctaLabel}</CtaInner>
                  </a>
                </Button>
              ) : (
                <Button asChild className={ctaClasses}>
                  <Link href={campaign.ctaUrl}>
                    <CtaInner>{campaign.ctaLabel}</CtaInner>
                  </Link>
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom-right decorative corner accent (mirrors the image corner) */}
      <motion.div
        className={cn(
          "absolute bottom-0 right-0 z-10",
          "pointer-events-none"
        )}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div
          className={cn(
            "absolute bottom-4 right-4 h-8 w-[1.5px]",
            campaign.accent === "gold"
              ? "bg-brand-gold/30"
              : campaign.accent === "navy"
                ? "bg-white/15"
                : "bg-foreground/8"
          )}
        />
        <div
          className={cn(
            "absolute bottom-4 right-4 h-[1.5px] w-8",
            campaign.accent === "gold"
              ? "bg-brand-gold/30"
              : campaign.accent === "navy"
                ? "bg-white/15"
                : "bg-foreground/8"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Public export                                                     */
/* ------------------------------------------------------------------ */
export function CampaignShowcase({ placement }: CampaignShowcaseProps) {
  const pathname = usePathname();
  const { data: campaigns } = useGetCampaigns();

  const isHome = pathname === "/";
  const shouldRender = placement === "after_collection" && isHome;

  if (!shouldRender) return null;

  const showcase = campaigns?.find((c) => c.type === "showcase");
  if (!showcase) return null;

  return (
    <section
      className={cn(
        "relative z-10",
        "container mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8"
      )}
      aria-label="Promotional campaign"
    >
      <ShowcaseCard campaign={showcase} />
    </section>
  );
}
