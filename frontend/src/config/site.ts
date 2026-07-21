// Public site URL — override on your VPS with NEXT_PUBLIC_SITE_URL=https://yourdomain.com
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shebocargo.com";

export const siteConfig = {
  name: "Shebo Cargo and Logistics",
  tagline: "Your Trusted Global Logistics Partner",
  description:
    "Shebo Cargo and Logistics — premium air, sea and land cargo, movers & packers, car shipping, GCC trailer transport and secure warehouse storage. Door-to-door freight across the Gulf, South Asia and worldwide.",
  url: siteUrl,

  contact: {
    phone: "+971 50 123 4567",
    email: "info@shebocargo.com",
    whatsapp: "+971527540249",
    address: "Office 301, Al Quoz Industrial Area 3, Dubai, UAE",
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
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178510889914!2d55.2374!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDExJzUwLjAiTiA1NcKwMTQnMTQuNiJF!5e0!3m2!1sen!2sae!4v1234567890",
    lat: 25.1972,
    lng: 55.2374,
  },

  stats: [
    { label: "Years of Experience", value: 15, suffix: "+" },
    { label: "Countries Served", value: 50, suffix: "+" },
    { label: "Happy Clients", value: 10000, suffix: "+" },
    { label: "Shipments Delivered", value: 500000, suffix: "+" },
  ],
};
