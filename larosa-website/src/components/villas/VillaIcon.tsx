import { Trees, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VillaIconKey } from "@/lib/villas-home";

type VillaIconProps = {
  iconKey: VillaIconKey;
  className?: string;
  strokeWidth?: number;
};

export function VillaIcon({
  iconKey,
  className,
  strokeWidth = 2,
}: VillaIconProps) {
  const props = { className: cn("shrink-0", className), strokeWidth, "aria-hidden": true as const };

  if (iconKey === "trees") {
    return <Trees {...props} />;
  }

  return <Waves {...props} />;
}
