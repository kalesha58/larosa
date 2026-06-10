"use client";

import { motion, useReducedMotion } from "framer-motion";
import { VillaIcon } from "@/components/villas/VillaIcon";
import type { HomeVilla, VillaIconKey } from "@/lib/villas-home";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Desktop orthogonal paths: hub center (400,300) to left/right spokes */
const LEFT_PATH = "M 368 300 H 228 V 210 H 88";
const RIGHT_PATH = "M 432 300 H 572 V 210 H 712";

const LEFT_NODE = { x: 228, y: 300 };
const RIGHT_NODE = { x: 572, y: 300 };

/** Mobile vertical path from hub to first card area */
const MOBILE_PATH = "M 400 200 V 280";

type VillaHubConnectorsProps = {
  variant: "desktop" | "mobile";
  villas: HomeVilla[];
  animate?: boolean;
};

function ConnectorPath({
  d,
  delay,
  animate,
}: {
  d: string;
  delay: number;
  animate: boolean;
}) {
  if (!animate) {
    return (
      <path
        d={d}
        fill="none"
        stroke="hsl(var(--primary) / 0.22)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }

  return (
    <motion.path
      d={d}
      fill="none"
      stroke="hsl(var(--primary) / 0.22)"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0.4 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    />
  );
}

function IconNode({
  x,
  y,
  iconKey,
  delay,
  animate,
}: {
  x: number;
  y: number;
  iconKey: VillaIconKey;
  delay: number;
  animate: boolean;
}) {
  const size = 28;
  const half = size / 2;

  const circle = (
    <>
      <circle
        cx={x}
        cy={y}
        r={half}
        fill="hsl(var(--background))"
        stroke="hsl(var(--primary) / 0.3)"
        strokeWidth={1.5}
      />
      <foreignObject
        x={x - half}
        y={y - half}
        width={size}
        height={size}
        className="pointer-events-none overflow-visible"
      >
        <div className="flex h-full w-full items-center justify-center text-primary">
          <VillaIcon iconKey={iconKey} className="h-3.5 w-3.5" strokeWidth={1.75} />
        </div>
      </foreignObject>
    </>
  );

  if (!animate) {
    return <g>{circle}</g>;
  }

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: delay + 0.5, ease: EASE }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {circle}
    </motion.g>
  );
}

export function VillaHubConnectors({
  variant,
  villas,
  animate: animateProp = true,
}: VillaHubConnectorsProps) {
  const reducedMotion = useReducedMotion();
  const animate = animateProp && !reducedMotion;

  if (variant === "mobile") {
    return (
      <svg
        className="pointer-events-none mx-auto h-20 w-full max-w-[120px]"
        viewBox="0 0 800 320"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <ConnectorPath d={MOBILE_PATH} delay={0.2} animate={animate} />
      </svg>
    );
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 800 640"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <ConnectorPath d={LEFT_PATH} delay={0.15} animate={animate} />
      <ConnectorPath d={RIGHT_PATH} delay={0.28} animate={animate} />
      <IconNode
        x={LEFT_NODE.x}
        y={LEFT_NODE.y}
        iconKey={villas[0]?.iconKey ?? "trees"}
        delay={0.15}
        animate={animate}
      />
      <IconNode
        x={RIGHT_NODE.x}
        y={RIGHT_NODE.y}
        iconKey={villas[1]?.iconKey ?? "waves"}
        delay={0.28}
        animate={animate}
      />
    </svg>
  );
}
