import type { Metadata } from "next";

const title = "Track Your Shipment";
const description =
  "Enter your tracking number for real-time updates on your Meridian cargo — status, location and estimated delivery.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tracking" },
  openGraph: { title, description, url: "/tracking" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
