export interface Country {
  name: string;
  code: string;
  flag: string;
  description: string;
  services: string[];
  priority?: boolean;
}

// Ordered by business priority: Gulf (GCC) + Egypt + Iraq lead the list —
// these are our core, highest-volume trade lanes and are shown first on the
// homepage (which renders the top 8). Wider network follows.
export const countries: Country[] = [
  {
    name: "United Arab Emirates",
    code: "AE",
    flag: "🇦🇪",
    description: "Our headquarters and primary hub for all Gulf operations — air, sea and land, door to door across every Emirate.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo", "Trailer Service", "Villa Shifting", "Office Relocation"],
    priority: true,
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
    description: "Full coverage across the Kingdom — Riyadh, Jeddah, Dammam and beyond — with fast cross-border trailer and cargo service.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo", "Trailer Service", "Villa Shifting", "Office Relocation"],
    priority: true,
  },
  {
    name: "Egypt",
    code: "EG",
    flag: "🇪🇬",
    description: "A key trade lane — direct air and sea cargo to Cairo, Alexandria and Port Said with expert customs clearance.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo"],
    priority: true,
  },
  {
    name: "Iraq",
    code: "IQ",
    flag: "🇮🇶",
    description: "Reliable air, sea and overland cargo to Baghdad, Basra and Erbil — one of our fastest-growing destinations.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo"],
    priority: true,
  },
  {
    name: "Russia",
    code: "RU",
    flag: "🇷🇺",
    description: "Air and sea cargo to Moscow, St. Petersburg and major Russian hubs with full customs handling.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo"],
    priority: true,
  },
  {
    name: "Qatar",
    code: "QA",
    flag: "🇶🇦",
    description: "Direct services to Doha with fast customs clearance, dedicated trailers and door-to-door delivery.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo", "Trailer Service"],
    priority: true,
  },
  {
    name: "Kuwait",
    code: "KW",
    flag: "🇰🇼",
    description: "Reliable cargo and trailer services to Kuwait City with seamless GCC cross-border clearance.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo", "Trailer Service"],
    priority: true,
  },
  {
    name: "Oman",
    code: "OM",
    flag: "🇴🇲",
    description: "Regular services to Muscat and all major Omani cities with cross-border land and trailer transport.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo", "Trailer Service", "Villa Shifting"],
    priority: true,
  },
  {
    name: "Bahrain",
    code: "BH",
    flag: "🇧🇭",
    description: "Quick and efficient logistics connecting Bahrain to the wider Gulf network by air, sea and road.",
    services: ["Air Cargo", "Sea Cargo", "Land Cargo", "Trailer Service"],
    priority: true,
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
