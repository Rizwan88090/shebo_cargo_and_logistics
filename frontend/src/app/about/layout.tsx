import type { Metadata } from "next";

const title = "About Us";
const description =
  "Meet Meridian Cargo & Logistics — premium cargo, freight and relocation across the Gulf, South Asia and the West. One team, door to door.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, url: "/about" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
