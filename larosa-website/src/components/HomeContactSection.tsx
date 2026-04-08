"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.45, 0.32, 0.9] as const },
  },
};

export function HomeContactSection() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSent, setContactSent] = useState(false);

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactSent(true);
    setContactForm({ name: "", email: "", message: "" });
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border/60 bg-background py-16 sm:py-20 md:py-28 lg:py-36"
      aria-labelledby="contact-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(var(--primary)/0.09),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-px w-[min(100%,64rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden
      />

      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 text-center sm:mb-14 lg:mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <motion.div
            variants={item}
            className="mb-4 flex justify-center sm:mb-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:px-4 sm:py-2 sm:text-[11px]">
              <MessageCircle className="h-3.5 w-3.5 shrink-0 opacity-85" aria-hidden />
              We&apos;re Here for You
            </span>
          </motion.div>
          <motion.h2
            id="contact-heading"
            variants={item}
            className="font-serif text-[2rem] leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.5rem]"
          >
            Get in{" "}
            <span className="bg-gradient-to-r from-primary via-primary/85 to-primary/60 bg-clip-text text-transparent">
              Touch
            </span>
          </motion.h2>
          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg lg:text-xl"
          >
            Whether you have a special request, wish to arrange a bespoke
            experience, or simply need assistance — our team is always at your
            service.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className={cn(
              "flex flex-col gap-10 rounded-2xl border border-border/50 bg-card/60 p-8 shadow-lg backdrop-blur-sm sm:rounded-3xl sm:p-10 lg:p-12",
              "dark:bg-card/40"
            )}
          >
            <div>
              <h3 className="font-serif text-xl text-foreground sm:text-2xl">
                Contact details
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Reach the concierge directly — we respond within hours.
              </p>
              <div className="mt-8 space-y-6 sm:space-y-7">
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/5">
                    <MapPin size={18} className="text-primary" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                      Address
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground sm:text-[15px]">
                      123 Luxury Avenue
                      <br />
                      Beverly Hills, CA 90210, USA
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/5">
                    <Phone size={18} className="text-primary" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                      Phone
                    </p>
                    <p className="mt-1 text-sm text-foreground sm:text-[15px]">
                      +1 (800) LA-ROSA-1
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/5">
                    <Mail size={18} className="text-primary" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                      Email
                    </p>
                    <a
                      href="mailto:concierge@larosahotel.com"
                      className="mt-1 block text-sm text-foreground underline-offset-4 hover:underline sm:text-[15px]"
                    >
                      concierge@larosahotel.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto rounded-2xl border border-border/40 bg-muted/30 p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                Concierge hours
              </p>
              <div className="mt-4 space-y-3 text-sm text-foreground">
                <div className="flex flex-col justify-between gap-1 border-b border-border/50 pb-3 sm:flex-row sm:items-center">
                  <span className="text-muted-foreground">Monday – Friday</span>
                  <span className="font-medium tabular-nums">7:00 AM – 10:00 PM</span>
                </div>
                <div className="flex flex-col justify-between gap-1 border-b border-border/50 pb-3 sm:flex-row sm:items-center">
                  <span className="text-muted-foreground">Saturday – Sunday</span>
                  <span className="font-medium tabular-nums">8:00 AM – 9:00 PM</span>
                </div>
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <span className="text-muted-foreground">Emergency line</span>
                  <span className="font-medium text-primary tabular-nums">24 / 7</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className={cn(
              "rounded-2xl border border-border/50 bg-card/40 p-8 shadow-lg backdrop-blur-sm sm:rounded-3xl sm:p-10 lg:p-12",
              "dark:bg-card/30"
            )}
          >
            {contactSent ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 text-center sm:min-h-[380px]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10">
                  <Star className="h-8 w-8 text-primary" aria-hidden />
                </div>
                <h3 className="font-serif text-2xl text-foreground sm:text-3xl">
                  Message received
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Thank you for reaching out. Our concierge team will respond to
                  you within 2–4 hours.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 rounded-full border-primary/40 px-8 font-serif text-xs tracking-[0.18em]"
                  onClick={() => setContactSent(false)}
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl text-foreground sm:text-2xl">
                    Send a message
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Share your dates, occasion, or questions — we&apos;ll handle the rest.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="home-contact-name"
                      className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs"
                    >
                      Full name
                    </label>
                    <Input
                      id="home-contact-name"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Your name"
                      className="h-12 rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary sm:h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="home-contact-email"
                      className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs"
                    >
                      Email
                    </label>
                    <Input
                      id="home-contact-email"
                      required
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="your@email.com"
                      className="h-12 rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary sm:h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="home-contact-message"
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs"
                  >
                    Message
                  </label>
                  <Textarea
                    id="home-contact-message"
                    required
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="How may we assist you?"
                    className="min-h-36 resize-none rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 w-full rounded-xl font-serif text-xs tracking-[0.2em] sm:h-14 sm:text-sm"
                >
                  Send message
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Button>
                <p className="text-center text-[11px] text-muted-foreground sm:text-xs">
                  Prefer the phone?{" "}
                  <Link
                    href="/contact"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Visit our contact page
                  </Link>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
