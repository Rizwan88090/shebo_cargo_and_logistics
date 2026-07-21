export interface NavItem {
  label: string;
  href: string;
  key: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  { label: "Home", href: "/", key: "home" },
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
  { label: "Order", href: "/order", key: "order" },
  { label: "Tracking", href: "/tracking", key: "tracking" },
  { label: "Contact", href: "/contact", key: "contact" },
];
