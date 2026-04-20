"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarDays, 
  LogOut, 
  ChevronRight,
  ExternalLink,
  User,
  Settings,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase animate-pulse">Initializing Terminal</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 border border-border bg-card shadow-2xl"
          >
            <h1 className="font-serif text-4xl mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              This area is restricted to administrators only. Please verify your credentials if you believe this is an error.
            </p>
            <Link href="/">
              <Button variant="outline" className="w-full rounded-none tracking-widest uppercase text-xs">
                Return to Sanctuary
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const nav = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  ];

  const systemNav = [
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
  ];

  const breadcrumbs = pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 flex flex-col fixed inset-y-0 left-0 z-50 overflow-hidden shadow-2xl">
        <div className="h-20 flex items-center px-8 border-b border-border/50">
          <Link href="/" className="group flex items-center gap-2">
            <span className="h-8 w-8 bg-primary flex items-center justify-center text-primary-foreground font-serif text-xl">L</span>
            <span className="font-serif text-lg font-bold tracking-[0.15em] transition-colors group-hover:text-primary">
              LAROSA
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 no-scrollbar">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mb-6">Management</p>
          <nav className="space-y-1.5">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <span className={cn(
                    "group flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 relative overflow-hidden",
                    active 
                      ? "text-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  )}>
                    {active && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                      />
                    )}
                    <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", active ? "text-primary" : "text-muted-foreground")} />
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-12">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mb-6">System</p>
            <nav className="space-y-1.5">
              {systemNav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <span className={cn(
                      "group flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 relative overflow-hidden",
                      active 
                        ? "text-primary bg-primary/5" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    )}>
                      {active && (
                        <motion.div 
                          layoutId="activeNavSystem"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                        />
                      )}
                      <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", active ? "text-primary" : "text-muted-foreground")} />
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-border/50 bg-secondary/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full h-14 px-2 hover:bg-secondary/30 rounded-none flex items-center justify-start gap-3 transition-all">
                <Avatar className="h-9 w-9 rounded-none border border-border shadow-sm">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-serif">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left hidden xl:block overflow-hidden">
                  <p className="text-xs font-bold truncate tracking-wider">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-[0.1em]">Administrator</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-none border-border shadow-xl">
              <DropdownMenuLabel className="font-serif">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs gap-2 py-2 cursor-pointer">
                <User className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2 py-2 cursor-pointer">
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => void logout()}
                className="text-xs gap-2 py-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="uppercase tracking-[0.2em] text-[10px] font-bold">Admin</span>
              {breadcrumbs.map((crumb, i) => (
                <div key={crumb} className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3" />
                  <span className={cn(
                    "uppercase tracking-[0.2em] text-[10px] font-bold",
                    i === breadcrumbs.length - 1 ? "text-foreground" : ""
                  )}>
                    {crumb === "admin" ? "Overview" : crumb}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" target="_blank" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
              View Website
              <ExternalLink className="h-3 w-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <div className="h-8 w-px bg-border/50" />
            <Button variant="outline" size="sm" className="rounded-none h-9 text-[10px] px-4 font-bold uppercase tracking-[0.2em]">
              Support
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 lg:p-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
