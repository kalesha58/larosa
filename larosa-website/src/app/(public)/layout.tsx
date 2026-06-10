import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MotionGuide } from "@/components/MotionGuide";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";
import { CampaignStrip } from "@/components/campaigns/CampaignStrip";
import { CampaignShowcase } from "@/components/campaigns/CampaignShowcase";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <CampaignStrip />
      <Navbar />
      <MotionGuide />
      <FloatingBookingCTA />
      <main className="flex-1">
        <CampaignShowcase placement="main_top" />
        {children}
      </main>
      <Footer />
    </div>
  );
}
