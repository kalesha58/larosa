"use client";

import { use } from "react";
import { CampaignForm } from "@/components/admin/CampaignForm";
import { useGetCampaign } from "@/hooks/use-queries";
import { campaignToFormValues } from "@/lib/campaign-form-schema";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditCampaignPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = use(params);
  const { data: campaign, isLoading, isError } = useGetCampaign(campaignId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-muted-foreground">Campaign not found.</p>
        <Button asChild variant="outline">
          <Link href="/admin/campaigns">Back to campaigns</Link>
        </Button>
      </div>
    );
  }

  return (
    <CampaignForm
      mode="edit"
      campaignId={campaignId}
      initialValues={campaignToFormValues(campaign)}
    />
  );
}
