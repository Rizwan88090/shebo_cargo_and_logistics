import { IconType } from "react-icons";
import { MdFlight, MdDirectionsBoat, MdLocalShipping, MdHome, MdBusiness } from "react-icons/md";

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  shortDescription: string;
  icon: string;
  image: string;
  features: string[];
  process: { step: number; title: string; description: string }[];
}

export const services: Service[] = [
  {
    slug: "air-cargo",
    title: "Air Cargo Services",
    shortTitle: "Air Cargo",
    description:
      "Experience the fastest and most reliable air cargo services across the globe. Our extensive network of airline partners ensures your shipments reach any destination with speed and precision. Whether it's urgent documents, perishable goods, or oversized cargo, we handle it all with expert care and real-time tracking.",
    shortDescription:
      "Fast and reliable air freight solutions with global coverage and real-time tracking for time-sensitive shipments.",
    icon: "MdFlight",
    image: "/images/air-cargo.png",
    features: [
      "Express & standard air freight options",
      "Door-to-door & airport-to-airport delivery",
      "Temperature-controlled cargo handling",
      "Dangerous goods certified shipping",
      "Real-time shipment tracking",
      "Custom clearance assistance",
      "Charter services for oversized cargo",
      "Consolidation services for cost efficiency",
    ],
    process: [
      { step: 1, title: "Request a Quote", description: "Share your shipment details and get a competitive quote within hours." },
      { step: 2, title: "Booking & Pickup", description: "We arrange pickup from your location and handle all documentation." },
      { step: 3, title: "Customs & Compliance", description: "Our experts handle customs clearance and regulatory requirements." },
      { step: 4, title: "Air Transit", description: "Your cargo is loaded and transported via our trusted airline partners." },
      { step: 5, title: "Delivery", description: "Safe delivery to the destination with proof of delivery confirmation." },
    ],
  },
  {
    slug: "sea-cargo",
    title: "Sea Cargo Services",
    shortTitle: "Sea Cargo",
    description:
      "Our sea cargo services offer the most cost-effective solution for large volume shipments. With access to major shipping lines and ports worldwide, we provide both Full Container Load (FCL) and Less than Container Load (LCL) options to suit your needs. Our experienced team ensures smooth sailing from origin to destination.",
    shortDescription:
      "Cost-effective ocean freight for large shipments with FCL and LCL options across all major global routes.",
    icon: "MdDirectionsBoat",
    image: "/images/sea-cargo.png",
    features: [
      "Full Container Load (FCL) services",
      "Less than Container Load (LCL) services",
      "Breakbulk & project cargo",
      "Reefer container services",
      "Port-to-port & door-to-door delivery",
      "Cargo insurance coverage",
      "Customs brokerage services",
      "Warehousing & distribution",
    ],
    process: [
      { step: 1, title: "Inquiry & Quotation", description: "Submit your cargo details and receive a tailored sea freight quote." },
      { step: 2, title: "Container Booking", description: "We book the optimal container and shipping line for your cargo." },
      { step: 3, title: "Cargo Stuffing", description: "Professional loading and securing of your goods in the container." },
      { step: 4, title: "Ocean Transit", description: "Your cargo sails with real-time vessel tracking capabilities." },
      { step: 5, title: "Destination Handling", description: "Customs clearance and last-mile delivery at destination port." },
    ],
  },
  {
    slug: "land-cargo",
    title: "Land Cargo Services",
    shortTitle: "Land Cargo",
    description:
      "Our comprehensive land cargo network covers the entire GCC region and beyond. With a modern fleet of trucks and experienced drivers, we offer reliable ground transportation for all types of cargo. From small parcels to full truckloads, we ensure timely and secure delivery across borders.",
    shortDescription:
      "Reliable ground transportation across GCC and beyond with a modern fleet for all cargo types and sizes.",
    icon: "MdLocalShipping",
    image: "/images/land-cargo.png",
    features: [
      "Full Truck Load (FTL) services",
      "Less than Truck Load (LTL) services",
      "Cross-border transportation",
      "Refrigerated truck services",
      "Flatbed & lowbed trailers",
      "GPS-tracked fleet",
      "Express & scheduled deliveries",
      "Last-mile delivery solutions",
    ],
    process: [
      { step: 1, title: "Route Planning", description: "We plan the most efficient route for your cargo delivery." },
      { step: 2, title: "Vehicle Assignment", description: "The right vehicle type is assigned based on your cargo specifications." },
      { step: 3, title: "Loading & Dispatch", description: "Professional loading and secure fastening of your goods." },
      { step: 4, title: "In-Transit Monitoring", description: "Real-time GPS tracking and regular status updates." },
      { step: 5, title: "Safe Delivery", description: "Timely delivery with unloading assistance and documentation." },
    ],
  },
  {
    slug: "villa-shifting",
    title: "Villa Shifting Services",
    shortTitle: "Villa Shifting",
    description:
      "Moving to a new villa? Let our professional team handle every aspect of your relocation. From careful packing of your belongings to safe transportation and unpacking at your new home, we make villa shifting a stress-free experience. Our trained movers treat your possessions with the utmost care.",
    shortDescription:
      "Professional villa relocation with expert packing, safe transport, and careful unpacking at your new home.",
    icon: "MdHome",
    image: "/images/villa-shifting.png",
    features: [
      "Professional packing & unpacking",
      "Furniture disassembly & reassembly",
      "Fragile items special handling",
      "Climate-controlled storage options",
      "Insurance coverage for belongings",
      "Same-day & scheduled moves",
      "Pet-friendly relocation assistance",
      "Cleaning services at old/new location",
    ],
    process: [
      { step: 1, title: "Free Survey", description: "Our team visits your villa to assess the scope of the move." },
      { step: 2, title: "Custom Quote", description: "Receive a detailed, transparent quote with no hidden charges." },
      { step: 3, title: "Professional Packing", description: "Expert packing using premium materials to protect your belongings." },
      { step: 4, title: "Safe Transport", description: "Careful loading and transportation in our dedicated moving vehicles." },
      { step: 5, title: "Setup & Unpack", description: "Unpacking and setting up your new home exactly as you want it." },
    ],
  },
  {
    slug: "office-relocation",
    title: "Office Relocation Services",
    shortTitle: "Office Relocation",
    description:
      "Minimize downtime and maximize efficiency with our expert office relocation services. We understand that every hour counts for your business, which is why we plan and execute office moves with military precision. From IT equipment to furniture, we handle everything to get your business back up and running quickly.",
    shortDescription:
      "Seamless office moves with minimal downtime, covering IT equipment, furniture, and complete setup.",
    icon: "MdBusiness",
    image: "/images/office-relocation.png",
    features: [
      "Detailed move planning & project management",
      "IT equipment safe handling",
      "Furniture disassembly & reassembly",
      "Document & file secure packing",
      "Weekend & after-hours moves",
      "Temporary storage solutions",
      "New office space planning assistance",
      "Disposal & recycling of old items",
    ],
    process: [
      { step: 1, title: "Consultation", description: "We assess your office and create a comprehensive move plan." },
      { step: 2, title: "Move Planning", description: "Detailed timeline and logistics plan to minimize business disruption." },
      { step: 3, title: "Packing & Labeling", description: "Systematic packing and color-coded labeling for efficient unpacking." },
      { step: 4, title: "Transportation", description: "Secure transport of all office assets to the new location." },
      { step: 5, title: "Setup & Handover", description: "Complete setup at the new office, ready for business operations." },
    ],
  },
  {
    slug: "car-shipping",
    title: "Car Shipping Services",
    shortTitle: "Car Shipping",
    description:
      "Ship your car anywhere in the world with Meridian. We move vehicles worldwide via dedicated car carriers and special recovery trucks, using both RoRo (Roll-on/Roll-off) and containerized methods. From a single family car to luxury and vintage vehicles, bikes and boats, we handle collection, export deregistration, marine insurance and door-to-door delivery — safely and fully documented.",
    shortDescription:
      "Worldwide car shipping via car carrier and special recovery — RoRo, containerized, insured and door-to-door.",
    icon: "MdDirectionsCar",
    image: "/images/sea-cargo.png",
    features: [
      "Worldwide car shipping — Gulf, Asia, Europe & the Americas",
      "Via enclosed car carrier & special recovery trucks",
      "RoRo (Roll-on/Roll-off) & containerized options",
      "Single car, multiple cars, luxury & vintage handling",
      "Export deregistration for UAE-plated vehicles",
      "All-risk marine insurance coverage",
      "Bikes, boats & heavy vehicles",
      "Door-to-door pickup and delivery",
    ],
    process: [
      { step: 1, title: "Request a Quote", description: "Share your vehicle details and destination for a fixed door-to-door price." },
      { step: 2, title: "Collection", description: "We collect via car carrier or special recovery truck from your address." },
      { step: 3, title: "Inspection & Documents", description: "Condition report, export deregistration and shipping paperwork handled." },
      { step: 4, title: "Worldwide Shipping", description: "Your vehicle sails via RoRo or container with full tracking." },
      { step: 5, title: "Delivery & Handover", description: "Customs cleared at destination and delivered to your door." },
    ],
  },
  {
    slug: "trailer-service",
    title: "Trailer Transport Service",
    shortTitle: "Trailer Service",
    description:
      "Dedicated trailer transport across the GCC only — UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain. Choose the right trailer for your cargo: Flatbed for machinery, steel and oversized loads; Curtain Side (Sitara) for palletized and general goods; Box Truck for secure enclosed transport; and Reefer Truck for temperature-controlled chilled and frozen cargo. Cross-border clearance is handled en route by our experienced drivers.",
    shortDescription:
      "GCC-only trailer transport — Flatbed, Curtain Side (Sitara), Box and Reefer trucks with cross-border clearance.",
    icon: "MdLocalShipping",
    image: "/images/land-cargo.png",
    features: [
      "GCC-only service (UAE, KSA, Qatar, Kuwait, Oman, Bahrain)",
      "Flatbed trailers — machinery, steel & oversized cargo",
      "Curtain Side / Sitara trailers — palletized & general goods",
      "Box trucks — secure, weather-proof enclosed transport",
      "Reefer trucks — temperature-controlled chilled & frozen",
      "Full trailer loads & dedicated vehicles",
      "Cross-border GCC customs clearance en route",
      "GPS-tracked fleet with experienced drivers",
    ],
    process: [
      { step: 1, title: "Request & Truck Type", description: "Tell us your cargo and pick the trailer: Flatbed, Curtain Side, Box or Reefer." },
      { step: 2, title: "Vehicle Assignment", description: "The right GCC trailer is assigned to your route and load." },
      { step: 3, title: "Loading & Securing", description: "Professional loading, lashing and weatherproofing of your cargo." },
      { step: 4, title: "GCC Transit", description: "Cross-border transport with clearance handled at every checkpoint." },
      { step: 5, title: "Delivery", description: "On-time delivery with unloading assistance and proof of delivery." },
    ],
  },
  {
    slug: "warehouse-storage",
    title: "Warehouse Storage Services",
    shortTitle: "Warehouse Storage",
    description:
      "Secure short-term and long-term warehouse storage with climate-controlled and bonded facilities. Our warehouses offer 24/7 CCTV security, professional inventory management, and pick-pack-and-distribution services. Whether you need pallet racking, container stuffing and de-stuffing, or duty-free bonded storage, we keep your goods safe and ready to move on demand.",
    shortDescription:
      "Secure short & long-term warehouse storage with climate control, bonded zones and inventory management.",
    icon: "MdWarehouse",
    image: "/images/office-relocation.png",
    features: [
      "Short-term & long-term storage",
      "Climate-controlled & ambient warehousing",
      "Bonded & duty-free storage zones",
      "24/7 CCTV security & access control",
      "Inventory management & stock reports",
      "Pick, pack & distribution services",
      "Palletized & rack storage",
      "Container stuffing & de-stuffing",
    ],
    process: [
      { step: 1, title: "Space Assessment", description: "We assess your volume and allocate the right storage space." },
      { step: 2, title: "Intake & Inspection", description: "Goods received, inspected and logged into our inventory system." },
      { step: 3, title: "Secure Storage", description: "Stored in climate-controlled or bonded areas under 24/7 security." },
      { step: 4, title: "Management & Reporting", description: "Real-time stock reports, inventory management and access on request." },
      { step: 5, title: "Dispatch on Demand", description: "Pick, pack and dispatch whenever you need — locally or worldwide." },
    ],
  },
];
