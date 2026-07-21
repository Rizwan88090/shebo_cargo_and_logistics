export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export const faqCategories = [
  "General",
  "Air Cargo",
  "Sea Cargo",
  "Land Cargo",
  "Moving Services",
  "Pricing & Payment",
];

export const faqs: FaqItem[] = [
  {
    id: 1,
    question: "What services does Shebo Cargo & Logistics offer?",
    answer:
      "We offer a comprehensive range of logistics services including Air Cargo, Sea Cargo, Land Cargo, Villa Shifting, and Office Relocation. Our services cover both domestic and international shipments across 50+ countries.",
    category: "General",
  },
  {
    id: 2,
    question: "Which countries do you serve?",
    answer:
      "We serve over 50 countries worldwide with a strong presence in the GCC region (UAE, Saudi Arabia, Oman, Qatar, Bahrain, Kuwait) as well as India, Pakistan, UK, USA, China, Germany, and many more.",
    category: "General",
  },
  {
    id: 3,
    question: "How can I track my shipment?",
    answer:
      "You can track your shipment through our real-time tracking system. Once your shipment is booked, you'll receive a tracking number via email and SMS. You can also contact our customer support team for status updates.",
    category: "General",
  },
  {
    id: 4,
    question: "How fast is air cargo delivery?",
    answer:
      "Air cargo delivery times vary depending on the destination. Express shipments within the GCC typically take 1-2 days, while international shipments to major cities take 3-7 days. We also offer same-day express services for urgent cargo.",
    category: "Air Cargo",
  },
  {
    id: 5,
    question: "Can you handle dangerous goods via air?",
    answer:
      "Yes, we are certified to handle dangerous goods (DG cargo) in compliance with IATA regulations. Our trained team ensures proper packaging, documentation, and handling of all DG shipments.",
    category: "Air Cargo",
  },
  {
    id: 6,
    question: "What is the difference between FCL and LCL?",
    answer:
      "FCL (Full Container Load) means you book an entire container for your cargo, ideal for large shipments. LCL (Less than Container Load) means your cargo shares container space with other shipments, making it cost-effective for smaller volumes.",
    category: "Sea Cargo",
  },
  {
    id: 7,
    question: "How long does sea cargo take from Dubai to India?",
    answer:
      "Sea cargo from Dubai to major Indian ports typically takes 5-10 days depending on the port of discharge. Transit times to Mumbai and Nhava Sheva are usually 5-7 days, while Kolkata and Chennai may take 8-10 days.",
    category: "Sea Cargo",
  },
  {
    id: 8,
    question: "Do you offer cross-border land transport?",
    answer:
      "Yes, we provide cross-border land transport across all GCC countries. Our modern fleet is equipped with GPS tracking, and we handle all border documentation and customs requirements for seamless cross-border delivery.",
    category: "Land Cargo",
  },
  {
    id: 9,
    question: "How do you ensure cargo safety during land transport?",
    answer:
      "We use modern, well-maintained vehicles with GPS tracking, trained drivers, and professional loading/unloading teams. All cargo is properly secured using industry-standard fastening methods, and we offer insurance coverage for added peace of mind.",
    category: "Land Cargo",
  },
  {
    id: 10,
    question: "Do you provide packing materials for villa shifting?",
    answer:
      "Yes, we provide all packing materials including high-quality boxes, bubble wrap, foam sheets, wardrobe boxes, and specialized packaging for fragile items. Our professional packers use premium materials to ensure your belongings are fully protected.",
    category: "Moving Services",
  },
  {
    id: 11,
    question: "Can you help with international relocation?",
    answer:
      "Absolutely! We offer door-to-door international relocation services including packing, shipping, customs clearance, and delivery at your new destination. We handle everything from household goods to vehicles.",
    category: "Moving Services",
  },
  {
    id: 12,
    question: "How do you calculate shipping costs?",
    answer:
      "Shipping costs depend on several factors including cargo weight, dimensions, origin, destination, service type (air/sea/land), and any special handling requirements. Contact us for a free, no-obligation quote tailored to your specific needs.",
    category: "Pricing & Payment",
  },
  {
    id: 13,
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfers, credit/debit cards, cash, and offer corporate credit terms for regular customers. For international shipments, we also accept Letters of Credit (LC) and other trade finance instruments.",
    category: "Pricing & Payment",
  },
  {
    id: 14,
    question: "Do you offer cargo insurance?",
    answer:
      "Yes, we offer comprehensive cargo insurance coverage for all types of shipments. Our insurance options cover damage, loss, and theft during transit. We recommend all customers opt for insurance for complete peace of mind.",
    category: "Pricing & Payment",
  },
];
