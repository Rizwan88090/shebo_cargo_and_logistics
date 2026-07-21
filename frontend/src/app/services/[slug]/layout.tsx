import type { Metadata } from "next";
import { services } from "@/data/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  const title = service ? service.title : "Service";
  const description =
    service?.shortDescription ||
    "Premium cargo, freight and relocation services from Meridian Cargo & Logistics.";

  return {
    title,
    description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: { title, description, url: `/services/${slug}` },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
