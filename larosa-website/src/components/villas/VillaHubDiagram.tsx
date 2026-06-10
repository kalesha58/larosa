"use client";

import { VillaHubCenter } from "@/components/villas/VillaHubCenter";
import { VillaHubConnectors } from "@/components/villas/VillaHubConnectors";
import { VillaSpokeCard } from "@/components/villas/VillaSpokeCard";
import { HOME_VILLAS } from "@/lib/villas-home";

type VillaHubDiagramProps = {
  activeIndex: number | null;
  onSelectVilla: (index: number) => void;
  animate?: boolean;
};

export function VillaHubDiagram({
  activeIndex,
  onSelectVilla,
  animate = true,
}: VillaHubDiagramProps) {
  return (
    <>
      {/* Desktop: bilateral hub-and-spoke */}
      <div className="relative hidden min-h-[580px] lg:block lg:min-h-[640px]">
        <VillaHubConnectors variant="desktop" animate={animate} />
        <div className="relative z-10 grid h-full min-h-[580px] grid-cols-[1fr_auto_1fr] items-center gap-8 px-2 lg:min-h-[640px] lg:gap-10">
          <div className="flex justify-end pr-1 xl:pr-4">
            <VillaSpokeCard
              villa={HOME_VILLAS[0]}
              index={0}
              isActive={activeIndex === 0}
              onSelect={() => onSelectVilla(0)}
              animate={animate}
            />
          </div>
          <VillaHubCenter animate={animate} className="mx-4" />
          <div className="flex justify-start pl-1 xl:pl-4">
            <VillaSpokeCard
              villa={HOME_VILLAS[1]}
              index={1}
              isActive={activeIndex === 1}
              onSelect={() => onSelectVilla(1)}
              animate={animate}
            />
          </div>
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex flex-col items-center gap-6 lg:hidden">
        <VillaHubCenter animate={animate} size="compact" />
        <VillaHubConnectors variant="mobile" animate={animate} />
        <div className="flex w-full max-w-lg flex-col gap-6">
          {HOME_VILLAS.map((villa, index) => (
            <VillaSpokeCard
              key={villa.name}
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
