import type { Metadata } from "next";

const title = "Contact Us";
const description =
  "Get in touch with Meridian Cargo & Logistics in Jebel Ali Free Zone, Dubai — quotes, bookings and support, door to door.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title, description, url: "/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
