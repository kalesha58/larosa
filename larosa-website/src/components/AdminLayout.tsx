"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BedDouble, CalendarDays, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm tracking-widest uppercase">Loading</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-serif text-3xl mb-4">Unauthorized</h1>
          <p className="text-muted-foreground mb-8">You do not have access to this area.</p>
          <Link href="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const nav = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/" className="font-serif text-xl font-bold tracking-widest text-primary">
            LAROSA Admin
          </Link>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <span className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wide transition-colors outline-none",
                  active ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                )}>
                  <Icon className="w-5 h-5" />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button 
            onClick={() => void logout()}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wide text-destructive hover:bg-destructive/10 w-full transition-colors outline-none"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen p-8 md:p-12">
        {children}
      </main>
    </div>
  );
}
