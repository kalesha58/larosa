"use client";

import { useSyncRoom } from "@/hooks/use-queries";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type RoomSyncButtonProps = {
  roomId: number;
  size?: "sm" | "default";
  className?: string;
};

export function RoomSyncButton({
  roomId,
  size = "sm",
  className,
}: RoomSyncButtonProps) {
  const sync = useSyncRoom(roomId);
  const { toast } = useToast();

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      className={cn(
        "rounded-lg text-[9px] uppercase tracking-widest font-bold gap-1",
        size === "sm" && "h-8",
        className
      )}
      disabled={sync.isPending}
      onClick={async () => {
        try {
          const r = await sync.mutateAsync();
          toast({
            title: r.success ? "Airbnb sync complete" : "Sync finished",
            description: r.error
              ? r.error
              : `Imported ${r.imported}, removed ${r.removed}`,
          });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Sync failed";
          toast({
            variant: "destructive",
            title: "Sync failed",
            description: msg,
          });
        }
      }}
    >
      <RefreshCw
        className={cn("h-3 w-3", sync.isPending && "animate-spin")}
      />
      Sync Airbnb
    </Button>
  );
}
