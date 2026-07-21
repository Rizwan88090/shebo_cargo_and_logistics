export interface Invoice {
  id: string;
  orderId: string;
  date: string;
  dueDate: string;
  status: "paid" | "unpaid" | "overdue";
  subtotal: number;
  tax: number;
  total: number;
  items: { description: string; qty: number; rate: number; amount: number }[];
}

export const mockInvoices: Invoice[] = [
  {
    id: "INV-2024-001",
    orderId: "ORD-2024-001",
    date: "2024-12-15",
    dueDate: "2025-01-15",
    status: "paid",
    subtotal: 2300,
    tax: 150,
    total: 2450,
    items: [
      { description: "Air Cargo — Dubai to Riyadh (250 kg)", qty: 1, rate: 1800, amount: 1800 },
      { description: "Customs Clearance Fee", qty: 1, rate: 300, amount: 300 },
      { description: "Pickup & Delivery", qty: 1, rate: 200, amount: 200 },
    ],
  },
  {
    id: "INV-2024-002",
    orderId: "ORD-2024-002",
    date: "2024-12-28",
    dueDate: "2025-01-28",
    status: "unpaid",
    subtotal: 5500,
    tax: 300,
    total: 5800,
    items: [
      { description: "Sea Cargo — Dubai to Doha (20ft Container)", qty: 1, rate: 4500, amount: 4500 },
      { description: "Port Handling Charges", qty: 1, rate: 600, amount: 600 },
      { description: "Insurance Premium", qty: 1, rate: 400, amount: 400 },
    ],
  },
  {
    id: "INV-2024-003",
    orderId: "ORD-2024-003",
    date: "2024-12-30",
    dueDate: "2025-01-30",
    status: "unpaid",
    subtotal: 1750,
    tax: 150,
    total: 1900,
    items: [
      { description: "Land Cargo — Abu Dhabi to Muscat (800 kg)", qty: 1, rate: 1400, amount: 1400 },
      { description: "Border Crossing Fee", qty: 1, rate: 200, amount: 200 },
      { description: "Handling Charges", qty: 1, rate: 150, amount: 150 },
    ],
  },
  {
    id: "INV-2025-004",
    orderId: "ORD-2025-006",
    date: "2024-12-28",
    dueDate: "2025-01-28",
    status: "paid",
    subtotal: 5800,
    tax: 300,
    total: 6100,
    items: [
      { description: "Office Relocation — DIFC to Business Bay", qty: 1, rate: 4200, amount: 4200 },
      { description: "IT Equipment Handling", qty: 1, rate: 800, amount: 800 },
      { description: "Weekend Service Surcharge", qty: 1, rate: 500, amount: 500 },
      { description: "Insurance Coverage", qty: 1, rate: 300, amount: 300 },
    ],
  },
  {
    id: "INV-2025-005",
    orderId: "ORD-2025-005",
    date: "2025-01-08",
    dueDate: "2025-02-08",
    status: "overdue",
    subtotal: 7800,
    tax: 400,
    total: 8200,
    items: [
      { description: "International Moving — Dubai to London", qty: 1, rate: 6500, amount: 6500 },
      { description: "Customs Documentation", qty: 1, rate: 500, amount: 500 },
      { description: "Door-to-Door Premium", qty: 1, rate: 800, amount: 800 },
    ],
  },
  {
    id: "INV-2025-006",
    orderId: "ORD-2025-008",
    date: "2024-12-20",
    dueDate: "2025-01-20",
    status: "paid",
    subtotal: 900,
    tax: 50,
    total: 950,
    items: [
      { description: "Warehousing — 30-Day Storage (6,000 kg)", qty: 1, rate: 750, amount: 750 },
      { description: "Inventory Management Fee", qty: 1, rate: 150, amount: 150 },
    ],
  },
];
