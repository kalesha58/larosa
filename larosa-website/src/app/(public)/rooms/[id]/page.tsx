"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, Layout, Wifi, Wind, Coffee, Utensils, Star,
  ArrowLeft, ArrowRight, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoom } from "@/hooks/use-queries";

const AMENITY_ICONS: Record<string, React.ElementType> = {
  Wifi,
  "Air Conditioning": Wind,
  Minibar: Coffee,
  "Room Service": Utensils,
};

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: room, isLoading } = useGetRoom(id);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-[55vh] w-full rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-sm uppercase tracking-widest">Room not found</p>
        <Button onClick={() => router.push("/rooms")} variant="outline" className="rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" /> Browse Rooms
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={room.images[0] ?? "/Hero3.jpeg"}
          alt={room.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 text-[10px] uppercase tracking-[0.3em] bg-primary/80 text-primary-foreground border-none rounded-full px-4">
              {room.type}
            </Badge>
            <h1 className="font-serif text-4xl md:text-6xl text-white mb-3">{room.title}</h1>
            <p className="text-white/70 text-sm">From <span className="text-white font-bold text-lg">₹{room.price.toLocaleString("en-IN")}</span> per night</p>
          </motion.div>
        </div>
        {/* Back button */}
        <Link href="/rooms" className="absolute top-6 left-6 z-10">
          <Button variant="ghost" className="text-white hover:bg-white/20 rounded-xl gap-2 backdrop-blur-sm border border-white/20">
            <ArrowLeft className="h-4 w-4" /> Rooms
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-3">About This Suite</p>
              <p className="text-foreground text-lg leading-relaxed font-serif">{room.description}</p>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-2xl p-5 text-center">
                  <Users className="h-5 w-5 text-primary mx-auto mb-2" />
                  <div className="font-serif text-2xl">{room.capacity}</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Guests</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 text-center">
                  <Layout className="h-5 w-5 text-primary mx-auto mb-2" />
                  <div className="font-serif text-2xl">{room.sizeSqFt}</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Sq Ft</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 text-center">
                  <Star className="h-5 w-5 text-primary mx-auto mb-2" />
                  <div className="font-serif text-2xl">5★</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-5">Amenities</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {room.amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity] ?? Shield;
                  return (
                    <div key={amenity} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                      <Icon className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Image gallery if multiple images */}
            {room.images.length > 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-5">Gallery</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {room.images.slice(1).map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                      <Image src={img} alt={`${room.title} ${i + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="300px" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Booking CTA */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 bg-card border border-border rounded-2xl p-7 shadow-sm"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">Starting from</p>
              <div className="font-serif text-4xl text-foreground mb-1">₹{room.price.toLocaleString("en-IN")}</div>
              <p className="text-xs text-muted-foreground mb-6">per night · incl. GST</p>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-xs py-2 border-b border-border/50">
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Capacity</span>
                  <span className="font-medium">{room.capacity} guests max</span>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-border/50">
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Size</span>
                  <span className="font-medium">{room.sizeSqFt} sq ft</span>
                </div>
                <div className="flex justify-between text-xs py-2">
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Availability</span>
                  <span className="font-medium text-emerald-600">Open</span>
                </div>
              </div>

              <Link href={`/booking/${room.id}`}>
                <Button id={`book-room-${room.id}`} className="w-full h-12 rounded-xl font-serif tracking-widest mb-3 gap-2">
                  Reserve Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">Free cancellation · Instant confirmation</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
