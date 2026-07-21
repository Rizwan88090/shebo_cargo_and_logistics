import type { Metadata } from "next";

const title = "Services";
const description =
  "Air, sea and land cargo, movers & packers, and car shipping — premium logistics across the Gulf and beyond, handled by one trusted team.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services" },
  openGraph: { title, description, url: "/services" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
