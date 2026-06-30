"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Shield, Globe, Bell, CreditCard, Hotel, Key, Smartphone, Mail, Cloud, Wallet, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type SettingsTab = "property" | "billing" | "security" | "notifications" | "channel";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("property");

  const navItems = [
    { id: "property", label: "Property Profile", icon: Hotel },
    { id: "billing", label: "Financials & Billing", icon: CreditCard },
    { id: "security", label: "Security & Access", icon: Shield },
    { id: "notifications", label: "Notification Rules", icon: Bell },
    { id: "channel", label: "Channel Manager", icon: Globe },
  ] as const;

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
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full p-4 flex items-center gap-3 transition-all duration-300 text-left border-l-2 rounded-r-xl",
                activeTab === item.id 
                  ? "bg-primary/5 border-primary text-primary" 
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-secondary/10"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === "property" && (
              <motion.div
                key="property"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Property Information</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest mt-1">Primary details for the hotel listing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Hotel Name</Label>
                        <Input className="rounded-xl h-11 bg-secondary/5" defaultValue="Larosa Luxury Suites" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Primary Contact Email</Label>
                        <Input className="rounded-xl h-11 bg-secondary/5" defaultValue="concierge@larosa.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">Physical Address</Label>
                      <Textarea className="rounded-xl resize-none h-20 bg-secondary/5" defaultValue="128 Elite District, Silk Road, Marina Bay, 90210" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Check-in Time</Label>
                        <Input className="rounded-xl h-11 bg-secondary/5" defaultValue="14:00" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Check-out Time</Label>
                        <Input className="rounded-xl h-11 bg-secondary/5" defaultValue="11:00" />
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
                    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-secondary/5">
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest">Instant Booking</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Allow guests to confirm without manual approval</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-secondary/5">
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest">Automatic Invoicing</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Send PDF receipts immediately upon payment</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Payment Gateways</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest mt-1">Manage transactional accounts and fees</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 border border-border rounded-xl bg-secondary/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-brand-gold/10 rounded-lg flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest">Razorpay Integration</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status: Connected (Live Mode)</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-widest rounded-lg">Configure</Button>
                      </div>
                      <div className="border-t border-border/40 pt-3 space-y-2">
                        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Razorpay Webhook URL</Label>
                        <div className="flex gap-2">
                          <Input 
                            readOnly 
                            value={typeof window !== "undefined" ? `${window.location.origin}/api/payments/webhook` : ""} 
                            className="h-9 text-xs font-mono rounded-lg bg-secondary/10 border-border/50 flex-1" 
                          />
                          <Button 
                            type="button"
                            variant="secondary" 
                            size="sm" 
                            className="h-9 text-[9px] font-bold uppercase tracking-widest rounded-lg"
                            onClick={() => {
                              if (typeof window !== "undefined") {
                                navigator.clipboard.writeText(`${window.location.origin}/api/payments/webhook`);
                                alert("Webhook URL copied to clipboard!");
                              }
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Configure this in your Razorpay Dashboard with events: order.paid, payment.captured</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Currency Code</Label>
                        <Input className="rounded-xl h-11 bg-secondary/5" defaultValue="INR (₹)" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Tax Percentage (GST)</Label>
                        <Input className="rounded-xl h-11 bg-secondary/5" defaultValue="12%" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Access Control</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest mt-1">System security and administrative permissions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-secondary/5">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-4 w-4 text-primary" />
                          <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-widest">Two-Factor Authentication</p>
                            <p className="text-[10px] text-muted-foreground">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-secondary/5">
                        <div className="flex items-center gap-3">
                          <Key className="h-4 w-4 text-primary" />
                          <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-widest">Session Timeout</p>
                            <p className="text-[10px] text-muted-foreground">Automatically log out after 30 minutes of inactivity</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Communication Rules</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest mt-1">Automated emails and system alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-secondary/5">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">Booking Confirmations</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-secondary/5">
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">Cancellation Alerts</span>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest">MSG91 Integration</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">SMS & WhatsApp Notifications</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest">MSG91 Auth Key</Label>
                          <Input type="password" title="Auth Key" className="rounded-xl h-11 bg-secondary/5" placeholder="Enter MSG91 Auth Key" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest">MSG91 Flow ID</Label>
                          <Input className="rounded-xl h-11 bg-secondary/5" placeholder="Enter Flow ID" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Admin Notification Number</Label>
                        <Input className="rounded-xl h-11 bg-secondary/5" placeholder="e.g. 919876543210" />
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Must include country code without "+" (e.g., 91 for India)</p>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-primary/5 border-primary/20">
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-widest">Instant WhatsApp Alerts</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Send booking summary to admin via WhatsApp</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "channel" && (
              <motion.div
                key="channel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Inventory Distribution</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest mt-1">Sync rooms with OTAs and external engines</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Cloud className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Channel Manager Coming Soon</p>
                    <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">Direct API connections with Booking.com and Expedia</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
