"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { Moon, Sun, Menu, X } from "lucide-react";

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const showAuthUser = !loading && user;
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="font-serif text-2xl font-bold tracking-[0.2em] text-primary">
              LAROSA
            </Link>
            <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-[0.15em]">
              <Link href="/rooms" className="text-foreground/80 hover:text-primary transition-colors uppercase">
                Rooms & Suites
              </Link>
              <Link href="/#villas" className="text-foreground/80 hover:text-primary transition-colors uppercase">
                Villas
              </Link>
              <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors uppercase">
                About
              </Link>
              <Link href="/#amenities" className="text-foreground/80 hover:text-primary transition-colors uppercase">
                Experiences
              </Link>
              <Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors uppercase">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors outline-none"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {showAuthUser && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9 border border-primary/30">
                      <AvatarFallback className="bg-secondary text-secondary-foreground font-serif text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="h-px bg-border my-1" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full cursor-pointer">My Bookings</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="w-full cursor-pointer text-primary">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <div className="h-px bg-border my-1" />
                  <DropdownMenuItem onClick={() => void logout()} className="text-destructive cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Link href="/auth/login" className="text-xs font-medium tracking-[0.15em] hover:text-primary transition-colors uppercase">
                  Sign In
                </Link>
                <Button asChild size="sm" className="font-serif tracking-widest px-6 text-xs h-9">
                  <Link href="/rooms">Book Now</Link>
                </Button>
              </div>
            )}

            <button
              className="lg:hidden h-9 w-9 flex items-center justify-center text-foreground/80 outline-none"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/*
        Mobile Menu is rendered OUTSIDE <header> so it is never affected
        by the header's backdrop-blur or bg-opacity. bg-background is
        always fully opaque regardless of scroll position.
      */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[70] bg-background lg:hidden"
          style={{ isolation: "isolate" }}
        >
          <div className="flex h-full flex-col px-6 pb-8 pt-6">
            <div className="mb-8 flex items-center justify-between border-b border-border pb-5">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-primary">
                LAROSA
              </span>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Explore Larosa
            </p>

            <nav className="space-y-2">
              <Link href="/rooms" className="block rounded-2xl border border-border px-4 py-4 text-[15px] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:bg-primary/[0.06] hover:text-primary" onClick={() => setMobileOpen(false)}>Rooms & Suites</Link>
              <Link href="/#villas" className="block rounded-2xl border border-border px-4 py-4 text-[15px] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:bg-primary/[0.06] hover:text-primary" onClick={() => setMobileOpen(false)}>Villas</Link>
              <Link href="/about" className="block rounded-2xl border border-border px-4 py-4 text-[15px] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:bg-primary/[0.06] hover:text-primary" onClick={() => setMobileOpen(false)}>About</Link>
              <Link href="/#amenities" className="block rounded-2xl border border-border px-4 py-4 text-[15px] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:bg-primary/[0.06] hover:text-primary" onClick={() => setMobileOpen(false)}>Experiences</Link>
              <Link href="/contact" className="block rounded-2xl border border-border px-4 py-4 text-[15px] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-primary hover:bg-primary/[0.06] hover:text-primary" onClick={() => setMobileOpen(false)}>Contact</Link>
            </nav>

            <div className="mt-auto pt-8">
              {!showAuthUser ? (
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    className="block rounded-xl border border-border px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/rooms"
                    className="block rounded-xl bg-primary px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/90"
                    onClick={() => setMobileOpen(false)}
                  >
                    Book Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/dashboard" className="block rounded-xl border border-border px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:border-primary hover:text-primary" onClick={() => setMobileOpen(false)}>My Bookings</Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="block rounded-xl border border-border px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:border-primary hover:text-primary" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      void logout();
                    }}
                    className="block w-full rounded-xl bg-primary px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
