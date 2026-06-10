import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onRetry,
  retryLabel = "Try again",
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 py-12 ${className ?? ""}`}
    >
      <div className="h-14 w-14 rounded-2xl bg-secondary/40 border border-border flex items-center justify-center mb-4">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 mb-2">
        Empty
      </p>
      <h3 className="font-serif text-xl text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionHref && actionLabel ? (
          <Button asChild variant="default" className="rounded-xl text-[10px] uppercase tracking-widest font-bold">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null}
        {onRetry ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-xl text-[10px] uppercase tracking-widest font-bold"
            onClick={onRetry}
          >
            {retryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
