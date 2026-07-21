export interface RevenueDataPoint {
  month: string;
  revenue: number; // AED
  shipments: number;
}

export interface ServiceSharePoint {
  service: string;
  percentage: number;
  color: string;
}

export interface RouteVolumePoint {
  route: string;
  volume: number; // Tons
  revenue: number; // AED
}

export const adminKPIs = {
  totalRevenue: 2845000, // AED
  totalOrders: 14820,
  activeUsers: 3450,
  activeShipments: 842,
  revenueGrowth: "+12.4%",
  ordersGrowth: "+8.2%",
  usersGrowth: "+18.1%",
  shipmentsGrowth: "+14.5%",
};

export const monthlyRevenueData: RevenueDataPoint[] = [
  { month: "Jan", revenue: 180000, shipments: 920 },
  { month: "Feb", revenue: 210000, shipments: 1100 },
  { month: "Mar", revenue: 245000, shipments: 1250 },
  { month: "Apr", revenue: 230000, shipments: 1180 },
  { month: "May", revenue: 290000, shipments: 1420 },
  { month: "Jun", revenue: 320000, shipments: 1600 },
  { month: "Jul", revenue: 360000, shipments: 1850 },
  { month: "Aug", revenue: 340000, shipments: 1720 },
  { month: "Sep", revenue: 380000, shipments: 1900 },
  { month: "Oct", revenue: 410000, shipments: 2100 },
  { month: "Nov", revenue: 450000, shipments: 2300 },
  { month: "Dec", revenue: 520000, shipments: 2750 },
];

export const serviceShareData: ServiceSharePoint[] = [
  { service: "Air Cargo", percentage: 35, color: "#3b82f6" },
  { service: "Sea Cargo", percentage: 40, color: "#06b6d4" },
  { service: "Land Cargo", percentage: 15, color: "#f59e0b" },
  { service: "Villa Shifting", percentage: 7, color: "#10b981" },
  { service: "Office Relocation", percentage: 3, color: "#8b5cf6" },
];

export const topRoutesData: RouteVolumePoint[] = [
  { route: "Dubai ↔ Riyadh", volume: 1450, revenue: 420000 },
  { route: "Dubai ↔ London", volume: 820, revenue: 580000 },
  { route: "Dubai ↔ Mumbai", volume: 2100, revenue: 310000 },
  { route: "Dubai ↔ Doha", volume: 680, revenue: 195000 },
  { route: "Dubai ↔ Singapore", volume: 950, revenue: 480000 },
];

export const recentAdminActivities = [
  { time: "10 mins ago", event: "New Corporate Partnership Request", details: "Aramco Logistics requested credit terms approval." },
  { time: "25 mins ago", event: "Customs Hold Released", details: "ORD-2024-003 cleared the Oman border checkpoint." },
  { time: "1 hour ago", event: "High Value Order Booked", details: "Sea Freight cargo (24 tons) booked for Dublin corridor." },
  { time: "3 hours ago", event: "Support Ticket Resolved", details: "TCK-3291 billing details update completed." },
  { time: "5 hours ago", event: "System Alert: Server Load", details: "Live tracking API load spike resolved successfully." },
];
