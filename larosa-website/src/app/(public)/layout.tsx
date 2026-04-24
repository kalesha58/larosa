import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MotionGuide } from "@/components/MotionGuide";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <MotionGuide />
      <FloatingBookingCTA />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
