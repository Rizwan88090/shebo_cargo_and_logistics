import type { Metadata } from "next";

const title = "Get a Quote";
const description =
  "Request a free, no-obligation quote for your cargo, freight or relocation with Meridian Cargo & Logistics.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/request-quote" },
  openGraph: { title, description, url: "/request-quote" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
