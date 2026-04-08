"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Star } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-background pt-20">

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=1920&q=80"
            alt="La Rosa Hotel Concierge"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-background/60 dark:bg-background/70" />
        </div>
        <div className="relative z-10 text-center pb-14 px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-primary uppercase tracking-[0.35em] text-xs mb-4">We're Here For You</p>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight">
              Contact <span className="italic text-primary/90">Us</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-border">

            {/* Info Column */}
            <div className="lg:col-span-1 bg-card border-b lg:border-b-0 lg:border-r border-border p-10 space-y-10">
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-8">Reach Us</h2>
                <div className="space-y-7">
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 border border-primary/40 flex items-center justify-center flex-shrink-0">
                      <MapPin size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">Address</p>
                      <p className="text-foreground text-sm leading-relaxed">123 Luxury Avenue<br />Beverly Hills, CA 90210<br />United States</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 border border-primary/40 flex items-center justify-center flex-shrink-0">
                      <Phone size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">Reservations</p>
                      <p className="text-foreground text-sm">+1 (800) LA-ROSA-1</p>
                      <p className="text-muted-foreground text-xs mt-1">Toll-free, US & Canada</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 border border-primary/40 flex items-center justify-center flex-shrink-0">
                      <Mail size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">Email</p>
                      <p className="text-foreground text-sm">concierge@larosahotel.com</p>
                      <p className="text-foreground text-sm">reservations@larosahotel.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 border border-primary/40 flex items-center justify-center flex-shrink-0">
                      <Clock size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">Hours</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex gap-4">
                          <span className="text-muted-foreground w-24">Mon – Fri</span>
                          <span className="text-foreground">7 AM – 10 PM</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-muted-foreground w-24">Sat – Sun</span>
                          <span className="text-foreground">8 AM – 9 PM</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-muted-foreground w-24">Emergencies</span>
                          <span className="text-primary">24 / 7</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">Follow Us</p>
                <div className="flex gap-4">
                  {["Instagram", "Facebook", "Twitter"].map(s => (
                    <a key={s} href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-2 p-10 bg-background">
              {sent ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center gap-5">
                  <div className="w-16 h-16 border border-primary flex items-center justify-center">
                    <Star size={24} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground">Message Received</h3>
                  <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                    Thank you for reaching out to La Rosa. Our concierge team will be in touch within 2–4 hours. For urgent matters, please call us directly.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 rounded-none font-serif tracking-widest border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setSent(false)}
                  >
                    SEND ANOTHER
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7">
                  <h2 className="font-serif text-2xl text-foreground mb-2">Send a Message</h2>
                  <p className="text-muted-foreground text-sm mb-8">Our team responds within 2–4 business hours. For immediate assistance, please call our concierge line.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                    <div className="space-y-2">
                      <label className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Full Name *</label>
                      <Input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name"
                        className="rounded-none bg-transparent border-border focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Email Address *</label>
                      <Input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="rounded-none bg-transparent border-border focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                    <div className="space-y-2">
                      <label className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Phone</label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+1 (000) 000-0000"
                        className="rounded-none bg-transparent border-border focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Subject *</label>
                      <Select value={form.subject} onValueChange={v => setForm(f => ({ ...f, subject: v }))}>
                        <SelectTrigger className="rounded-none bg-transparent border-border">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reservation">Reservation Enquiry</SelectItem>
                          <SelectItem value="villa">Villa Booking</SelectItem>
                          <SelectItem value="event">Private Event</SelectItem>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="corporate">Corporate Stay</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Message *</label>
                    <Textarea
                      required
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="How may we assist you? Please share any details about your visit, special requirements, or questions..."
                      className="rounded-none bg-transparent border-border focus-visible:ring-primary resize-none min-h-40"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-13 font-serif tracking-widest rounded-none bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-4"
                  >
                    SEND YOUR MESSAGE
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-card border-t border-border">
        <div className="relative h-64 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=60"
            alt="Beverly Hills location"
            fill
            className="object-cover opacity-60 dark:opacity-40"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-background/90 px-8 py-6 border border-border">
              <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-1">Find Us At</p>
              <p className="font-serif text-xl text-foreground">123 Luxury Avenue, Beverly Hills</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs text-primary tracking-widest uppercase hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
