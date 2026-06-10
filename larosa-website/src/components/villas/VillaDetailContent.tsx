import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { HomeVilla } from "@/lib/villas-home";

type VillaDetailContentProps = {
  villa: HomeVilla;
  className?: string;
};

export function VillaDetailContent({ villa, className }: VillaDetailContentProps) {
  return (
    <div className={className}>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/50 sm:rounded-3xl">
        <Image
          src={villa.img}
          alt={villa.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 640px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </div>

      <div className="mt-6 space-y-6 sm:mt-8">
        <div className="space-y-3">
          <h3 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            {villa.name}
          </h3>
          <p className="text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
            {villa.desc}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Villa Highlights
          </p>
          <ul className="space-y-3">
            {villa.highlights.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3 text-sm font-light text-foreground"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <Button
          asChild
          className="h-14 w-full rounded-full px-8 font-serif text-xs tracking-[0.2em] sm:w-auto"
        >
          <Link href="/rooms">Discover Villa</Link>
        </Button>
      </div>
    </div>
  );
}
