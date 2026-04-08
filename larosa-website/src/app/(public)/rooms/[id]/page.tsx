"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  Users,
  Maximize,
  Wifi,
  Coffee,
  Wind,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { useGetRoom, useGetRoomAvailability } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER = "/room-deluxe.png";

export default function RoomDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const roomId = Number(params.id);

  const { data: room, isLoading: isRoomLoading } = useGetRoom(roomId, {
    query: {
      enabled: Number.isFinite(roomId) && roomId > 0,
    },
  });

  const { data: availability, isLoading: isAvailLoading } =
    useGetRoomAvailability(roomId, {
      query: {
        enabled: Number.isFinite(roomId) && roomId > 0,
      },
    });

  const [date, setDate] = useState<DateRange | undefined>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBookNow = () => {
    if (!date?.from || !date?.to) return;

    const search = new URLSearchParams();
    search.append("checkIn", date.from.toISOString());
    search.append("checkOut", date.to.toISOString());

    router.push(`/booking/${roomId}?${search.toString()}`);
  };

  const isDateBooked = (d: Date) => {
    if (!availability) return false;

    return availability.some((range) => {
      const start = new Date(range.checkIn);
      const end = new Date(range.checkOut);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const target = new Date(d);
      target.setHours(0, 0, 0, 0);

      return target >= start && target < end;
    });
  };

  if (!Number.isFinite(roomId) || roomId <= 0) {
    return (
      <div className="container py-32 text-center">
        <p className="text-muted-foreground">Invalid room.</p>
        <Button asChild className="mt-6 rounded-none">
          <Link href="/rooms">View rooms</Link>
        </Button>
      </div>
    );
  }

  if (isRoomLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <Skeleton className="w-full h-[60vh]" />
        <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="col-span-2 space-y-8">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container py-32 text-center">
        <h1 className="font-serif text-2xl mb-4">Room not found</h1>
        <Button asChild variant="outline" className="rounded-none">
          <Link href="/rooms">Back to accommodations</Link>
        </Button>
      </div>
    );
  }

  const iconMap: Record<string, React.ReactNode> = {
    Wifi: <Wifi className="w-5 h-5 text-primary" />,
    Minibar: <Coffee className="w-5 h-5 text-primary" />,
    "Air Conditioning": <Wind className="w-5 h-5 text-primary" />,
    "Room Service": <Check className="w-5 h-5 text-primary" />,
  };

  const mainImage = room.images[0] ?? PLACEHOLDER;
  const altImage1 = room.images[1] ?? room.images[0] ?? PLACEHOLDER;
  const altImage2 = room.images[2] ?? room.images[0] ?? PLACEHOLDER;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full overflow-hidden">
          <div className="lg:col-span-2 relative min-h-[40vh]">
            <Image
              src={mainImage}
              alt={room.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          </div>
          <div className="hidden lg:flex flex-col h-full min-h-[40vh] border-l border-border">
            <div className="h-1/2 relative border-b border-border min-h-0">
              <Image
                src={altImage1}
                alt={`${room.title} alternate view`}
                fill
                sizes="33vw"
                className="object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="h-1/2 relative min-h-0">
              <Image
                src={altImage2}
                alt={`${room.title} detail`}
                fill
                sizes="33vw"
                className="object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-4 font-medium">
            {room.type} Room
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-8 leading-tight">
            {room.title}
          </h1>

          <div className="flex flex-wrap gap-6 mb-12 pb-12 border-b border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5 text-primary" />
              <span>Up to {room.capacity} Guests</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Maximize className="w-5 h-5 text-primary" />
              <span>{room.sizeSqFt} sq ft</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-16">
            <p className="text-lg text-foreground/80 leading-relaxed font-light">
              {room.description}
            </p>
            <p className="text-muted-foreground mt-4">
              Designed for the discerning traveler, this magnificent sanctuary
              offers unparalleled comfort. Features include bespoke
              furnishings, Italian marble bathrooms, and panoramic windows that
              bathe the space in natural light while ensuring complete privacy.
            </p>
          </div>

          <h3 className="font-serif text-3xl text-foreground mb-8">Amenities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {room.amenities.map((amenity, i) => (
              <div
                key={`${amenity}-${i}`}
                className="flex items-center gap-4 bg-card border border-border p-4"
              >
                {iconMap[amenity] ?? (
                  <Check className="w-5 h-5 text-primary" />
                )}
                <span className="text-foreground">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-card border border-border p-8 shadow-2xl">
            <div className="flex items-baseline gap-2 mb-8 border-b border-border pb-6">
              <span className="font-serif text-4xl text-primary">${room.price}</span>
              <span className="text-muted-foreground tracking-wider uppercase text-xs">
                / Night
              </span>
            </div>

            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  Select Dates
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background/50 border-border h-14 rounded-none",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Check-in - Check-out</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      disabled={(d) =>
                        d <
                          new Date(new Date().setHours(0, 0, 0, 0)) ||
                        isAvailLoading ||
                        isDateBooked(d)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {date?.from && date?.to && (
                <div className="bg-background/50 p-4 border border-border space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ${room.price} x{" "}
                      {Math.ceil(
                        (date.to.getTime() - date.from.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      nights
                    </span>
                    <span className="text-foreground">
                      $
                      {room.price *
                        Math.ceil(
                          (date.to.getTime() - date.from.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span className="text-foreground">
                      $
                      {Math.floor(
                        room.price *
                          0.15 *
                          Math.ceil(
                            (date.to.getTime() - date.from.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                      )}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between font-serif text-lg text-primary">
                    <span>Total</span>
                    <span>
                      $
                      {Math.floor(
                        room.price *
                          1.15 *
                          Math.ceil(
                            (date.to.getTime() - date.from.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleBookNow}
              disabled={!date?.from || !date?.to}
              className="w-full h-14 rounded-none font-serif tracking-widest text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              RESERVE
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              You won&apos;t be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
