"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, FileText, ShieldAlert, BadgeCheck, HelpCircle } from "lucide-react";

export default function TermsPage() {
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
              Standard Policies
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide">
              Terms & Conditions
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
                Welcome to LaRosa Sanctuary. By accessing our services, creating an account, or confirming a booking, you agree to comply with and be bound by the following terms, policies, and standard house rules.
              </p>

              {/* Section 1 */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-zinc-900 font-medium flex items-center gap-3 border-b border-zinc-100 pb-3">
                  <FileText className="h-5 w-5 text-amber-600" />
                  1. Stay & Check-In Details
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Check-in Time:</strong> 2:00 PM. Please present a valid government-issued photo ID upon check-in.</li>
                  <li><strong>Check-out Time:</strong> 11:00 AM. Late check-out is subject to availability and a 15-minute grace period. Beyond this, hourly late fees apply.</li>
                  <li><strong>Early Access:</strong> Requests for early check-in or extended checkout must be arranged at least 24 hours in advance and are subject to confirmation and extra charges.</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="space-y-4 pt-4">
                <h2 className="font-serif text-2xl text-zinc-900 font-medium flex items-center gap-3 border-b border-zinc-100 pb-3">
                  <BadgeCheck className="h-5 w-5 text-amber-600" />
                  2. Booking & Payment Terms
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Booking Deposit:</strong> A reservation is only confirmed once the deposit or full reservation amount is successfully paid.</li>
                  <li><strong>Cancellation Policy:</strong> The booking deposit collected at the time of reservation is strictly non-refundable and non-transferable in the event of cancellation, date modifications, or no-shows.</li>
                  <li><strong>Final Settlement:</strong> The outstanding balance for your reservation must be cleared in full before or at the time of check-in. Access to the villa is denied until payment is complete.</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="space-y-4 pt-4">
                <h2 className="font-serif text-2xl text-zinc-900 font-medium flex items-center gap-3 border-b border-zinc-100 pb-3">
                  <ShieldAlert className="h-5 w-5 text-amber-600" />
                  3. House Rules & Safety Policies
                </h2>
                <div className="space-y-3 text-sm">
                  <p>To preserve the pristine comfort of LaRosa Sanctuary, guests are required to adhere to the following rules:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Smoking:</strong> Strictly prohibited inside all indoor areas and villa suites. Designated outdoor smoking zones are available. A deep-cleaning fee will be charged for violations.</li>
                    <li><strong>Narcotics & Illegal Substances:</strong> Strictly forbidden on the premises. Violation will result in immediate termination of the stay without refund and local authorities will be notified.</li>
                    <li><strong>Occupancy:</strong> Only registered guests are allowed on the property. Unregistered visitors or exceeding the approved guest count will incur penalty charges per person or cancellation of the stay.</li>
                    <li><strong>Pool Safety:</strong> Use of private pools is at your own risk. No lifeguard is on duty. Food and glassware are strictly prohibited inside or near the pool perimeter.</li>
                    <li><strong>Restricted Items:</strong> Outdoor party speakers, professional lighting rigs, gas burners, or external cooking appliances require prior management approval.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="space-y-4 pt-4">
                <h2 className="font-serif text-2xl text-zinc-900 font-medium flex items-center gap-3 border-b border-zinc-100 pb-3">
                  <HelpCircle className="h-5 w-5 text-amber-600" />
                  4. Damages, Liability & Indemnity
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Guest Responsibility:</strong> Guests are liable for any damages to the building structures, furniture, fittings, items, or landscaping during their tenure. The security deposit will be adjusted accordingly, and excess damage costs will be billed.</li>
                  <li><strong>Valuables:</strong> LaRosa is not liable for any lost, stolen, or damaged personal valuables, cash, or baggage. Safe storage boxes are provided in each suite for your convenience.</li>
                  <li><strong>Force Majeure:</strong> LaRosa shall not be held liable for failure to provide services due to unexpected acts of God, strikes, utility failures, government regulations, or natural events.</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-zinc-100 pt-8 text-center text-xs text-zinc-400 font-light">
              By confirming your account or reservation, you acknowledge you have read, understood, and agreed to all of the terms above. For any queries, please reach out to our concierge.
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
