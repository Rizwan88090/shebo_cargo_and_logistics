import type { Metadata } from "next";

const title = "Careers";
const description =
  "Join Meridian Cargo & Logistics and build your career in global logistics. Explore our open positions.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/careers" },
  openGraph: { title, description, url: "/careers" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
