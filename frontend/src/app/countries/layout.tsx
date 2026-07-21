import type { Metadata } from "next";

const title = "Countries We Serve";
const description =
  "Meridian's logistics network spans the Gulf, South Asia and the West — reliable cargo and relocation on every major trade route.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/countries" },
  openGraph: { title, description, url: "/countries" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
