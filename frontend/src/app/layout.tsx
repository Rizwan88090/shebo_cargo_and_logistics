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
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "cargo",
    "logistics",
    "freight forwarding",
    "air cargo",
    "sea cargo",
    "land cargo",
    "movers and packers",
    "car shipping",
    "relocation",
    "Dubai",
    "Jebel Ali",
    "UAE",
    "Gulf shipping",
    "door to door cargo",
  ],
  alternates: {
    canonical: "/",
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
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.contact.address,
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
      sameAs: [
        siteConfig.social.instagram,
        siteConfig.social.linkedin,
        siteConfig.social.twitter,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
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
