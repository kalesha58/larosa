"use client"

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { motion, useScroll, useTransform } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  PreferredStayDatesField,
  stayRangeToPayload,
} from "@/components/contact/PreferredStayDatesField";
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
import { ArrowRight, Clock, Instagram, Mail, Star, Sparkles } from "lucide-react";
import { SITE_EMAIL, SITE_INSTAGRAM_URL } from "@/lib/contact-info";
import Image from "next/image";
import { CONTACT_SUBJECT_PROPERTY } from "@/lib/larosa-collection";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const fieldLabel =
  "text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground ml-0.5";

const fieldInput = cn(
  "w-full border-0 border-b border-border/60 bg-transparent px-0 py-3.5",
  "text-sm font-light text-foreground shadow-none",
  "placeholder:text-muted-foreground/35",
  "focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
);

const VALID_CONTACT_SUBJECTS = [
  "reservation",
  "villa",
  "event",
  "wedding",
  "corporate",
  "feedback",
  CONTACT_SUBJECT_PROPERTY,
  "other",
] as const;

type ContactSubject = (typeof VALID_CONTACT_SUBJECTS)[number];

function isContactSubject(value: string | null): value is ContactSubject {
  return (
    value !== null &&
    (VALID_CONTACT_SUBJECTS as readonly string[]).includes(value)
  );
}

function ContactPageContent() {
  const searchParams = useSearchParams();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.85]);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stayRange, setStayRange] = useState<DateRange | undefined>();

  useEffect(() => {
    const subjectParam = searchParams.get("subject");
    if (isContactSubject(subjectParam)) {
      setForm((f) => ({ ...f, subject: subjectParam }));
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject) {
      toast({
        variant: "destructive",
        title: "Subject required",
        description: "Please select a subject so we can route your message.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject,
          message: form.message,
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
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setStayRange(undefined);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">

      {/* Hero */}
      <section className="relative flex min-h-[62vh] items-center justify-center overflow-hidden pt-20 sm:min-h-[68vh] lg:min-h-[72vh]">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image
            src="/Hero3.jpeg"
            alt="LaRosa Villas — concierge"
            fill
            className="object-cover object-center scale-105 saturate-[1.05]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,transparent_0%,rgba(0,0,0,0.35)_100%)]" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="container relative z-10 mx-auto px-4 sm:px-6"
        >
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white shadow-lg backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
                We&apos;re Here For You
              </span>
              <h1 className="font-serif text-5xl leading-[0.95] text-white drop-shadow-2xl sm:text-6xl md:text-7xl lg:text-8xl">
                Contact{" "}
                <span className="italic font-light text-white/90">Us</span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-base font-light leading-relaxed text-white/75 sm:text-lg">
                Our concierge team is ready to help with reservations, private events,
                and anything you need for your stay.
              </p>
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white/90 backdrop-blur-md transition-colors hover:border-primary/50 hover:bg-white/15 hover:text-white"
              >
                <Mail className="h-4 w-4 text-primary" aria-hidden />
                {SITE_EMAIL}
              </a>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
          aria-hidden
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/45">
            Send a message
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-primary/80 to-transparent" />
        </motion.div>
      </section>

      {/* Contact */}
      <section className="relative z-20 -mt-8 overflow-hidden rounded-t-[2.5rem] bg-background py-20 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,hsl(var(--primary)/0.06),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-primary/[0.04] blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mb-12 max-w-2xl sm:mb-14"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Concierge
            </span>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
              We&apos;re at your{" "}
              <span className="italic text-primary/90">service</span>
            </h2>
            <p className="mt-4 text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
              Share your enquiry below — our team typically responds within 2–4 business hours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Info panel */}
            <motion.aside
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.9, ease: EASE }}
              className="relative overflow-hidden rounded-[2rem] bg-zinc-950 p-8 text-white shadow-[0_32px_80px_-24px_rgba(0,0,0,0.35)] sm:p-10 lg:col-span-4 lg:rounded-[2.5rem] lg:p-12"
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl"
                aria-hidden
              />

              <div className="relative space-y-10">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70 backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 text-primary" aria-hidden />
                    Reach us
                  </span>
                  <p className="mt-6 font-serif text-2xl leading-snug text-white/95 sm:text-3xl">
                    Personal concierge,{" "}
                    <span className="italic font-light text-white/80">always on</span>
                  </p>
                </div>

                <div className="space-y-5">
                  <a
                    href={`mailto:${SITE_EMAIL}`}
                    className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-primary/40 hover:bg-white/[0.08]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Mail className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/45">
                        Email
                      </p>
                      <p className="mt-1 break-all text-sm font-medium text-white group-hover:text-primary transition-colors sm:text-[15px]">
                        {SITE_EMAIL}
                      </p>
                    </div>
                  </a>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-primary">
                        <Clock className="h-[18px] w-[18px]" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/45">
                          Response hours
                        </p>
                        <ul className="mt-3 space-y-2.5 text-sm">
                          <li className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5">
                            <span className="text-white/50">Mon – Fri</span>
                            <span className="font-medium text-white/90">7 AM – 10 PM</span>
                          </li>
                          <li className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5">
                            <span className="text-white/50">Sat – Sun</span>
                            <span className="font-medium text-white/90">8 AM – 9 PM</span>
                          </li>
                          <li className="flex items-center justify-between gap-4">
                            <span className="text-white/50">Urgent</span>
                            <span className="font-medium text-primary">24 / 7</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-8">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/45">
                    Follow us
                  </p>
                  <a
                    href={SITE_INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/85 transition-colors hover:border-primary/50 hover:bg-white/10 hover:text-white"
                  >
                    <Instagram className="h-4 w-4 text-primary" aria-hidden />
                    @larosa_villas
                  </a>
                </div>
              </div>
            </motion.aside>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}
              className="lg:col-span-8"
            >
              <div className="rounded-[2rem] border border-border/50 bg-card/50 p-8 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-10 lg:p-12">
                {sent ? (
                  <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 px-4 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Star className="h-9 w-9" strokeWidth={1.25} />
                    </div>
                    <h3 className="font-serif text-3xl text-foreground">Message received</h3>
                    <p className="max-w-md text-sm font-light leading-relaxed text-muted-foreground">
                      Thank you for reaching out. Our concierge team will be in touch within 2–4
                      hours. For urgent matters, email{" "}
                      <a
                        href={`mailto:${SITE_EMAIL}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {SITE_EMAIL}
                      </a>
                      .
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 rounded-full border-primary/30 px-8 font-serif tracking-wide text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setSent(false)}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="border-b border-border/40 pb-8">
                      <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                        Send a message
                      </h2>
                      <p className="mt-2 max-w-lg text-sm font-light leading-relaxed text-muted-foreground">
                        Tell us about your stay, event, or question — we&apos;ll route your enquiry
                        to the right team member.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <div className="space-y-2.5">
                        <label htmlFor="contact-name" className={fieldLabel}>
                          Full name *
                        </label>
                        <Input
                          id="contact-name"
                          required
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="Your full name"
                          className={fieldInput}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label htmlFor="contact-email" className={fieldLabel}>
                          Email address *
                        </label>
                        <Input
                          id="contact-email"
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          placeholder="your@email.com"
                          className={fieldInput}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <div className="space-y-2.5">
                        <label htmlFor="contact-phone" className={fieldLabel}>
                          Phone <span className="font-normal normal-case tracking-normal text-muted-foreground/70">(optional)</span>
                        </label>
                        <Input
                          id="contact-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                          placeholder="+91 …"
                          className={fieldInput}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className={fieldLabel}>Subject *</label>
                        <Select
                          value={form.subject}
                          onValueChange={(v) => setForm((f) => ({ ...f, subject: v }))}
                        >
                          <SelectTrigger
                            className={cn(
                              fieldInput,
                              "h-auto justify-between px-0 data-[placeholder]:text-muted-foreground/35"
                            )}
                          >
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reservation">Reservation enquiry</SelectItem>
                            <SelectItem value="villa">Villa booking</SelectItem>
                            <SelectItem value="event">Private event</SelectItem>
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="corporate">Corporate stay</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="property">Property partnership</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <PreferredStayDatesField
                      fieldId="contact-preferred-stay"
                      value={stayRange}
                      onChange={setStayRange}
                      labelClassName={fieldLabel}
                      triggerClassName={cn(
                        fieldInput,
                        "h-auto justify-start px-0 data-[placeholder]:text-muted-foreground/35"
                      )}
                      description="Optional — we’ll include your preferred dates in the enquiry."
                      numberOfMonths={2}
                    />

                    <div className="space-y-2.5">
                      <label htmlFor="contact-message" className={fieldLabel}>
                        Message *
                      </label>
                      <Textarea
                        id="contact-message"
                        required
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        placeholder="How may we assist you? Share visit details, special requirements, or questions…"
                        className={cn(
                          fieldInput,
                          "min-h-[140px] resize-none rounded-none py-3"
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="group h-14 w-full rounded-full font-serif text-xs tracking-[0.2em] shadow-lg shadow-primary/20 sm:text-sm"
                    >
                      {isSubmitting ? (
                        "Sending…"
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          Send your message
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background pt-20" />}>
      <ContactPageContent />
    </Suspense>
  );
}
