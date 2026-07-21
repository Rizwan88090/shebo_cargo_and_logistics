export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Shipping" | "Moving" | "Corporate" | "Tips";
  author: string;
  date: string;
  readTime: number;
  image: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    slug: "navigating-air-freight-guide",
    title: "Navigating Air Freight: A Guide for Exporters",
    excerpt: "Learn how to optimize your global supply chain with our comprehensive guide to air freight shipping, costs, and custom clearance.",
    category: "Shipping",
    author: "Fatima Al Suwaidi",
    date: "July 12, 2026",
    readTime: 5,
    image: "/images/air-cargo.png",
    content: "Air freight is the fastest shipping method for importing and exporting goods. This guide will walk you through the key aspects of air cargo logistics: how rates are calculated based on gross vs volumetric weight, the essential customs documents you need, and how to select the right partner for critical shipments.",
  },
  {
    id: "post-2",
    slug: "hassle-free-villa-move-dubai",
    title: "How to Prepare for a Hassle-Free Villa Move in Dubai",
    excerpt: "Relocating your home can be stressful. Discover our top tips and timeline for preparing your villa shift, packing, and settling in quickly.",
    category: "Moving",
    author: "Marcus Vance",
    date: "June 28, 2026",
    readTime: 6,
    image: "/images/villa-shifting.png",
    content: "Moving villas in Dubai requires careful planning. We recommend starting your preparation at least 4 weeks in advance. In this article, we outline the checklist for booking professional shifting services, coordinate Ejari cancellations/registrations, and organize your layout transition so the move is stress-free.",
  },
  {
    id: "post-3",
    slug: "sea-cargo-vs-air-cargo-comparison",
    title: "Sea Cargo vs Air Cargo: Which is Right for You?",
    excerpt: "A deep dive comparison into costs, shipping times, carbon footprints, and volume capacities of ocean and air freight solutions.",
    category: "Shipping",
    author: "Amit Patel",
    date: "June 15, 2026",
    readTime: 7,
    image: "/images/sea-cargo.png",
    content: "Choosing between sea and air cargo is one of the most critical decisions for import-export businesses. Sea cargo offers unparalleled container volume capacity and budget friendly rates, whereas air cargo delivers unmatched speed. Let's compare both options on cost, schedule reliability, and eco-friendliness.",
  },
  {
    id: "post-4",
    slug: "corporate-relocation-minimizing-downtime",
    title: "Corporate Relocation: Minimizing Business Downtime",
    excerpt: "Moving offices? Discover how professional project managers plan office moves, IT equipment transfers, and furniture setups overnight.",
    category: "Corporate",
    author: "Sarah Jenkins",
    date: "May 30, 2026",
    readTime: 8,
    image: "/images/office-relocation.png",
    content: "Corporate relocation is a complex task where timing is everything. Any disruption to operations translates directly to lost revenue. Discover how expert moving services orchestrate phase-based moving, high-security server packing, and rapid workplace setup so your employees can resume work with zero delay.",
  },
  {
    id: "post-5",
    slug: "packaging-tips-fragile-cargo",
    title: "Top 10 Packaging Tips for Fragile International Cargo",
    excerpt: "Protect your high-value items. Read our guide on double boxing, custom crating, wrapping materials, and labeling for export.",
    category: "Tips",
    author: "Ziad Rahal",
    date: "May 10, 2026",
    readTime: 4,
    image: "/images/land-cargo.png",
    content: "When shipping fragile goods globally, quality packaging is your first line of defense. Our logistics team compiled ten rules: use heavy-duty double-walled cardboard boxes, ensure there is no empty space inside using bubble wrap or peanuts, and always seal seams with high-performance H-taping techniques.",
  },
];
