export interface Country {
  name: string;
  code: string;
  flag: string;
  description: string;
  services: string[];
}

export const countries: Country[] = [
  {
    name: "United Arab Emirates",
    code: "AE",
    flag: "🇦🇪",
    description: "Our headquarters and primary hub for all GCC operations with comprehensive logistics coverage.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo", "Villa Shifting", "Office Relocation"],
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
    description: "Extensive coverage across all major cities including Riyadh, Jeddah, and Dammam.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo", "Villa Shifting", "Office Relocation"],
  },
  {
    name: "Oman",
    code: "OM",
    flag: "🇴🇲",
    description: "Regular services to Muscat and all major Omani cities with cross-border land transport.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo", "Villa Shifting"],
  },
  {
    name: "Qatar",
    code: "QA",
    flag: "🇶🇦",
    description: "Direct services to Doha with fast customs clearance and delivery solutions.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo"],
  },
  {
    name: "Bahrain",
    code: "BH",
    flag: "🇧🇭",
    description: "Quick and efficient logistics services connecting Bahrain to the wider GCC network.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo"],
  },
  {
    name: "Kuwait",
    code: "KW",
    flag: "🇰🇼",
    description: "Reliable cargo services to Kuwait City with door-to-door delivery options.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo"],
  },
  {
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    description: "Major trade lane with services to all major Indian ports and airports including Mumbai, Delhi, and Chennai.",
    services: ["Air Cargo", "Sea Cargo"],
  },
  {
    name: "Pakistan",
    code: "PK",
    flag: "🇵🇰",
    description: "Regular air and sea cargo services to Karachi, Lahore, Islamabad, and other major cities.",
    services: ["Air Cargo", "Sea Cargo"],
  },
  {
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    description: "Premium cargo services to London and all major UK destinations with customs expertise.",
    services: ["Air Cargo", "Sea Cargo"],
  },
  {
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    description: "Comprehensive air and sea freight to all major US ports and airports coast to coast.",
    services: ["Air Cargo", "Sea Cargo"],
  },
  {
    name: "China",
    code: "CN",
    flag: "🇨🇳",
    description: "Strong trade connections with services to Shanghai, Shenzhen, Guangzhou, and more.",
    services: ["Air Cargo", "Sea Cargo"],
  },
  {
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    description: "European hub with connections to Frankfurt, Hamburg, and all major German logistics centers.",
    services: ["Air Cargo", "Sea Cargo"],
  },
];
