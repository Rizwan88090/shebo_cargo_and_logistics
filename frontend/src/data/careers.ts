export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  description: string;
  requirements: string[];
}

export const jobOpenings: JobOpening[] = [
  {
    id: "job-1",
    title: "Logistics Operations Coordinator",
    department: "Operations",
    location: "Al Quoz, Dubai",
    type: "Full-time",
    description: "Manage daily shipping schedules, coordinate with air/sea carriers, and handle customs documentation processing.",
    requirements: [
      "2+ years experience in logistics or supply chain coordinating roles.",
      "Proficient in cargo tracking systems and customs portal declarations.",
      "Fluency in English (Arabic is a strong advantage).",
      "Strong problem-solving skills under tight deadlines."
    ]
  },
  {
    id: "job-2",
    title: "Sales Executive — Air & Sea Freight",
    department: "Sales",
    location: "Al Quoz, Dubai",
    type: "Full-time",
    description: "Develop new corporate accounts, prepare quotes, negotiate freight rates, and grow regional logistics revenue.",
    requirements: [
      "Proven track record in freight forwarding sales in the UAE.",
      "Existing network of active corporate shippers.",
      "Strong communication and negotiation capability.",
      "Valid UAE driving license is mandatory."
    ]
  },
  {
    id: "job-3",
    title: "Warehouse Supervisor",
    department: "Warehousing",
    location: "Jebel Ali Free Zone, Dubai",
    type: "Full-time",
    description: "Oversee inventory control, inbound/outbound shipments processing, and lead warehouse staff for safety and efficiency.",
    requirements: [
      "3+ years experience supervising warehouse teams.",
      "Familiarity with WMS (Warehouse Management System) software.",
      "Expertise in stocktaking and discrepancy resolution.",
      "Forklift license and certification is a plus."
    ]
  },
  {
    id: "job-4",
    title: "Relocation Specialist / Project Leader",
    department: "Home Shifting",
    location: "Al Quoz, Dubai",
    type: "Full-time",
    description: "Lead villa and office moving crews, coordinate inventory packaging, and ensure premium damage-free shifting service.",
    requirements: [
      "Experience leading professional packing/moving crews.",
      "Strong customer service focus and clear communication skills.",
      "Knowledge of packing materials for fragile art and servers.",
      "Good command of English and Hindi/Urdu."
    ]
  }
];
