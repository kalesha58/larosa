"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type RoomImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  roomId?: string;
  disabled?: boolean;
  maxImages?: number;
};

type UploadState = {
  id: string;
  preview: string;
  status: "uploading" | "done" | "error";
  url?: string;
  error?: string;
};

export function RoomImageUpload({
  value,
  onChange,
  roomId,
  disabled,
  maxImages = 10,
}: RoomImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const valueRef = useRef(value);
  valueRef.current = value;

  const uploadFile = useCallback(
    async (file: File) => {
      const id = `${Date.now()}-${file.name}`;
      const preview = URL.createObjectURL(file);

      setUploads((prev) => [
        ...prev,
        { id, preview, status: "uploading" },
      ]);

      try {
        const formData = new FormData();
        formData.append("file", file);
        if (roomId) formData.append("roomId", roomId);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Upload failed");
        }

        onChange([...valueRef.current, data.url]);
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: "done", url: data.url } : u
          )
        );
        URL.revokeObjectURL(preview);
        setTimeout(() => {
          setUploads((prev) => prev.filter((u) => u.id !== id));
        }, 500);
      } catch (err) {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id
              ? {
                  ...u,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : u
          )
        );
      }
    },
    [onChange, roomId]
  );

  const handleFiles = (files: FileList | null) => {
    if (!files?.length || disabled) return;
    const remaining = maxImages - valueRef.current.length;
    if (remaining <= 0) return;
    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => uploadFile(file));
  };

  const atLimit = value.length >= maxImages;

  const removeImage = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onClick={() => !disabled && !atLimit && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/10 p-6 transition-colors",
          !disabled && !atLimit && "cursor-pointer hover:border-primary/40 hover:bg-primary/5",
          (disabled || atLimit) && "opacity-50 cursor-not-allowed"
        )}
      >
        <Upload className="h-5 w-5 text-muted-foreground" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Drop images or click to upload
        </p>
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70">
          JPEG, PNG, WebP · max 10 MB · {value.length}/{maxImages} images
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {(value.length > 0 || uploads.length > 0) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url) => (
            <div
              key={url}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border"
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes="160px"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-1.5 top-1.5 h-7 w-7 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                disabled={disabled}
                onClick={() => removeImage(url)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          {uploads
            .filter((u) => u.status !== "done")
            .map((u) => (
              <div
                key={u.id}
                className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary/20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u.preview}
                  alt=""
                  className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 p-2 text-center">
                  {u.status === "uploading" && (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  )}
                  {u.status === "error" && (
                    <p className="text-[9px] font-medium text-red-200">
                      {u.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
