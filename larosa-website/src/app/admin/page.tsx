"use client";

import { 
  useGetAdminStats, 
  useGetRevenueData, 
  useGetAllBookings,
} from "@/hooks/use-queries";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpRight,
  CheckCircle,
  DollarSign,
  Home,
  TrendingUp,
  XCircle,
  Users,
  Calendar,
  Clock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: revenueData, isLoading: revLoading } = useGetRevenueData();
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookings();

  if (statsLoading || revLoading || bookingsLoading || !stats || !revenueData || !bookings) {
    return (
      <div className="space-y-10">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      title: "Total Revenue", 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      trend: "+12.5%", 
      description: "from last month",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    { 
      title: "Occupancy Rate", 
      value: `${stats.occupancyRate}%`, 
      icon: Home, 
      trend: "+4.2%", 
      description: "avg guest stay 3.2 days",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      title: "Active Bookings", 
      value: stats.confirmedBookings, 
      icon: CheckCircle, 
      trend: "+8", 
      description: "new this week",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    { 
      title: "Cancellations", 
      value: stats.cancelledBookings, 
      icon: XCircle, 
      trend: "-2%", 
      description: "vs last month",
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
  ];

  const bookingStatusData = [
    { name: "Confirmed", value: stats.confirmedBookings, fill: "hsl(var(--primary))" },
    { name: "Cancelled", value: stats.cancelledBookings, fill: "hsl(var(--muted-foreground))" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <section className="relative overflow-hidden border border-border bg-card/40 p-8 lg:p-12 shadow-sm rounded-3xl">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <TrendingUp size={120} />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-2">
            Intelligence Console
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">
            Command Center
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            Welcome back to the Larosa management suite. Your property is currently at <span className="text-foreground font-bold">{stats.occupancyRate}% occupancy</span> with <span className="text-foreground font-bold">{stats.confirmedBookings} active reservations</span>.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} variants={itemVariants}>
              <Card className="bg-card border-border rounded-2xl shadow-sm group hover:shadow-md transition-all hover:border-primary/50 relative overflow-hidden">
                <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity", stat.bg)} />
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={cn("p-2", stat.bg)}>
                    <Icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-serif text-foreground mb-1 tracking-tight">{stat.value}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("rounded-lg border-none px-0 text-[10px] font-bold", stat.color)}>
                      {stat.trend}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">
                      {stat.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="xl:col-span-2 bg-card border-border rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-2xl">Revenue Performance</CardTitle>
              <CardDescription className="text-xs uppercase tracking-widest mt-1 text-muted-foreground">Monthly growth analytics</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-bold uppercase tracking-widest gap-2">
              Generate Report <ArrowUpRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ dy: 10 }}
                    fontWeight="bold"
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value/1000}k`}
                    fontWeight="bold"
                  />
                  <Tooltip
                    cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0",
                      padding: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                    }}
                    labelStyle={{
                      fontWeight: "bold",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontSize: "10px"
                    }}
                    itemStyle={{
                      fontSize: "12px",
                      color: "hsl(var(--foreground))",
                      fontFamily: "var(--font-serif)"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="url(#revenueGradient)"
                    strokeWidth={3}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="bg-card border-border rounded-2xl shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Distribution</CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest text-muted-foreground">Booking status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="h-[240px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={65}
                    paddingAngle={8}
                    stroke="none"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-serif">{stats.confirmedBookings + stats.cancelledBookings}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Total</span>
              </div>
            </div>
            <div className="mt-auto space-y-3 pt-6 border-t border-border">
              {bookingStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-serif font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings Feed */}
        <Card className="bg-card border-border rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-secondary/5">
            <div>
              <CardTitle className="font-serif text-xl">Recent Reservations</CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Latest booking requests</CardDescription>
            </div>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest gap-2">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentBookings.length > 0 ? (
              <div className="divide-y divide-border/50">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-secondary/10 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/5 flex items-center justify-center text-primary font-serif">
                        {booking.guestName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold tracking-tight">{booking.guestName}</p>
                        <p className="text-xs text-muted-foreground font-mono">{booking.room.title}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {format(new Date(booking.checkIn), "MMM dd")} - {format(new Date(booking.checkOut), "MMM dd")}
                        </span>
                      </div>
                      <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="rounded-lg text-[8px] h-4 uppercase tracking-[0.2em] font-bold py-0">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                <p className="text-xs uppercase tracking-[0.2em]">No recent activity found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule / System Alerts */}
        <Card className="bg-card border-border rounded-2xl shadow-sm">
          <CardHeader className="border-b border-border/50 bg-secondary/5">
            <CardTitle className="font-serif text-xl">Property Status</CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Real-time alerts & schedule</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex gap-4 p-4 border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 text-emerald-500/20 group-hover:scale-125 transition-transform">
                  <CheckCircle size={40} />
                </div>
                <div className="h-10 w-px bg-emerald-500" />
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">System Healthy</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">All room services and integrations are operating within normal parameters.</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground border-b pb-2">Operational Schedule</p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-secondary/20 flex flex-col items-center justify-center text-center rounded-xl">
                      <Users className="h-5 w-5 text-primary mb-2" />
                      <span className="text-2xl font-serif">12</span>
                      <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Check-ins Today</span>
                   </div>
                   <div className="p-4 bg-secondary/20 flex flex-col items-center justify-center text-center rounded-xl">
                      <Clock className="h-5 w-5 text-primary mb-2" />
                      <span className="text-2xl font-serif">8</span>
                      <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Upcoming Departures</span>
                   </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Maintenance Tasks</span>
                  <Badge className="bg-primary/10 text-primary border-none text-[8px] rounded-lg">3 Pending</Badge>
                </div>
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 bg-primary/40 rounded-full" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80">Room {100+i} Inspection Required</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
