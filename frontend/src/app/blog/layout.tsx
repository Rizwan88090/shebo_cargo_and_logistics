import type { Metadata } from "next";

const title = "Blog";
const description =
  "Shipping guides, route openings and logistics insights from the Meridian Cargo & Logistics team.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title, description, url: "/blog" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
