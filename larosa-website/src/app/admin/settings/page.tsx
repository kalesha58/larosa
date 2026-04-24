"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Shield, Globe, Bell, CreditCard, Hotel } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettings() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-2">Configuration</p>
          <h1 className="font-serif text-4xl text-foreground">Settings</h1>
        </div>
        <Button className="rounded-xl bg-primary hover:bg-primary/90 h-10 px-8 uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-primary/20">
          <Save className="mr-2 h-3.5 w-3.5" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar for Settings */}
        <div className="lg:col-span-1 space-y-2">
          <div className="p-4 bg-primary/5 border-l-2 border-primary rounded-r-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Hotel className="h-3.5 w-3.5" /> Property Profile
            </p>
          </div>
          <div className="p-4 hover:bg-secondary/20 cursor-pointer transition-colors border-l-2 border-transparent rounded-r-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-3.5 w-3.5" /> Financials & Billing
            </p>
          </div>
          <div className="p-4 hover:bg-secondary/20 cursor-pointer transition-colors border-l-2 border-transparent">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" /> Security & Access
            </p>
          </div>
          <div className="p-4 hover:bg-secondary/20 cursor-pointer transition-colors border-l-2 border-transparent rounded-r-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Bell className="h-3.5 w-3.5" /> Notification Rules
            </p>
          </div>
          <div className="p-4 hover:bg-secondary/20 cursor-pointer transition-colors border-l-2 border-transparent">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Globe className="h-3.5 w-3.5" /> Channel Manager
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Property Information</CardTitle>
              <CardDescription className="text-xs uppercase tracking-widest mt-1">Primary details for the hotel listing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Hotel Name</Label>
                  <Input className="rounded-xl h-11" defaultValue="Larosa Luxury Suites" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Primary Contact Email</Label>
                  <Input className="rounded-xl h-11" defaultValue="concierge@larosa.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest">Physical Address</Label>
                <Textarea className="rounded-xl resize-none h-20" defaultValue="128 Elite District, Silk Road, Marina Bay, 90210" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Check-in Time</Label>
                  <Input className="rounded-xl h-11" defaultValue="14:00" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Check-out Time</Label>
                  <Input className="rounded-xl h-11" defaultValue="11:00" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">General Preferences</CardTitle>
              <CardDescription className="text-xs uppercase tracking-widest mt-1">Operational behavior across the terminal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest">Instant Booking</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Allow guests to confirm without manual approval</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest">Automatic Invoicing</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Send PDF receipts immediately upon payment</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest">Maintenance Mode</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Show maintenance flag for specific inventory groups</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
