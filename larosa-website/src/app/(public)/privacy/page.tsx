"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, ShieldCheck, Mail, Database } from "lucide-react";
import { SITE_EMAIL } from "@/lib/contact-info";

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-zinc-800">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#1d2b40] via-[#121c2c] to-[#0a0f18] text-white overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: "32px 32px"
          }}
        />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              Information & Consent
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide">
              Privacy Policy
            </h1>
            <p className="text-zinc-400 font-light text-sm max-w-xl mx-auto uppercase tracking-widest">
              Last Updated: July 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="bg-white rounded-3xl border border-zinc-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-8 md:p-12 space-y-12"
          >
            <div className="prose prose-zinc max-w-none font-light leading-relaxed text-zinc-600">
              <p className="text-lg text-zinc-500 font-serif italic mb-8">
                At LaRosa Sanctuary, your privacy is paramount. This Privacy Policy details how we collect, store, utilize, and safeguard the personal information you provide when using our website, making reservations, or opting in for promotional updates.
              </p>

              {/* Section 1 */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-zinc-900 font-medium flex items-center gap-3 border-b border-zinc-100 pb-3">
                  <Eye className="h-5 w-5 text-amber-600" />
                  1. Information We Collect
                </h2>
                <div className="space-y-3 text-sm">
                  <p>We receive and collect information you provide directly to us through account creation, booking inquiries, or registration flows, including:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Personal Identity:</strong> Your full name, email address, password, contact number, and billing/payment preferences.</li>
                    <li><strong>Booking Context:</strong> Number of guests, dates of stay, special requests, and room preferences.</li>
                    <li><strong>Marketing Preferences:</strong> Your explicit consent choices regarding promotional updates, newsletters, and special collection offers.</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-4 pt-4">
                <h2 className="font-serif text-2xl text-zinc-900 font-medium flex items-center gap-3 border-b border-zinc-100 pb-3">
                  <Database className="h-5 w-5 text-amber-600" />
                  2. How We Use Your Information
                </h2>
                <div className="space-y-3 text-sm">
                  <p>Your information is used strictly to enhance your experience at LaRosa, specifically for:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Reservation Management:</strong> Processing bookings, verifying identity, and coordinating your check-in and stay rules.</li>
                    <li><strong>Billing & Transactions:</strong> Securely processing payments and deposits.</li>
                    <li><strong>Marketing Communications:</strong> With your explicit consent, we may send email newsletters or special promotional offers about LaRosa Sanctuary. You may unsubscribe or withdraw marketing consent at any time via your account settings or link in the emails.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-4 pt-4">
                <h2 className="font-serif text-2xl text-zinc-900 font-medium flex items-center gap-3 border-b border-zinc-100 pb-3">
                  <ShieldCheck className="h-5 w-5 text-amber-600" />
                  3. Security & Third-Party Sharing
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Data Safeguards:</strong> We employ commercial-grade security protocols (encryption, firewalls, secure databases) to protect your credentials and personal details against unauthorized access.</li>
                  <li><strong>Third-Party Processors:</strong> We partner with trusted third-party services (such as secure payment gateway solutions) to handle bookings. These partners are legally bound to protect your information and cannot use it for other purposes.</li>
                  <li><strong>No Spam/Sale of Data:</strong> We never sell, lease, or distribute your email address, name, or stay history to outside marketing platforms.</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="space-y-4 pt-4">
                <h2 className="font-serif text-2xl text-zinc-900 font-medium flex items-center gap-3 border-b border-zinc-100 pb-3">
                  <Mail className="h-5 w-5 text-amber-600" />
                  4. Your Rights & Contacts
                </h2>
                <p className="text-sm">
                  You have the right to request access to, correct, or delete any of your personal information collected by us. If you wish to close your account or have any inquiries regarding data protection policies, please contact our support team at <a href={`mailto:${SITE_EMAIL}`} className="text-amber-700 underline font-medium hover:text-amber-800 transition-colors">{SITE_EMAIL}</a>.
                </p>
              </div>
            </div>
            
            <div className="border-t border-zinc-100 pt-8 text-center text-xs text-zinc-400 font-light">
              By utilizing the LaRosa site or registering, you acknowledge and agree to this Privacy Policy.
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
