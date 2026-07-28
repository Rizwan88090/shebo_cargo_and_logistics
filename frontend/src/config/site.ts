// Public site URL — used for SEO canonical, sitemap.xml, robots.txt & Open Graph.
// MUST match the exact live domain or Google will not index the site correctly.
// Override on your VPS with NEXT_PUBLIC_SITE_URL=https://yourdomain.com
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shebocargo.com";

export const siteConfig = {
  name: "Shebo Cargo and Logistics",
  tagline: "Your Trusted Global Logistics Partner",
  description:
    "Shebo Cargo and Logistics — premium air, sea and land cargo, movers & packers, car shipping, GCC trailer transport and secure warehouse storage. Door-to-door freight across the Gulf, South Asia and worldwide.",
  url: siteUrl,

  contact: {
    phone: "+971527540249",
    email: "itxsheboo@gmail.com",
    whatsapp: "+971527540249",
    address: "Hor Al Anz East, Abu Hail, Dubai, UAE",
  },

  social: {
    instagram: "https://instagram.com/shebocargo",
    linkedin: "https://linkedin.com/company/shebocargo",
    twitter: "https://twitter.com/shebocargo",
    whatsapp: "https://wa.me/971527540249",
    facebook: "https://facebook.com/shebocargo",
    youtube: "https://youtube.com/@shebocargo",
  },

  maps: {
    embedUrl:
      "https://maps.google.com/maps?q=Hor%20Al%20Anz%20East%2C%20Abu%20Hail%2C%20Dubai%2C%20UAE&t=&z=14&ie=UTF8&iwloc=&output=embed",
    lat: 25.2789,
    lng: 55.3372,
  },

  stats: [
    { label: "Years of Experience", value: 15, suffix: "+" },
    { label: "Countries Served", value: 50, suffix: "+" },
    { label: "Happy Clients", value: 10000, suffix: "+" },
    { label: "Shipments Delivered", value: 500000, suffix: "+" },
  ],
};
