"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  useGetCampaigns,
  useDeleteCampaign,
  useToggleCampaignVisibility,
  type Campaign,
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
import { useToast } from "@/hooks/use-toast";
import { Edit, Eye, EyeOff, Megaphone, Plus, Trash2 } from "lucide-react";
import { statusStyles } from "@/lib/admin-status-styles";

function statusBadge(status: Campaign["status"]) {
  switch (status) {
    case "active":
      return cn(statusStyles.success.bg, statusStyles.success.text);
    case "draft":
      return cn(statusStyles.warning.bg, statusStyles.warning.text);
    case "archived":
      return cn(statusStyles.neutral.bg, statusStyles.neutral.text);
  }
}

export default function AdminCampaignsPage() {
  const { data: campaigns, isLoading } = useGetCampaigns({ admin: true });
  const deleteCampaign = useDeleteCampaign();
  const toggleVisibility = useToggleCampaignVisibility();
  const { toast } = useToast();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete campaign "${name}"? This cannot be undone.`)) return;
    try {
      await deleteCampaign.mutateAsync({ id });
      toast({ title: "Campaign deleted", description: `"${name}" has been removed.` });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Could not delete campaign",
      });
    }
  };

  const handleToggleVisibility = async (campaign: Campaign, visible: boolean) => {
    setTogglingId(campaign.id);
    try {
      await toggleVisibility.mutateAsync({ id: campaign.id, visible });
      toast({
        title: visible ? "Campaign is live" : "Campaign hidden",
        description: visible
          ? `"${campaign.name}" is now shown on the site. Other ${campaign.type} campaigns were hidden.`
          : `"${campaign.name}" is no longer visible on the public site.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Could not update visibility",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const liveStripId = campaigns?.find((c) => c.type === "strip" && c.status === "active")?.id;
  const liveShowcaseId = campaigns?.find((c) => c.type === "showcase" && c.status === "active")?.id;

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-6 border-b border-border/50 pb-6 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">
            Marketing
          </p>
          <h1 className="font-serif text-4xl text-foreground">Campaigns</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Only one strip and one showcase can be live at a time. Use Show to publish a campaign
            — it automatically hides other campaigns of the same type.
          </p>
        </div>
        <Button
          asChild
          className="h-12 rounded-xl bg-primary px-8 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
        >
          <Link href="/admin/campaigns/new">
            <Plus className="mr-2 h-4 w-4" /> New campaign
          </Link>
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-admin-grid" />
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="h-14 text-[10px] font-bold uppercase tracking-widest">Campaign</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Type</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Visibility</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Schedule</TableHead>
              <TableHead className="pr-8 text-right text-[10px] font-bold uppercase tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 animate-pulse text-center text-muted-foreground">
                  Loading campaigns…
                </TableCell>
              </TableRow>
            ) : campaigns?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  <Megaphone className="mx-auto mb-3 h-8 w-8 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">No campaigns yet</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link href="/admin/campaigns/new">Create your first campaign</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              campaigns?.map((campaign) => {
                const isLive =
                  campaign.status === "active" &&
                  (campaign.type === "strip"
                    ? campaign.id === liveStripId
                    : campaign.id === liveShowcaseId);

                return (
                  <TableRow
                    key={campaign.id}
                    className="group border-border transition-colors hover:bg-secondary/10"
                  >
                    <TableCell className="py-6">
                      <p className="font-serif text-lg">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">{campaign.headline}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-lg text-[9px] font-bold uppercase tracking-widest">
                        {campaign.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "rounded-lg border-none text-[9px] font-bold uppercase tracking-widest",
                          isLive ? statusBadge("active") : statusBadge("draft")
                        )}
                      >
                        {isLive ? "Live on site" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">
                      {campaign.startsAt
                        ? format(new Date(campaign.startsAt), "MMM d, yyyy")
                        : "—"}
                      {" → "}
                      {campaign.endsAt
                        ? format(new Date(campaign.endsAt), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isLive ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={togglingId === campaign.id}
                            className="h-9 rounded-xl text-[9px] font-bold uppercase tracking-widest"
                            onClick={() => handleToggleVisibility(campaign, false)}
                          >
                            <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                            Hide
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            disabled={
                              togglingId === campaign.id || campaign.status === "archived"
                            }
                            className="h-9 rounded-xl text-[9px] font-bold uppercase tracking-widest"
                            onClick={() => handleToggleVisibility(campaign, true)}
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            Show
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-xl">
                          <Link href={`/admin/campaigns/${campaign.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(campaign.id, campaign.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
