"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGetRoom } from "@/hooks/use-queries";
import { RoomAssetForm } from "@/components/admin/RoomAssetForm";
import { roomToFormValues } from "@/lib/room-form-schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const { data: room, isLoading, isError } = useGetRoom(roomId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">Villa not found</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/admin/rooms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to catalog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <RoomAssetForm
      mode="edit"
      roomId={roomId}
      calendarExportUrl={room.calendarExportUrl}
      initialValues={roomToFormValues(room)}
    />
  );
}
