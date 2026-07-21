import type { Metadata } from "next";

const title = "Support";
const description =
  "Get help with your shipments — submit a ticket or browse existing support requests with Meridian Cargo & Logistics.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/support" },
  openGraph: { title, description, url: "/support" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
