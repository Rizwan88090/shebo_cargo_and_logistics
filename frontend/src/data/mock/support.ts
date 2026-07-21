export interface SupportTicket {
  id: string;
  subject: string;
  category: "Billing" | "Delivery Delay" | "Damaged Cargo" | "Account Help" | "General Inquiry";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  description: string;
  replies: {
    id: string;
    sender: "user" | "agent";
    text: string;
    time: string;
  }[];
}

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "TCK-4812",
    subject: "Customs clearance delay at Jebel Ali",
    category: "Delivery Delay",
    priority: "high",
    status: "in_progress",
    createdAt: "2026-07-15",
    description: "My sea shipment ORD-2024-003 has been flagged under customs inspection for 3 days. Can you coordinate with the clearance officer?",
    replies: [
      {
        id: "rep-1",
        sender: "user",
        text: "Please verify if all duty payments are cleared from your end.",
        time: "July 15, 2026 10:24 AM",
      },
      {
        id: "rep-2",
        sender: "agent",
        text: "Hello Ahmed, we checked with our customs desk. They are verifying the HS codes for electronic items. All duties are paid. We expect release by tomorrow.",
        time: "July 15, 2026 02:40 PM",
      },
    ],
  },
  {
    id: "TCK-3291",
    subject: "Incorrect company billing name in invoice INV-2025-004",
    category: "Billing",
    priority: "medium",
    status: "resolved",
    createdAt: "2026-07-10",
    description: "Please update the invoice billing name to 'Al Maktoum Trading LLC' instead of 'Al Maktoum Group'.",
    replies: [
      {
        id: "rep-3",
        sender: "agent",
        text: "Dear Ahmed, we have updated the corporate details on your account profile and regenerated invoice INV-2025-004. You can download the new copy from the portal invoice section.",
        time: "July 11, 2026 09:15 AM",
      },
    ],
  },
];
