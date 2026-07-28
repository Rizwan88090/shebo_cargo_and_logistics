export interface NavItem {
  label: string;
  href: string;
  key: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "About", href: "/about", key: "about" },
  {
    label: "Services",
    href: "/services",
    key: "services",
    children: [
      { label: "Air Cargo", href: "/services/air-cargo", key: "airCargo" },
      { label: "Sea Cargo", href: "/services/sea-cargo", key: "seaCargo" },
      { label: "Land Cargo", href: "/services/land-cargo", key: "landCargo" },
      { label: "Villa Shifting", href: "/services/villa-shifting", key: "villaShifting" },
      { label: "Office Relocation", href: "/services/office-relocation", key: "officeRelocation" },
      { label: "Car Shipping", href: "/services/car-shipping", key: "carShipping" },
      { label: "Trailer Service", href: "/services/trailer-service", key: "trailerService" },
      { label: "Warehouse Storage", href: "/services/warehouse-storage", key: "warehouseStorage" },
    ],
  },
  { label: "Countries", href: "/countries", key: "countries" },
  { label: "Corporate", href: "/corporate", key: "corporate" },
  { label: "Track Shipment", href: "/tracking", key: "tracking" },
  {
    label: "Resources",
    href: "/blog",
    key: "resources",
    children: [
      { label: "Blog", href: "/blog", key: "blog" },
      { label: "Careers", href: "/careers", key: "careers" },
      { label: "Gallery", href: "/gallery", key: "gallery" },
      { label: "Reviews", href: "/reviews", key: "reviews" },
      { label: "FAQ", href: "/faq", key: "faq" },
      { label: "Support", href: "/support", key: "support" },
    ],
  },
  { label: "Contact", href: "/contact", key: "contact" },
];
