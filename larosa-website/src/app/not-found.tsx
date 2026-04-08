import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-[120px] leading-tight text-primary/20 select-none">404</h1>
        <h2 className="font-serif text-3xl mb-4 -mt-10">Lost in the Sanctuary</h2>
        <p className="text-muted-foreground mb-12 uppercase tracking-widest text-xs font-medium">
          The sanctuary you are looking for does not exist or has been relocated to a more private domain.
        </p>
        <Button asChild className="rounded-none px-12 h-14 font-serif tracking-widest uppercase">
          <Link href="/">Return to Grand Entrance</Link>
        </Button>
      </div>
    </div>
  );
}
