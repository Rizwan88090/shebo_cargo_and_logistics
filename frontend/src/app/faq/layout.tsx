import type { Metadata } from "next";

const title = "FAQ";
const description =
  "Answers to common questions about Meridian's cargo, shipping, tracking and relocation services.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faq" },
  openGraph: { title, description, url: "/faq" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
