import { HomePage } from "@/components/home/HomePage";
import { sequence1FrameUrl } from "@/lib/scroll-sequence-config";

export default function Home() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={sequence1FrameUrl(0)}
        fetchPriority="high"
      />
      <HomePage />
    </>
  );
}
