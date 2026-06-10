"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

function ShowcaseCard({ campaign }: { campaign: CampaignClient }) {
  const text = showcaseTextClasses(campaign.accent);
  const isExternal = campaign.ctaUrl?.startsWith("http");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border shadow-2xl",
        showcaseAccentClasses(campaign.accent)
      )}
    >
      <div className="grid md:grid-cols-12">
        {campaign.imageUrl ? (
          <div className="relative min-h-[200px] md:col-span-5 md:min-h-[280px]">
            <Image
              src={campaign.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent md:from-black/50" />
          </div>
        ) : null}
        <div
          className={cn(
            "flex flex-col justify-center p-8 md:p-10",
            campaign.imageUrl ? "md:col-span-7" : "md:col-span-12"
          )}
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-brand-gold">
            Featured
          </p>
          <h2 className={cn("mb-3 font-serif text-3xl leading-tight md:text-4xl", text.headline)}>
            {campaign.headline}
          </h2>
          {campaign.message && (
            <p className={cn("mb-6 max-w-xl text-sm leading-relaxed md:text-base", text.message)}>
              {campaign.message}
            </p>
          )}
          {campaign.ctaUrl && campaign.ctaLabel && (
            <div>
              {isExternal ? (
                <Button asChild className="rounded-none bg-primary px-8 font-serif text-xs tracking-widest uppercase">
                  <a href={campaign.ctaUrl} target="_blank" rel="noopener noreferrer">
                    {campaign.ctaLabel}
                  </a>
                </Button>
              ) : (
                <Button asChild className="rounded-none bg-primary px-8 font-serif text-xs tracking-widest uppercase">
                  <Link href={campaign.ctaUrl}>{campaign.ctaLabel}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CampaignShowcase({ placement }: CampaignShowcaseProps) {
  const pathname = usePathname();
  const { data: campaigns } = useGetCampaigns();

  const isHome = pathname === "/";
  const shouldRender =
    (placement === "after_collection" && isHome) ||
    (placement === "main_top" && !isHome);

  if (!shouldRender) return null;

  const showcase = campaigns?.find((c) => c.type === "showcase");
  if (!showcase) return null;

  return (
    <section
      className={cn(
        "relative z-10",
        placement === "after_collection"
          ? "container mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8"
          : "container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8"
      )}
      aria-label="Promotional campaign"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <ShowcaseCard campaign={showcase} />
      </motion.div>
    </section>
  );
}
