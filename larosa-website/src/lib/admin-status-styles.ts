export const statusStyles = {
  success: {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    border: "border-emerald-500/20 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  warning: {
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    border: "border-amber-500/20 dark:border-amber-500/30",
    dot: "bg-amber-500",
  },
  error: {
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    border: "border-rose-500/20 dark:border-rose-500/30",
    dot: "bg-rose-500",
  },
  info: {
    text: "text-sky-700 dark:text-sky-400",
    bg: "bg-sky-500/10 dark:bg-sky-500/15",
    border: "border-sky-500/20 dark:border-sky-500/30",
    dot: "bg-sky-500",
  },
  neutral: {
    text: "text-zinc-500 dark:text-zinc-400",
    bg: "bg-zinc-500/10 dark:bg-zinc-500/15",
    border: "border-zinc-500/20 dark:border-zinc-500/30",
    dot: "bg-zinc-500",
  },
} as const;

export type StatusVariant = keyof typeof statusStyles;

export function statusClass(
  variant: StatusVariant,
  parts: ("text" | "bg" | "border" | "dot")[] = ["text", "bg"]
) {
  return parts.map((part) => statusStyles[variant][part]).join(" ");
}
