"use client";

import { VillaHubCenter } from "@/components/villas/VillaHubCenter";
import { VillaHubConnectors } from "@/components/villas/VillaHubConnectors";
import { VillaSpokeCard } from "@/components/villas/VillaSpokeCard";
import type { HomeVilla } from "@/lib/villas-home";

type VillaHubDiagramProps = {
  villas: HomeVilla[];
  activeIndex: number | null;
  onSelectVilla: (index: number) => void;
  animate?: boolean;
};

export function VillaHubDiagram({
  villas,
  activeIndex,
  onSelectVilla,
  animate = true,
}: VillaHubDiagramProps) {
  const left = villas[0];
  const right = villas[1];

  return (
    <>
      {/* Desktop: bilateral hub-and-spoke */}
      <div className="relative hidden min-h-[580px] lg:block lg:min-h-[640px]">
        <VillaHubConnectors variant="desktop" villas={villas} animate={animate} />
        <div className="relative z-10 grid h-full min-h-[580px] grid-cols-[1fr_auto_1fr] items-center gap-8 px-2 lg:min-h-[640px] lg:gap-10">
          {left && (
            <div className="flex justify-end pr-1 xl:pr-4">
              <VillaSpokeCard
                villa={left}
                index={0}
                isActive={activeIndex === 0}
                onSelect={() => onSelectVilla(0)}
                animate={animate}
              />
            </div>
          )}
          <VillaHubCenter animate={animate} className="mx-4" />
          {right ? (
            <div className="flex justify-start pl-1 xl:pl-4">
              <VillaSpokeCard
                villa={right}
                index={1}
                isActive={activeIndex === 1}
                onSelect={() => onSelectVilla(1)}
                animate={animate}
              />
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex flex-col items-center gap-6 lg:hidden">
        <VillaHubCenter animate={animate} size="compact" />
        <VillaHubConnectors variant="mobile" villas={villas} animate={animate} />
        <div className="flex w-full max-w-lg flex-col gap-6">
          {villas.map((villa, index) => (
            <VillaSpokeCard
              key={villa.roomId}
              villa={villa}
              index={index}
              isActive={activeIndex === index}
              onSelect={() => onSelectVilla(index)}
              animate={animate}
              className="max-w-none"
            />
          ))}
        </div>
      </div>
    </>
  );
}
