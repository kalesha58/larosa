"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Calendar,
  ImageIcon,
  Loader2,
  Save,
  Sparkles,
  ToggleLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { RoomImageUpload } from "@/components/admin/RoomImageUpload";
import {
  ROOM_FORM_LIMITS,
  roomFormDefaults,
  roomFormSchema,
  formValuesToPayload,
  type RoomFormValues,
} from "@/lib/room-form-schema";
import {
  useCreateRoom,
  useUpdateRoom,
} from "@/hooks/use-queries";

type RoomAssetFormProps = {
  mode: "create" | "edit";
  roomId?: string;
  calendarExportUrl?: string;
  initialValues?: RoomFormValues;
};

function FormSection({
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:p-8",
        className
      )}
    >
      <div className="mb-6 flex items-start gap-3 border-b border-border/40 pb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-serif text-xl text-foreground">{title}</h2>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function CharCounter({
  current,
  max,
  min,
}: {
  current: number;
  max: number;
  min?: number;
}) {
  const nearLimit = current > max * 0.9;
  const belowMin = min !== undefined && current > 0 && current < min;

  return (
    <p
      className={cn(
        "text-right text-[10px] font-mono tabular-nums tracking-wide",
        belowMin && "text-status-warning",
        nearLimit && !belowMin && "text-status-warning",
        current > max && "text-destructive"
      )}
    >
      {current}/{max}
      {min !== undefined && current < min && current > 0 && (
        <span className="ml-1">· min {min}</span>
      )}
    </p>
  );
}

export function RoomAssetForm({
  mode,
  roomId,
  calendarExportUrl,
  initialValues,
}: RoomAssetFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const isSubmitting = createRoom.isPending || updateRoom.isPending;

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema) as Resolver<RoomFormValues>,
    defaultValues: initialValues ?? roomFormDefaults,
    mode: "onChange",
  });

  const description = form.watch("description") ?? "";
  const titleLen = (form.watch("title") ?? "").length;
  const amenityCount = (form.watch("amenities") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean).length;

  const onSubmit = async (values: RoomFormValues) => {
    const payload = formValuesToPayload(values);

    try {
      if (mode === "edit" && roomId) {
        await updateRoom.mutateAsync({ id: roomId, data: payload });
        toast({
          title: "Villa updated",
          description: `${values.title} has been saved successfully.`,
        });
      } else {
        await createRoom.mutateAsync({ data: payload });
        toast({
          title: "Villa registered",
          description: `${values.title} is now in the catalog.`,
        });
      }
      router.push("/admin/rooms");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not save",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const resolveExportUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base =
      process.env.NEXT_PUBLIC_APP_URL?.trim() ||
      (typeof window !== "undefined" ? window.location.origin : "");
    if (!base) return url;
    return `${base.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const exportUrl = resolveExportUrl(
    calendarExportUrl ||
      (roomId ? `/api/rooms/${roomId}/calendar.ics` : "")
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-border/50 bg-background/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl"
              asChild
            >
              <Link href="/admin/rooms" aria-label="Back to catalog">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary/70">
                {mode === "edit" ? "Edit listing" : "New listing"}
              </p>
              <h1 className="font-serif text-2xl text-foreground sm:text-3xl">
                {mode === "edit" ? "Modify Asset" : "Register New Villa"}
              </h1>
            </div>
          </div>
          <div className="flex gap-3 sm:shrink-0">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl sm:flex-none"
              asChild
            >
              <Link href="/admin/rooms">Cancel</Link>
            </Button>
            <Button
              type="submit"
              form="room-asset-form"
              disabled={isSubmitting}
              className="flex-1 rounded-xl sm:flex-none"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {mode === "edit" ? "Save changes" : "Register villa"}
            </Button>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          id="room-asset-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormSection
            title="Property identity"
            description="Name and classification shown across the site."
            icon={Sparkles}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <div className="flex items-end justify-between gap-2">
                      <FormLabel>Property title</FormLabel>
                      <CharCounter
                        current={titleLen}
                        max={ROOM_FORM_LIMITS.titleMax}
                        min={ROOM_FORM_LIMITS.titleMin}
                      />
                    </div>
                    <FormControl>
                      <Input
                        className="h-11 rounded-xl"
                        placeholder="e.g. Aqua Retreat"
                        maxLength={ROOM_FORM_LIMITS.titleMax}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="villa">Private Villa</SelectItem>
                        <SelectItem value="room">Hotel Room</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Presidential">Presidential</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Pricing & capacity"
            description="Nightly rate and guest limits for bookings."
            icon={ToggleLeft}
          >
            <div className="grid gap-6 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base price / night (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={ROOM_FORM_LIMITS.priceMin}
                        max={ROOM_FORM_LIMITS.priceMax}
                        className="h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max guests</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={ROOM_FORM_LIMITS.capacityMin}
                        max={ROOM_FORM_LIMITS.capacityMax}
                        className="h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalRooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical inventory</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={ROOM_FORM_LIMITS.totalRoomsMin}
                        max={ROOM_FORM_LIMITS.totalRoomsMax}
                        className="h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Units available to book</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Visibility & featured"
            description="Control whether this villa appears on the public site."
            icon={ToggleLeft}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/60 bg-secondary/20 p-5">
                    <div className="space-y-0.5 pr-4">
                      <FormLabel>Featured on homepage</FormLabel>
                      <FormDescription>
                        Showcase in the Villa Collection section
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/60 bg-secondary/20 p-5">
                    <div className="space-y-0.5 pr-4">
                      <FormLabel>Public visibility</FormLabel>
                      <FormDescription>
                        {field.value === "active"
                          ? "Visible on the website"
                          : "Hidden from guests"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === "active"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "active" : "hidden")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title="Asset narration"
            description="The story guests read on villa detail pages."
            icon={Sparkles}
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-end justify-between gap-2">
                    <FormLabel>Description</FormLabel>
                    <CharCounter
                      current={description.length}
                      max={ROOM_FORM_LIMITS.descriptionMax}
                      min={ROOM_FORM_LIMITS.descriptionMin}
                    />
                  </div>
                  <FormControl>
                    <Textarea
                      className="min-h-[160px] resize-y rounded-xl leading-relaxed"
                      placeholder="Describe the luxury experience, setting, and standout features…"
                      maxLength={ROOM_FORM_LIMITS.descriptionMax}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {ROOM_FORM_LIMITS.descriptionMin}–
                    {ROOM_FORM_LIMITS.descriptionMax} characters. Be vivid but
                    concise.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection
            title="Image portfolio"
            description={`Upload up to ${ROOM_FORM_LIMITS.imagesMax} photos. First image is the cover.`}
            icon={ImageIcon}
          >
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RoomImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      roomId={roomId}
                      maxImages={ROOM_FORM_LIMITS.imagesMax}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/{ROOM_FORM_LIMITS.imagesMax} images
                    uploaded
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection
            title="Luxury features"
            description="Comma-separated amenities shown on listing pages."
            icon={Sparkles}
          >
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-end justify-between gap-2">
                    <FormLabel>Amenities</FormLabel>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {amenityCount}/{ROOM_FORM_LIMITS.amenitiesMax} items
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      className="min-h-[120px] resize-y rounded-xl font-mono text-sm"
                      placeholder="Private swimming pool, Lake views, Wifi, Air Conditioning…"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate each feature with a comma. At least{" "}
                    {ROOM_FORM_LIMITS.amenitiesMin} required.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection
            title="Channel manager"
            description="Sync availability with Airbnb via iCal."
            icon={Calendar}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="airbnbCalendarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Airbnb import URL</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 rounded-xl font-mono text-xs"
                        placeholder="https://www.airbnb.com/calendar/ical/..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Paste the Airbnb iCal export link
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode === "edit" && roomId && (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Larosa export URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={exportUrl}
                      className="h-11 rounded-xl bg-muted/40 font-mono text-[10px]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 shrink-0 rounded-xl px-4 text-xs font-semibold"
                      onClick={() => {
                        navigator.clipboard.writeText(exportUrl);
                        toast({
                          title: "URL copied",
                          description:
                            "Paste this into Airbnb's Import Calendar setting.",
                        });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Provide this link to Airbnb to block dates
                  </p>
                </div>
              )}
            </div>
          </FormSection>
        </form>
      </Form>
    </div>
  );
}
