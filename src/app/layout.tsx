import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HotelsIn — A Quieter Way to Arrive",
    template: "%s | HotelsIn",
  },
  description: "A private sanctuary shaped by architecture, nature and time. Experience luxury hospitality at HotelsIn.",
  keywords: ["luxury hotel", "boutique hotel", "resort", "spa", "fine dining", "wellness", "travel"],
  authors: [{ name: "HotelsIn" }],
  creator: "HotelsIn",
  publisher: "HotelsIn",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hotelsin.com",
    siteName: "HotelsIn",
    title: "HotelsIn — A Quieter Way to Arrive",
    description: "A private sanctuary shaped by architecture, nature and time.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "HotelsIn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HotelsIn — A Quieter Way to Arrive",
    description: "A private sanctuary shaped by architecture, nature and time.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
