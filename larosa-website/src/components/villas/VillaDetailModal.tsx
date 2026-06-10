"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { VillaDetailContent } from "@/components/villas/VillaDetailContent";
import type { HomeVilla } from "@/lib/villas-home";

type VillaDetailModalProps = {
  villas: HomeVilla[];
  openIndex: number | null;
  onOpenChange: (open: boolean) => void;
};

export function VillaDetailModal({
  villas,
  openIndex,
  onOpenChange,
}: VillaDetailModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const open = openIndex !== null;
  const villa = openIndex !== null ? villas[openIndex] : null;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!villa) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] overflow-y-auto px-4 pb-10 pt-2">
          <DrawerHeader className="text-left">
            <DrawerTitle className="sr-only">{villa.name}</DrawerTitle>
            <DrawerDescription className="sr-only">
              Villa details and highlights
            </DrawerDescription>
          </DrawerHeader>
          <VillaDetailContent villa={villa} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border/60 p-6 sm:p-8">
        <DialogHeader className="sr-only">
          <DialogTitle>{villa.name}</DialogTitle>
          <DialogDescription>Villa details and highlights</DialogDescription>
        </DialogHeader>
        <VillaDetailContent villa={villa} />
      </DialogContent>
    </Dialog>
  );
}
