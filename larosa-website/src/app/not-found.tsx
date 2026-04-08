import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background px-6 py-24">
      <div className="mx-auto max-w-5xl border border-border bg-card/60 p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-5">
          Error 404
        </p>
        <h1 className="font-serif text-5xl md:text-7xl text-foreground leading-tight">
          The page you requested
          <br />
          is no longer in this wing.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          The destination may have moved, the link may be outdated, or the page
          may not exist in this release. Continue to the main lobby or explore
          our featured spaces below.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild className="rounded-none px-10 h-12 font-serif tracking-widest uppercase">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none px-10 h-12 font-serif tracking-widest uppercase">
            <Link href="/rooms">View Rooms</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none px-10 h-12 font-serif tracking-widest uppercase">
            <Link href="/contact">Contact Concierge</Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/about"
            className="border border-border bg-background p-5 hover:bg-muted/40 transition-colors"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Discover
            </p>
            <p className="font-serif text-xl text-foreground">Our Story</p>
          </Link>
          <Link
            href="/gallery"
            className="border border-border bg-background p-5 hover:bg-muted/40 transition-colors"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Browse
            </p>
            <p className="font-serif text-xl text-foreground">Gallery</p>
          </Link>
          <Link
            href="/rooms"
            className="border border-border bg-background p-5 hover:bg-muted/40 transition-colors"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Reserve
            </p>
            <p className="font-serif text-xl text-foreground">Signature Suites</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
