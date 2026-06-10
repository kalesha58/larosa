"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CampaignImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

export function CampaignImageUpload({
  value,
  onChange,
  disabled,
}: CampaignImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        onChange(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative aspect-[21/9] w-full max-w-xl overflow-hidden rounded-xl border border-border">
          <Image src={value} alt="Campaign" fill className="object-cover" />
          {!disabled && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-lg"
              onClick={() => onChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex aspect-[21/9] w-full max-w-xl flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/20 transition-colors hover:border-primary/40 hover:bg-secondary/30",
            (disabled || uploading) && "pointer-events-none opacity-50"
          )}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Upload showcase image
              </span>
            </>
          )}
        </button>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
