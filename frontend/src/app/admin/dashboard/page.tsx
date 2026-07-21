"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MdAttachMoney,
  MdLocalShipping,
  MdPeople,
  MdFlightTakeoff,
  MdArrowForward,
} from "react-icons/md";
import { listAllOrders, ORDERS_UPDATED_EVENT, type Order } from "@/lib/orders";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ACTIVE_STATUSES = ["processing", "in_transit", "customs"];
const SERVICE_COLORS = ["#3b82f6", "#d4a853", "#10b981", "#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#ec4899"];

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ");

function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("meridian_token") ?? undefined;
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [animate, setAnimate] = useState(false);

  const load = useCallback(() => {
    listAllOrders(getToken())
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  useEffect(() => {
    load();
    setAnimate(true);
    const handler = () => load();
    window.addEventListener(ORDERS_UPDATED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(ORDERS_UPDATED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [load]);

  // ——— Real KPIs (from actual orders) ———
  const totalRevenue = orders.reduce((s, o) => s + (o.agreedRate || 0), 0);
  const totalOrders = orders.length;
  const activeShipments = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;
  const activeClients = new Set(orders.map((o) => o.phone)).size;

  const stats = [
    { label: "Total Revenue", value: `AED ${totalRevenue.toLocaleString()}`, icon: <MdAttachMoney />, color: "gold" },
    { label: "Total Orders", value: totalOrders.toLocaleString(), icon: <MdLocalShipping />, color: "blue" },
    { label: "Active Clients", value: activeClients.toLocaleString(), icon: <MdPeople />, color: "green" },
    { label: "Active Shipments", value: activeShipments.toLocaleString(), icon: <MdFlightTakeoff />, color: "cyan" },
  ];

  // ——— Monthly revenue (this year, from orders) ———
  const monthlyRevenueData = MONTHS.map((month, i) => ({
    month,
    revenue: orders
      .filter((o) => new Date(o.createdAt).getMonth() === i)
      .reduce((s, o) => s + (o.agreedRate || 0), 0),
  }));
  const maxRevenue = Math.max(1, ...monthlyRevenueData.map((d) => d.revenue));

  // ——— Orders by service (cargo type) ———
  const serviceCounts: Record<string, number> = {};
  orders.forEach((o) => {
    serviceCounts[o.cargoType] = (serviceCounts[o.cargoType] || 0) + 1;
  });
  const serviceShareData = Object.entries(serviceCounts).map(([service, count], i) => ({
    service,
    percentage: totalOrders ? Math.round((count / totalOrders) * 100) : 0,
    color: SERVICE_COLORS[i % SERVICE_COLORS.length],
  }));

  let accumulatedPercent = 0;
  const gradientParts = serviceShareData.map((d) => {
    const start = accumulatedPercent;
    accumulatedPercent += d.percentage;
    return `${d.color} ${start}% ${accumulatedPercent}%`;
  });
  const conicGradientValue = serviceShareData.length
    ? `conic-gradient(${gradientParts.join(", ")})`
    : "conic-gradient(var(--color-gray-200) 0% 100%)";

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      {/* KPI Stats Grid */}
      <div className="stat-cards" style={{ marginBottom: "1.75rem" }}>
        {stats.map((s, idx) => (
          <div className="stat-card" key={idx}>
            <div className={`stat-card__icon stat-card__icon--${s.color}`}>{s.icon}</div>
            <div className="stat-card__info">
              <div className="stat-card__value" style={{ fontSize: "1.45rem" }}>{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="chartGrid">
        {/* Revenue Bar Chart */}
        <div className="chartCard">
          <div className="chartTitle">
            <span>Revenue Breakdown (Monthly)</span>
            <span style={{ fontSize: "0.78rem", color: "var(--color-gold-600)" }}>AED</span>
          </div>

          <div className="barChartContainer">
            {monthlyRevenueData.map((data, idx) => {
              const heightPercent = animate && data.revenue > 0 ? `${(data.revenue / maxRevenue) * 100}%` : "0%";
              return (
                <div key={idx} className="barCol">
                  <div className="barTrack">
                    <div
                      className="barFill"
                      style={{ height: heightPercent }}
                      data-value={`AED ${data.revenue.toLocaleString()}`}
                    />
                  </div>
                  <span className="barLabel">{data.month}</span>
                </div>
              );
            })}
          </div>
          {totalOrders === 0 && (
            <p style={{ textAlign: "center", color: "var(--color-gray-400)", fontSize: "0.85rem", marginTop: "0.75rem" }}>
              No revenue yet — data appears as orders come in.
            </p>
          )}
        </div>

        {/* Service Type Donut Chart */}
        <div className="chartCard">
          <div className="chartTitle">Orders by Service</div>
          <div className="donutChartWrapper">
            <div className="donutCircle" style={{ background: conicGradientValue }}>
              <div className="donutInner">
                <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--color-navy-800)" }}>
                  {totalOrders}
                </span>
                <span style={{ fontSize: "0.65rem", color: "var(--color-gray-400)", fontWeight: 700 }}>ORDERS</span>
              </div>
            </div>

            <div className="donutLegends">
              {serviceShareData.length > 0 ? (
                serviceShareData.map((d, i) => (
                  <div key={i} className="legendItem">
                    <span className="legendColor" style={{ backgroundColor: d.color }} />
                    <span>
                      {d.service} ({d.percentage}%)
                    </span>
                  </div>
                ))
              ) : (
                <span style={{ fontSize: "0.8rem", color: "var(--color-gray-400)" }}>No orders yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: recent orders & activity */}
      <div className="dashboard-grid" style={{ marginTop: "1.75rem" }}>
        {/* Recent orders table */}
        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Recent Customer Orders</h2>
            <Link href="/admin/orders" className="panel__action">
              Manage orders <MdArrowForward style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Client</th>
                  <th>Route</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="data-table__id">{o.orderNumber}</td>
                      <td style={{ fontWeight: 600 }}>{o.fullName}</td>
                      <td style={{ fontSize: "0.8rem" }}>
                        {o.fromCity} → {o.toCity}
                      </td>
                      <td style={{ fontWeight: 700, color: "var(--color-navy-700)" }}>
                        AED {o.agreedRate.toLocaleString()}
                      </td>
                      <td>
                        <span className={`status-badge status-badge--${o.status}`}>{label(o.status)}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--color-gray-400)" }}>
                      No orders yet — new orders placed on the Order page will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity log */}
        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Security & Action Logs</h2>
          </div>
          <div className="panel__body" style={{ padding: "2.5rem 1.5rem", textAlign: "center", color: "var(--color-gray-400)", fontSize: "0.85rem" }}>
            No recent activity yet.
          </div>
        </div>
      </div>
    </div>
  );
}
