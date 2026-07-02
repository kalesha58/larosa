"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  useGetCancellationFeedback,
  type CancellationFeedbackItem,
} from "@/hooks/use-queries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageSquareQuote, Star } from "lucide-react";
import { statusStyles } from "@/lib/admin-status-styles";

function ratingStars(rating: number | null) {
  if (!rating) return "—";
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating ? "fill-primary text-primary" : "text-muted-foreground/30"
          )}
        />
      ))}
    </span>
  );
}

function wouldBookBadge(value: CancellationFeedbackItem["wouldBookAgain"]) {
  if (!value) return "—";
  const styles =
    value === "yes"
      ? statusStyles.success
      : value === "no"
        ? statusStyles.error
        : statusStyles.warning;
  const label = value === "yes" ? "Yes" : value === "no" ? "No" : "Maybe";
  return (
    <Badge className={cn("rounded-lg border-none text-[9px] font-bold uppercase", styles.bg, styles.text)}>
      {label}
    </Badge>
  );
}

export default function AdminFeedbackPage() {
  const { data: feedback, isLoading } = useGetCancellationFeedback();

  return (
    <div className="space-y-10">
      <div className="border-b border-border/50 pb-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">
          System
        </p>
        <h1 className="font-serif text-4xl text-foreground">Cancellation feedback</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Responses from guests who cancelled their booking from the guest dashboard.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-admin-grid" />
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="h-14 text-[10px] font-bold uppercase tracking-widest">
                Guest
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Villa & dates
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Reason
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Rating
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Book again?
              </TableHead>
              <TableHead className="pr-8 text-[10px] font-bold uppercase tracking-widest">
                Comments
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-48 animate-pulse text-center text-muted-foreground"
                >
                  Loading feedback…
                </TableCell>
              </TableRow>
            ) : feedback?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  <MessageSquareQuote className="mx-auto mb-3 h-8 w-8 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    No cancellation feedback yet
                  </p>
                  <p className="mt-2 text-xs">
                    Feedback appears when guests cancel from their dashboard.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              feedback?.map((item) => (
                <TableRow
                  key={item.id}
                  className="group border-border align-top transition-colors hover:bg-secondary/10"
                >
                  <TableCell className="py-6">
                    <p className="font-serif text-lg">{item.guestName}</p>
                    <p className="text-xs text-muted-foreground">{item.guestEmail}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {format(new Date(item.createdAt), "MMM d, yyyy · h:mm a")}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm">
                    <p className="font-medium">{item.roomTitle}</p>
                    <p className="text-xs text-muted-foreground">{item.roomType}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {format(new Date(item.checkIn), "MMM d")} →{" "}
                      {format(new Date(item.checkOut), "MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-primary">₹{item.totalPrice.toLocaleString("en-IN")}</p>
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.reason === "other" && item.reasonOther
                      ? item.reasonOther
                      : item.reasonLabel}
                  </TableCell>
                  <TableCell>{ratingStars(item.experienceRating)}</TableCell>
                  <TableCell>{wouldBookBadge(item.wouldBookAgain)}</TableCell>
                  <TableCell className="max-w-xs pr-8 text-sm text-muted-foreground">
                    {item.comments || "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
