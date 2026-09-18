import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getI18nFromCookies } from "@/lib/i18n/server";

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

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hotelsin.vercel.app').replace(/\/$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HotelsIn — A Quieter Way to Arrive",
    template: "%s | HotelsIn",
  },
  description: "A private sanctuary shaped by architecture, nature and time. Experience luxury hospitality at HotelsIn, Ubud Bali.",
  keywords: ["luxury hotel", "boutique hotel", "resort", "spa", "fine dining", "wellness", "travel", "hotel ubud", "villa bali"],
  authors: [{ name: "HotelsIn" }],
  creator: "HotelsIn",
  publisher: "HotelsIn",
  robots: "index, follow",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
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

const HOTEL_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: 'HotelsIn',
  description: 'A private sanctuary shaped by architecture, nature and time. Twenty villas in Ubud, Bali.',
  url: SITE_URL,
  telephone: '+62 361 975 888',
  email: 'reservations@hotelsin.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jalan Raya Ubud No. 88, Sayan',
    addressLocality: 'Ubud',
    addressRegion: 'Gianyar, Bali',
    postalCode: '80571',
    addressCountry: 'ID',
  },
  geo: { '@type': 'GeoCoordinates', latitude: -8.5069, longitude: 115.2625 },
  priceRange: '$$$',
  checkinTime: '15:00',
  checkoutTime: '11:00',
  acceptsReservations: true,
  currenciesAccepted: 'USD, IDR',
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, currency } = await getI18nFromCookies()
  return (
    <html lang={locale} className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOTEL_JSON_LD) }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers initialLocale={locale} initialCurrency={currency}>{children}</Providers>
      </body>
    </html>
  );
}
