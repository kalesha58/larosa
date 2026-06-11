"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Loader2,
  Megaphone,
  Palette,
  Save,
  Type,
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
import { CampaignImageUpload } from "@/components/admin/CampaignImageUpload";
import {
  campaignFormDefaults,
  campaignFormSchema,
  formValuesToPayload,
  type CampaignFormValues,
} from "@/lib/campaign-form-schema";
import { useCreateCampaign, useUpdateCampaign } from "@/hooks/use-queries";

type CampaignFormProps = {
  mode: "create" | "edit";
  campaignId?: string;
  initialValues?: CampaignFormValues;
};

function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
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

export function CampaignForm({
  mode,
  campaignId,
  initialValues,
}: CampaignFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema) as Resolver<CampaignFormValues>,
    defaultValues: initialValues ?? campaignFormDefaults,
  });

  const campaignType = form.watch("type");
  const accent = form.watch("accent");

  const onSubmit = async (values: CampaignFormValues) => {
    const payload = formValuesToPayload(values);
    try {
      if (mode === "create") {
        await createCampaign.mutateAsync({ data: payload });
        toast({ title: "Campaign created", description: "Your campaign is ready to publish." });
      } else if (campaignId) {
        await updateCampaign.mutateAsync({ id: campaignId, data: payload });
        toast({ title: "Campaign updated", description: "Changes saved successfully." });
      }
      router.push("/admin/campaigns");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Could not save campaign",
      });
    }
  };

  const isSubmitting = createCampaign.isPending || updateCampaign.isPending;

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col gap-4 border-b border-border/50 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2 text-muted-foreground">
            <Link href="/admin/campaigns">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to campaigns
            </Link>
          </Button>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">
            {mode === "create" ? "New campaign" : "Edit campaign"}
          </p>
          <h1 className="font-serif text-4xl text-foreground">
            {mode === "create" ? "Create Campaign" : "Edit Campaign"}
          </h1>
        </div>
        <Button
          type="submit"
          form="campaign-form"
          disabled={isSubmitting}
          className="h-11 rounded-xl bg-primary px-8 text-xs font-bold uppercase tracking-widest"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {mode === "create" ? "Create" : "Save changes"}
        </Button>
      </div>

      <Form {...form}>
        <form id="campaign-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormSection title="Campaign setup" description="Type, status, and scheduling" icon={Megaphone}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Internal name</FormLabel>
                    <FormControl>
                      <Input className="rounded-xl bg-secondary/5" placeholder="Summer villa promo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Banner type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl bg-secondary/5">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="strip">Scrolling strip (below navbar)</SelectItem>
                        <SelectItem value="showcase">Showcase card (homepage, after collection)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl bg-secondary/5">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Priority</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={100} className="rounded-xl bg-secondary/5" {...field} />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      Use Show on the campaigns list to go live (one per type)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Starts at</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" className="rounded-xl bg-secondary/5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Ends at</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" className="rounded-xl bg-secondary/5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {campaignType === "strip" && (
                <FormField
                  control={form.control}
                  name="dismissible"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/50 p-4 md:col-span-2">
                      <div>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Dismissible</FormLabel>
                        <FormDescription className="text-[10px]">Visitors can close the strip</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </FormSection>

          <FormSection title="Content" description="Headline, message, and call to action" icon={Type}>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Headline</FormLabel>
                    <FormControl>
                      <Input className="rounded-xl bg-secondary/5" placeholder="Exclusive monsoon offer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px] rounded-xl bg-secondary/5"
                        placeholder="Optional body copy for showcase banners"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="ctaLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">CTA label</FormLabel>
                      <FormControl>
                        <Input className="rounded-xl bg-secondary/5" placeholder="Book now" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ctaUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">CTA URL</FormLabel>
                      <FormControl>
                        <Input className="rounded-xl bg-secondary/5" placeholder="/rooms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Appearance" description="Accent theme and optional image" icon={Palette}>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="accent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Accent preset</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {(["gold", "navy", "neutral"] as const).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => field.onChange(preset)}
                          className={cn(
                            "rounded-xl border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                            field.value === preset
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/30"
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <div
                      className={cn(
                        "mt-4 rounded-xl border p-4 text-sm",
                        accent === "gold" && "border-brand-gold/30 bg-brand-gold/10",
                        accent === "navy" && "border-brand-navy/30 bg-brand-navy text-white",
                        accent === "neutral" && "border-border bg-card"
                      )}
                    >
                      Preview accent: {accent}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {campaignType === "showcase" && (
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Showcase image</FormLabel>
                      <FormControl>
                        <CampaignImageUpload value={field.value ?? ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </FormSection>
        </form>
      </Form>
    </div>
  );
}
