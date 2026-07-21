import type { Metadata } from "next";

const title = "Reviews";
const description =
  "Read what clients say about Meridian Cargo & Logistics — reliability, speed and care on every shipment.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/reviews" },
  openGraph: { title, description, url: "/reviews" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
