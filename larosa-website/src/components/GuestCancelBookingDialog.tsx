"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCancelBooking } from "@/hooks/use-queries";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getGetUserBookingsQueryKey } from "@/hooks/use-queries";
import { CANCELLATION_REASON_LABELS } from "@/lib/cancellation-feedback";
import type { CancellationReason } from "@/models/CancellationFeedback";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

type BookingForCancel = {
  id: string;
  room: { title: string };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
};

export function GuestCancelBookingDialog({ booking }: { booking: BookingForCancel }) {
  const cancelBooking = useCancelBooking();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<CancellationReason | "">("");
  const [reasonOther, setReasonOther] = useState("");
  const [experienceRating, setExperienceRating] = useState<number | undefined>();
  const [wouldBookAgain, setWouldBookAgain] = useState<"yes" | "no" | "maybe" | "">("");
  const [comments, setComments] = useState("");

  const resetForm = () => {
    setReason("");
    setReasonOther("");
    setExperienceRating(undefined);
    setWouldBookAgain("");
    setComments("");
  };

  const handleCancel = async () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Please select a reason",
        description: "Help us improve by telling us why you're cancelling.",
      });
      return;
    }
    if (reason === "other" && !reasonOther.trim()) {
      toast({
        variant: "destructive",
        title: "Please describe your reason",
        description: "Add a short note under “Other”.",
      });
      return;
    }

    try {
      await cancelBooking.mutateAsync({
        id: booking.id,
        feedback: {
          reason,
          ...(reason === "other" ? { reasonOther: reasonOther.trim() } : {}),
          ...(experienceRating ? { experienceRating } : {}),
          ...(wouldBookAgain ? { wouldBookAgain } : {}),
          ...(comments.trim() ? { comments: comments.trim() } : {}),
        },
      });
      setOpen(false);
      resetForm();
      toast({
        title: "Booking cancelled",
        description:
          "Your reservation has been cancelled. Your refund has been initiated and will reflect in your bank account within 2–3 business days. A confirmation email has been sent.",
      });
      queryClient.invalidateQueries({ queryKey: getGetUserBookingsQueryKey() });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unable to cancel booking.";
      toast({ variant: "destructive", title: "Cancellation failed", description: msg });
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-none border border-border text-muted-foreground hover:border-destructive hover:bg-destructive hover:text-white text-xs tracking-widest p-5 uppercase font-serif"
        >
          Cancel Reservation
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto rounded-none border-border bg-card shadow-2xl sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-2xl">Cancel your stay?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">{booking.room.title}</strong>
              </p>
              <p>
                {format(new Date(booking.checkIn), "MMM d, yyyy")} →{" "}
                {format(new Date(booking.checkOut), "MMM d, yyyy")}
              </p>
              <p className="italic">
                We're sorry to see you go. A few quick questions help us improve — then we'll
                cancel your booking and email you a confirmation. If you paid, your refund will be
                initiated and should reflect in your bank account within 2–3 business days.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label>Why are you cancelling? *</Label>
            <Select
              value={reason}
              onValueChange={(v) => setReason(v as CancellationReason)}
            >
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(CANCELLATION_REASON_LABELS) as [CancellationReason, string][]
                ).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason === "other" && (
            <div className="space-y-2">
              <Label>Please tell us more *</Label>
              <Textarea
                value={reasonOther}
                onChange={(e) => setReasonOther(e.target.value)}
                placeholder="Your reason…"
                className="rounded-none"
                rows={2}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>How was your booking experience?</Label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setExperienceRating(experienceRating === value ? undefined : value)
                    }
                    className="rounded p-1 transition-colors hover:bg-secondary"
                    aria-label={`Rate ${value} out of 5`}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        experienceRating && value <= experienceRating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/40"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Would you book with LaRosa again?</Label>
            <Select
              value={wouldBookAgain}
              onValueChange={(v) => setWouldBookAgain(v as "yes" | "no" | "maybe")}
            >
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Anything else we should know?</Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Optional feedback…"
              className="rounded-none"
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="rounded-none h-12 border-border tracking-widest uppercase font-serif px-8">
            Keep booking
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            className="rounded-none h-12 tracking-widest uppercase font-serif px-8"
            disabled={cancelBooking.isPending}
            onClick={() => void handleCancel()}
          >
            {cancelBooking.isPending ? "Cancelling…" : "Confirm cancellation"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
