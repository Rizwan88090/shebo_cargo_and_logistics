"use client";

import { useState } from "react";
import Link from "next/link";
import { MdSearch, MdArrowForward, MdArrowBack } from "react-icons/md";
import { mockOrders, Order } from "@/data/mock/orders";

const STATUS_FILTERS = ["all", "pending", "processing", "in_transit", "customs", "delivered", "cancelled"] as const;

const statusLabels: Record<string, string> = {
  all: "All",
  pending: "Pending",
  processing: "Processing",
  in_transit: "In Transit",
  customs: "At Customs",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAGE_SIZE = 6;

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = mockOrders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.service.toLowerCase().includes(search.toLowerCase()) ||
      o.origin.toLowerCase().includes(search.toLowerCase()) ||
      o.destination.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (f: string) => {
    setStatusFilter(f);
    setPage(1);
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">My Orders</h1>
        <p className="portal-page__subtitle">Track, manage, and review all your shipment orders.</p>
      </div>

      <div className="panel">
        {/* Controls */}
        <div className="table-controls">
          <div className="table-controls__search">
            <MdSearch className="table-controls__search-icon" />
            <input
              type="text"
              placeholder="Search by order ID, tracking, service..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="table-controls__filter">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-btn ${statusFilter === f ? "filter-btn--active" : ""}`}
                onClick={() => handleFilter(f)}
              >
                {statusLabels[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="data-table-wrapper">
          {paginated.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📦</div>
              <p className="empty-state__title">No orders found</p>
              <p className="empty-state__text">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Service</th>
                  <th>Origin → Destination</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="data-table__id">{order.id}</div>
                      <div className="data-table__tracking">{order.trackingNumber}</div>
                    </td>
                    <td>{order.service}</td>
                    <td style={{ fontSize: "0.8rem" }}>
                      <div>{order.origin}</div>
                      <div style={{ color: "var(--color-gray-400)", marginTop: "0.1rem" }}>→ {order.destination}</div>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--color-gray-500)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-AE", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td>
                      <span className={`status-badge status-badge--${order.status}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--color-navy-700)" }}>
                      AED {order.amount.toLocaleString()}
                    </td>
                    <td>
                      <Link href={`/portal/orders/${order.id}`} className="btn btn--outline btn--sm">
                        Details <MdArrowForward />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} orders
            </span>
            <div className="pagination__btns">
              <button className="pagination__btn" onClick={() => setPage(page - 1)} disabled={page === 1}>
                <MdArrowBack />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pagination__btn ${p === page ? "pagination__btn--active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button className="pagination__btn" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                <MdArrowForward />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
