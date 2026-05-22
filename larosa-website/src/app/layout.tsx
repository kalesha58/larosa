import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { getSiteUrl, OG_VILLA_IMAGE_PATH } from "@/lib/site-url";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const siteTitle = "La Rosa | Private Villa Sanctuary";
const siteDescription =
  "Experience quiet opulence at La Rosa — private villas with pools and ocean views. An unhurried sanctuary designed exclusively for you.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteTitle,
    template: "%s | La Rosa",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "La Rosa",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: OG_VILLA_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "La Rosa private villa with plunge pool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [OG_VILLA_IMAGE_PATH],
  },
  icons: {
    icon: [{ url: "/Brand.jpeg", type: "image/jpeg" }],
    apple: [{ url: "/Brand.jpeg", type: "image/jpeg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
