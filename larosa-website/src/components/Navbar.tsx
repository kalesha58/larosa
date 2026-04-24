"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Moon, Sun, Menu, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/villas", label: "Villas" },
  { href: "/about", label: "About" },
  { href: "/#amenities", label: "Experiences" },
  { href: "/contact", label: "Contact" },
] as const;

function navLinkActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const showAuthUser = !loading && user;
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-[background,box-shadow,border-color] duration-500 ease-out",
          scrolled
            ? "border-b border-border/60 bg-background/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-xl dark:bg-background/80 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.04)]"
            : "border-b border-transparent bg-gradient-to-b from-background/70 via-background/35 to-transparent backdrop-blur-md dark:from-background/50 dark:via-background/20"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-80" aria-hidden />

        <div className="container relative mx-auto flex h-[4.25rem] max-w-[1400px] items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-10">
            <Link
              href="/"
              className="group relative shrink-0 font-serif text-xl font-semibold tracking-[0.22em] text-foreground sm:text-2xl sm:tracking-[0.24em]"
            >
              <span className="bg-gradient-to-b from-foreground to-foreground/75 bg-clip-text text-transparent transition-opacity group-hover:opacity-90 dark:from-foreground dark:to-foreground/85">
                LAROSA
              </span>
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary/60 transition-all duration-300 group-hover:w-full" aria-hidden />
            </Link>

            <nav
              className="hidden min-w-0 lg:flex lg:items-center"
              aria-label="Primary"
            >
              <div
                className={cn(
                  "flex items-center gap-0.5 rounded-full border border-border/50 bg-card/40 px-1 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-md dark:border-border/40 dark:bg-card/25 dark:shadow-inner"
                )}
              >
                {NAV_LINKS.map(({ href, label }) => {
                  const active = navLinkActive(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "whitespace-nowrap rounded-full px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.16em] transition-all duration-200 xl:px-4",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      )}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-all duration-200",
                "hover:border-border/80 hover:bg-muted/50 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-[17px] w-[17px]" strokeWidth={1.5} />
              ) : (
                <Moon className="h-[17px] w-[17px]" strokeWidth={1.5} />
              )}
            </button>

            {showAuthUser && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full border border-border/50 bg-card/30 p-0 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/35 hover:bg-muted/40"
                  >
                    <Avatar className="h-[2.125rem] w-[2.125rem] border-0">
                      <AvatarFallback className="bg-gradient-to-br from-primary/15 to-muted font-serif text-sm text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-xl border-border/60 shadow-xl"
                  align="end"
                  sideOffset={8}
                >
                  <div className="flex flex-col gap-0.5 px-2 py-2">
                    <p className="text-sm font-medium leading-tight">{user.name}</p>
                    <p className="text-xs leading-tight text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="mx-2 h-px bg-border/70" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer rounded-lg">
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="cursor-pointer rounded-lg text-primary"
                      >
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <div className="mx-2 h-px bg-border/70" />
                  <DropdownMenuItem
                    onClick={() => void logout()}
                    className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 lg:flex lg:gap-3">
                <Link
                  href="/auth/login"
                  className="rounded-full px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign In
                </Link>
                <Button
                  asChild
                  size="sm"
                  className="h-9 rounded-full border border-primary/20 bg-primary px-5 font-serif text-[10px] tracking-[0.18em] shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <Link href="/rooms">Book Now</Link>
                </Button>
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full border border-border/50 bg-card/20 text-foreground backdrop-blur-sm hover:bg-muted/60 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className={cn(
            "flex h-full w-full max-w-[min(100vw,20rem)] flex-col gap-0 overflow-y-auto border-l border-border/50 p-0 sm:max-w-[21rem]",
            "bg-gradient-to-b from-background via-card/40 to-muted/20 shadow-[-16px_0_48px_-20px_rgba(0,0,0,0.18)]",
            "dark:from-background dark:via-card/15 dark:to-muted/10 dark:shadow-[-16px_0_48px_-16px_rgba(0,0,0,0.5)]",
            "[&>button]:right-4 [&>button]:top-4 [&>button]:hidden"
          )}
        >
          <SheetTitle className="sr-only">Main navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Browse rooms, villas, experiences, and contact the property.
          </SheetDescription>

          <div className="flex items-center justify-between border-b border-border/50 bg-card/30 px-4 py-3.5 backdrop-blur-sm sm:px-5">
            <span className="font-serif text-lg font-semibold tracking-[0.2em] text-foreground">
              LAROSA
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full border border-border/60 text-muted-foreground hover:border-primary/40 hover:bg-muted/50 hover:text-foreground"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </div>

          <div className="flex flex-1 flex-col px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-5">
            <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Menu
            </p>

            <nav className="flex flex-col gap-1" aria-label="Mobile primary">
              {NAV_LINKS.map(({ href, label }) => {
                const active = navLinkActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all duration-200",
                      "text-[13px] font-medium leading-snug tracking-tight text-foreground",
                      active
                        ? "border-primary/25 bg-primary/[0.08] text-primary"
                        : "hover:border-border/60 hover:bg-muted/40"
                    )}
                  >
                    <span>{label}</span>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform duration-200",
                        "group-hover:translate-x-0.5 group-hover:text-primary/70",
                        active && "text-primary/70"
                      )}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-border/40 pt-4">
              {!showAuthUser ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-border/60 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/35 hover:bg-muted/30 hover:text-foreground"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/rooms"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl bg-primary py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    Book now
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-border/60 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/35 hover:bg-muted/30 hover:text-foreground"
                  >
                    My bookings
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl border border-border/60 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/35 hover:bg-muted/30 hover:text-foreground"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      void logout();
                    }}
                    className="rounded-xl bg-primary py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
