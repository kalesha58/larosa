"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { DateRange } from "react-day-picker";
import { Mail, Star } from "lucide-react";
import {
  PreferredStayDatesField,
  stayRangeToPayload,
} from "@/components/contact/PreferredStayDatesField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { SITE_EMAIL } from "@/lib/contact-info";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] as const 
    },
  },
};

export function HomeContactSection() {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSent, setContactSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stayRange, setStayRange] = useState<DateRange | undefined>();

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          ...stayRangeToPayload(stayRange),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Message not sent",
          description:
            data.error ??
            "Something went wrong. Please try again or email us directly.",
        });
        return;
      }
      setContactSent(true);
      setContactForm({ name: "", email: "", message: "" });
      setStayRange(undefined);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-16 sm:py-24 bg-background"
      aria-labelledby="contact-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                Get in Touch
              </span>
              <h2
                id="contact-heading"
                className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground"
              >
                Let Us <br />
                <span className="italic text-primary/90">Welcome You</span>
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Whether you have a specific request or simply wish to learn more 
                about the Larosa experience, our team is at your service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group flex items-center gap-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/10 bg-primary/5 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                <Mail size={20} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  Email Us
                </p>
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="text-base font-medium text-foreground transition-colors group-hover:text-primary"
                >
                  {SITE_EMAIL}
                </a>
              </div>
            </motion.div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 sm:p-12 rounded-[3rem] bg-card/40 border border-border/50 backdrop-blur-xl shadow-2xl"
            >
              {contactSent ? (
                <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Star size={40} />
                  </div>
                  <h3 className="font-serif text-3xl">Inquiry Received</h3>
                  <p className="text-muted-foreground font-light max-w-xs">
                    Our concierge team will respond within 2–4 hours.
                  </p>
                  <Button onClick={() => setContactSent(false)} variant="outline" className="rounded-full">
                    Send another inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                      <input 
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))}
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-transparent border-b border-border/50 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/30 font-light"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={contactForm.email}
                        onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="w-full bg-transparent border-b border-border/50 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/30 font-light"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Your Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="How can we assist you?"
                      className="w-full bg-transparent border-b border-border/50 py-4 focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/30 font-light resize-none"
                    />
                  </div>

                  <Button disabled={isSubmitting} className="w-full h-16 rounded-full font-serif text-sm tracking-[0.2em] shadow-xl shadow-primary/20">
                    {isSubmitting ? "SENDING..." : "SEND INQUIRY"}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
