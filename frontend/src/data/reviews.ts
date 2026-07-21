export interface Review {
  id: number;
  name: string;
  company: string;
  rating: number;
  text: string;
  date: string;
  service: string;
  avatar: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    name: "Ahmed Al Maktoum",
    company: "Global Trading LLC",
    rating: 5,
    text: "Shebo Cargo handled our shipment from Dubai to London with incredible efficiency. The team was professional, communication was excellent, and our goods arrived ahead of schedule. Highly recommended for international cargo!",
    date: "2024-12-15",
    service: "Air Cargo",
    avatar: "AM",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    company: "TechVentures Inc.",
    rating: 5,
    text: "We relocated our entire office with Shebo and it was seamless. Zero downtime, everything was perfectly organized, and our IT equipment was handled with extreme care. They made a stressful process effortless.",
    date: "2024-11-20",
    service: "Office Relocation",
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Mohammed Al Rashid",
    company: "Al Rashid Imports",
    rating: 5,
    text: "I've been using Shebo for sea cargo from China to UAE for over 3 years. Their rates are competitive, customs clearance is always smooth, and I can track my shipments in real-time. Best logistics partner!",
    date: "2024-10-08",
    service: "Sea Cargo",
    avatar: "MR",
  },
  {
    id: 4,
    name: "Priya Sharma",
    company: "Homeowner",
    rating: 4,
    text: "Moved from my villa in JBR to a new place in Arabian Ranches. The Shebo team was punctual, careful with my furniture, and even helped with unpacking. The only reason for 4 stars is that the quote took a bit longer than expected.",
    date: "2024-09-25",
    service: "Villa Shifting",
    avatar: "PS",
  },
  {
    id: 5,
    name: "Khalid bin Saeed",
    company: "Desert Logistics Co.",
    rating: 5,
    text: "Outstanding land cargo service across the GCC. Our regular shipments from Dubai to Riyadh are always on time, and their GPS tracking gives us complete peace of mind. Truly reliable partner.",
    date: "2024-08-14",
    service: "Land Cargo",
    avatar: "KS",
  },
  {
    id: 6,
    name: "Jennifer Lee",
    company: "Pacific Exports Ltd.",
    rating: 5,
    text: "Shebo arranged a charter flight for our oversized machinery from Dubai to Mumbai. They handled all permits, customs, and logistics flawlessly. Their expertise in handling complex cargo is unmatched.",
    date: "2024-07-30",
    service: "Air Cargo",
    avatar: "JL",
  },
  {
    id: 7,
    name: "Omar Hassan",
    company: "Hassan Trading Group",
    rating: 4,
    text: "Good experience with FCL shipments from UAE to Pakistan. Competitive pricing and professional handling. The documentation process is very well managed. Would definitely use again.",
    date: "2024-07-12",
    service: "Sea Cargo",
    avatar: "OH",
  },
  {
    id: 8,
    name: "Fatima Al Zaabi",
    company: "Homeowner",
    rating: 5,
    text: "Moving to a new country is stressful enough, but Shebo made the packing and shipping of our entire household belongings so easy. Everything arrived in perfect condition. Thank you Shebo team!",
    date: "2024-06-18",
    service: "Villa Shifting",
    avatar: "FA",
  },
];

export function getAverageRating(): number {
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getReviewsByRating(rating: number): Review[] {
  return reviews.filter((r) => r.rating === rating);
}

export function getReviewsByService(service: string): Review[] {
  return reviews.filter((r) => r.service === service);
}
