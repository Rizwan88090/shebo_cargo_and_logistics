"use client";

import { useState, useEffect, useCallback } from "react";
import { MdTimeline, MdTrendingUp, MdEqualizer, MdAssessment } from "react-icons/md";
import { listAllOrders, ORDERS_UPDATED_EVENT, type Order } from "@/lib/orders";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("meridian_token") ?? undefined;
}

export default function AdminAnalyticsPage() {
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

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + (o.agreedRate || 0), 0);
  const delivered = orders.filter((o) => o.status === "delivered");
  const slaAccuracy = totalOrders ? Math.round((delivered.length / totalOrders) * 100) : 0;
  const avgRevenue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const avgTransit = delivered.length
    ? (
        delivered.reduce(
          (s, o) => s + Math.max(0, (new Date(o.updatedAt).getTime() - new Date(o.createdAt).getTime()) / 86400000),
          0,
        ) / delivered.length
      ).toFixed(1)
    : "0";

  // Monthly shipment volume (orders per month)
  const monthlyData = MONTHS.map((month, i) => ({
    month,
    shipments: orders.filter((o) => new Date(o.createdAt).getMonth() === i).length,
  }));

  // Top corridors (route → revenue + volume)
  const routeMap: Record<string, { revenue: number; volume: number }> = {};
  orders.forEach((o) => {
    const key = `${o.fromCity} → ${o.toCity}`;
    if (!routeMap[key]) routeMap[key] = { revenue: 0, volume: 0 };
    routeMap[key].revenue += o.agreedRate || 0;
    routeMap[key].volume += 1;
  });
  const topRoutes = Object.entries(routeMap)
    .map(([route, v]) => ({ route, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Line chart geometry
  const chartWidth = 600;
  const chartHeight = 180;
  const padding = 20;
  const pointsX = monthlyData.map((_, idx) => padding + (idx * (chartWidth - padding * 2)) / (monthlyData.length - 1));
  const maxShipments = Math.max(...monthlyData.map((d) => d.shipments));
  const minShipments = Math.min(...monthlyData.map((d) => d.shipments));
  const pointsY = monthlyData.map((d) => {
    const range = maxShipments - minShipments || 1;
    const heightRange = chartHeight - padding * 2;
    return chartHeight - padding - ((d.shipments - minShipments) / range) * heightRange;
  });
  const polylinePoints = pointsX.map((x, idx) => `${x},${pointsY[idx]}`).join(" ");

  return (
    <div>
      {/* Analytics KPI row */}
      <div className="stat-cards" style={{ marginBottom: "1.75rem" }}>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue">
            <MdTimeline />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__value">{slaAccuracy}%</div>
            <div className="stat-card__label">On-Time Delivery Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">
            <MdTrendingUp />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__value">{avgTransit} Days</div>
            <div className="stat-card__label">Avg. Transit Time</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--gold">
            <MdEqualizer />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__value">AED {avgRevenue.toLocaleString()}</div>
            <div className="stat-card__label">Avg. Revenue / Order</div>
          </div>
        </div>
      </div>

      {/* SVG Line Chart panel */}
      <div className="chartGrid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="chartCard">
          <div className="chartTitle">
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <MdAssessment /> Shipment Volume Timeline (Orders / Month)
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--color-navy-500)" }}>Year-to-date</span>
          </div>

          <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
            <svg className="lineChartSVG" viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="200" style={{ overflow: "visible" }}>
              {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
                const y = padding + r * (chartHeight - padding * 2);
                return <line key={idx} x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="var(--color-gray-100)" strokeWidth="1" strokeDasharray="4 4" />;
              })}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-gold-500)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--color-gold-500)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M ${pointsX[0]} ${chartHeight - padding} L ${polylinePoints} L ${pointsX[pointsX.length - 1]} ${chartHeight - padding} Z`}
                fill="url(#chartGrad)"
                style={{ transition: "opacity 1s ease", opacity: animate ? 1 : 0 }}
              />
              <polyline
                fill="none"
                stroke="var(--color-gold-500)"
                strokeWidth="3.5"
                points={polylinePoints}
                strokeDasharray="1000"
                strokeDashoffset={animate ? "0" : "1000"}
                style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
              />
              {pointsX.map((x, idx) => (
                <g key={idx} style={{ cursor: "pointer" }}>
                  <circle cx={x} cy={pointsY[idx]} r="5" fill="var(--color-navy-800)" stroke="var(--color-gold-500)" strokeWidth="2.5" />
                  <text x={x} y={pointsY[idx] - 10} textAnchor="middle" fill="var(--color-navy-600)" fontSize="9" fontWeight="700">
                    {monthlyData[idx].shipments}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          {totalOrders === 0 && (
            <p style={{ textAlign: "center", color: "var(--color-gray-400)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              No shipment data yet — the timeline fills in as orders are placed.
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Corridors volume & Routes table */}
      <div className="chartGrid" style={{ marginTop: "1.75rem" }}>
        <div className="chartCard">
          <div className="chartTitle">Top Billing Corridors</div>
          {topRoutes.length > 0 ? (
            <div className="horizontalBarList">
              {topRoutes.map((route, idx) => {
                const maxVal = Math.max(...topRoutes.map((r) => r.revenue), 1);
                const widthVal = animate ? `${(route.revenue / maxVal) * 100}%` : "0%";
                return (
                  <div key={idx} className="hBarRow">
                    <div className="hBarHeader">
                      <span>{route.route}</span>
                      <span>AED {route.revenue.toLocaleString()}</span>
                    </div>
                    <div className="hBarTrack">
                      <div className="hBarFill" style={{ width: widthVal }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "var(--color-gray-400)", fontSize: "0.85rem", padding: "2rem 0" }}>
              No routes yet.
            </p>
          )}
        </div>

        <div className="chartCard" style={{ display: "flex", flexDirection: "column" }}>
          <div className="chartTitle">Freight Route Efficiency</div>
          <div className="data-table-wrapper" style={{ flex: 1 }}>
            <table className="data-table" style={{ fontSize: "0.8rem" }}>
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topRoutes.length > 0 ? (
                  topRoutes.map((route, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 700 }}>{route.route}</td>
                      <td>{route.volume}</td>
                      <td>AED {route.revenue.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--color-gray-400)" }}>
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
