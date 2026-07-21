import type { Metadata } from "next";

const title = "Gallery";
const description =
  "See Meridian Cargo & Logistics in action — our fleet, cargo operations and relocation projects across the Gulf.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/gallery" },
  openGraph: { title, description, url: "/gallery" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
