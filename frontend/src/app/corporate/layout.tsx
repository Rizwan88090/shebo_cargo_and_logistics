import type { Metadata } from "next";

const title = "Corporate Logistics";
const description =
  "Contract shipping, dedicated account management and volume pricing for businesses of every size. Partner with Meridian Cargo & Logistics.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/corporate" },
  openGraph: { title, description, url: "/corporate" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
