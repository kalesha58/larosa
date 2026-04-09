"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

const SCRIPT_ID = "razorpay-checkout-js";
const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export function useRazorpayScript(): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.Razorpay) {
      setLoaded(true);
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as
      | HTMLScriptElement
      | null;
    if (existing) {
      if (existing.dataset.loaded === "1") {
        setLoaded(true);
        return;
      }
      existing.addEventListener("load", () => {
        existing.dataset.loaded = "1";
        setLoaded(true);
      });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "1";
      setLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  return loaded;
}
