import Image from "next/image";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface AuthSplitPanelProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function AuthSplitPanel({
  children,
  className,
  compact = false,
}: AuthSplitPanelProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col md:grid md:grid-cols-12 bg-[#fcfcfc] overflow-hidden shadow-[0_24px_55px_-15px_rgba(0,0,0,0.6)]",
        compact
          ? "rounded-[1.75rem] md:min-h-[520px] md:max-h-[min(620px,85vh)]"
          : "min-h-[580px] md:h-[620px] rounded-[2rem]",
        className
      )}
    >
      <div className="md:hidden relative h-36 w-full overflow-hidden shrink-0">
        <Image
          src="/starry-night-lake.png"
          alt="Starry Lake"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute bottom-0 left-0 right-0 h-8">
          <svg
            className="w-full h-full text-[#fcfcfc] fill-current"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0,100 C35,65 65,65 100,100 Z" />
          </svg>
        </div>
        <div className="absolute top-6 left-6 z-10">
          <span className="font-serif font-bold text-xs tracking-wider uppercase text-white/90">
            {BRAND_NAME}
          </span>
        </div>
      </div>

      <div className="hidden md:flex md:col-span-5 relative flex-col justify-end p-8 text-white select-none">
        <Image
          src="/starry-night-lake.png"
          alt="Larosa Sanctuary"
          fill
          className="object-cover object-center"
          priority
          sizes="40vw"
        />
        <div className="absolute inset-0 bg-black/15 z-10" />

        <div className="absolute top-8 left-8 z-20">
          <span className="font-serif font-bold text-xs tracking-wider uppercase text-white/90">
            {BRAND_NAME}
          </span>
        </div>

        <div className="relative z-20 space-y-2 mb-6">
          <h2 className="font-serif text-3xl font-light leading-snug tracking-wide text-white">
            Let&apos;s go to a
            <br />
            <span className="font-bold">new journey</span>
          </h2>
        </div>

        <div className="absolute top-0 bottom-0 right-0 w-[45px] h-full z-20 translate-x-[0.5px]">
          <svg
            className="w-full h-full text-[#fcfcfc] fill-current"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M100,0 L100,100 L95,100 C75,90 85,75 60,60 C30,45 40,30 65,15 C75,5 80,0 95,0 Z" />
          </svg>
        </div>
      </div>

      <div className="col-span-1 md:col-span-7 flex flex-col justify-center px-6 py-8 sm:px-12 md:px-16 bg-[#fcfcfc] overflow-y-auto">
        <div className="w-full max-w-[360px] mx-auto">{children}</div>
      </div>
    </div>
  );
}
