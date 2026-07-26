import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ChatWidget from "@/components/ui/ChatWidget";
import { LanguageProvider } from "@/config/i18n";
import { ThemeProvider } from "@/config/theme";
import { ToastProvider } from "@/components/ui/NotificationToast";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Cargo Services in Dubai & UAE | Air, Sea & Land Freight — Shebo Cargo & Logistics",
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Cargo & shipping services in Dubai & across the UAE — air, sea & land freight, movers & packers, car shipping, GCC trailer transport & warehouse storage. Door-to-door, worldwide. شركة شحن في دبي والإمارات.",
  applicationName: siteConfig.name,
  keywords: [
    // English — services + location
    "cargo services Dubai",
    "cargo company UAE",
    "shipping company Dubai",
    "freight forwarding Dubai",
    "air cargo UAE",
    "sea cargo Dubai",
    "land cargo GCC",
    "movers and packers Dubai",
    "car shipping UAE",
    "trailer transport GCC",
    "warehouse storage Dubai",
    "cargo to Egypt",
    "cargo to Iraq",
    "door to door cargo",
    "Abu Dhabi",
    "Sharjah",
    "Jebel Ali",
    // Arabic — services + location
    "شركة شحن دبي",
    "خدمات شحن الإمارات",
    "شركة شحن في دبي",
    "شحن جوي دبي",
    "شحن بحري",
    "شحن بري",
    "نقل عفش دبي",
    "شحن سيارات",
    "شحن من دبي إلى",
    "شركة لوجستية دبي",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ar: "/",
      "x-default": "/",
    },
  },
  other: {
    "geo.region": "AE-DU",
    "geo.placename": "Dubai, United Arab Emirates",
    "geo.position": `${siteConfig.maps.lat};${siteConfig.maps.lng}`,
    ICBM: `${siteConfig.maps.lat}, ${siteConfig.maps.lng}`,
  },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/hero-bg.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/images/hero-bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Google Search Console verification. Env var wins; the committed fallback is
  // the site's real code so a plain `git pull` + build keeps the site verified.
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "KCqUpSiBNNhGsH_D-2nsA3m05VpvHoVIuEwIWTOAmjg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "MovingCompany"],
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      alternateName: "شيبو للشحن والخدمات اللوجستية",
      url: siteConfig.url,
      description: siteConfig.description,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      image: `${siteConfig.url}/images/logo.png`,
      logo: `${siteConfig.url}/images/logo.png`,
      priceRange: "$$",
      knowsLanguage: ["en", "ar"],
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.contact.address,
        addressLocality: "Dubai",
        addressRegion: "Dubai",
        addressCountry: "AE",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: siteConfig.maps.lat,
        longitude: siteConfig.maps.lng,
      },
      areaServed: [
        "United Arab Emirates",
        "Dubai",
        "Abu Dhabi",
        "Sharjah",
        "Saudi Arabia",
        "Egypt",
        "Iraq",
        "Qatar",
        "Kuwait",
        "Oman",
        "Bahrain",
      ].map((name) => ({ "@type": "Place", name })),
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Cargo & Logistics Services",
        itemListElement: [
          "Air Cargo",
          "Sea Cargo",
          "Land Cargo",
          "Movers & Packers",
          "Car Shipping",
          "Trailer Transport (GCC)",
          "Warehouse Storage",
        ].map((service) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: service },
        })),
      },
      sameAs: [
        siteConfig.social.instagram,
        siteConfig.social.linkedin,
        siteConfig.social.twitter,
        siteConfig.social.facebook,
        siteConfig.social.youtube,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      inLanguage: ["en", "ar"],
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <WhatsAppButton />
              <ChatWidget />
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
