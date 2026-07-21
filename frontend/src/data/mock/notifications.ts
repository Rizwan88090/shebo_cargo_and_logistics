export interface Notification {
  id: string;
  type: "order" | "payment" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const mockNotifications: Notification[] = [
  { id: "n1", type: "order", title: "Shipment Delivered", message: "Your order ORD-2024-001 has been delivered to Riyadh.", timestamp: "2 hours ago", read: false },
  { id: "n2", type: "payment", title: "Invoice Overdue", message: "Invoice INV-2025-005 for AED 8,200 is overdue. Please settle.", timestamp: "5 hours ago", read: false },
  { id: "n3", type: "order", title: "Shipment In Transit", message: "Order ORD-2024-002 is now in transit via sea freight to Doha.", timestamp: "1 day ago", read: false },
  { id: "n4", type: "system", title: "New Service Available", message: "We now offer International Moving services. Book today!", timestamp: "1 day ago", read: true },
  { id: "n5", type: "order", title: "Customs Clearance", message: "Order ORD-2024-003 has cleared customs at the Oman border.", timestamp: "2 days ago", read: true },
  { id: "n6", type: "payment", title: "Payment Received", message: "Payment of AED 2,450 for INV-2024-001 has been confirmed.", timestamp: "3 days ago", read: true },
  { id: "n7", type: "order", title: "Order Confirmed", message: "Your villa shifting booking ORD-2025-004 has been confirmed.", timestamp: "4 days ago", read: true },
  { id: "n8", type: "system", title: "Holiday Schedule", message: "Our offices will observe reduced hours during the UAE National Day.", timestamp: "5 days ago", read: true },
  { id: "n9", type: "payment", title: "Invoice Generated", message: "Invoice INV-2025-006 for AED 950 has been generated for your warehousing order.", timestamp: "6 days ago", read: true },
  { id: "n10", type: "order", title: "Order Cancelled", message: "Order ORD-2025-009 has been cancelled per your request. Refund processing.", timestamp: "1 week ago", read: true },
  { id: "n11", type: "system", title: "Profile Updated", message: "Your profile information has been successfully updated.", timestamp: "1 week ago", read: true },
  { id: "n12", type: "order", title: "Pickup Scheduled", message: "Pickup for ORD-2025-007 is scheduled for tomorrow morning.", timestamp: "1 week ago", read: true },
];
