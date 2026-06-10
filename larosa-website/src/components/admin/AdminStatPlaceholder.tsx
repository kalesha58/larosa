import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminStatPlaceholderProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  color?: string;
  bg?: string;
};

export function AdminStatPlaceholder({
  title,
  value,
  icon: Icon,
  hint = "No data yet",
  color = "text-muted-foreground",
  bg = "bg-secondary/30",
}: AdminStatPlaceholderProps) {
  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2", bg)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-serif text-foreground mb-1 tracking-tight">
          {value}
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
          {hint}
        </p>
      </CardContent>
    </Card>
  );
}
