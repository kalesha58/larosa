import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MotionGuide } from "@/components/MotionGuide";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";
import { CampaignStrip } from "@/components/campaigns/CampaignStrip";
import { GuestAuthPrompt } from "@/components/GuestAuthPrompt";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <CampaignStrip />
      <MotionGuide />
      <FloatingBookingCTA />
      <GuestAuthPrompt />
      <main className="flex-1 pt-[var(--campaign-strip-height,0px)] transition-[padding-top] duration-300">
        {children}
      </main>
      <Footer />
    </div>
  );
}
