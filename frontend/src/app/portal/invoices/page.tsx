"use client";

import { useState } from "react";
import Link from "next/link";
import { MdDownload, MdArrowForward, MdSearch } from "react-icons/md";
import { mockInvoices } from "@/data/mock/invoices";

const STATUS_FILTERS = ["all", "paid", "unpaid", "overdue"] as const;
const statusLabels: Record<string, string> = { all: "All", paid: "Paid", unpaid: "Unpaid", overdue: "Overdue" };

export default function InvoicesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockInvoices.filter((inv) => {
    const matchStatus = filter === "all" || inv.status === filter;
    const matchSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.orderId.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Invoices</h1>
        <p className="portal-page__subtitle">View, download, and manage all your billing records.</p>
      </div>

      <div className="panel">
        <div className="table-controls">
          <div className="table-controls__search">
            <MdSearch className="table-controls__search-icon" />
            <input
              type="text"
              placeholder="Search invoice or order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="table-controls__filter">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "filter-btn--active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {statusLabels[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="data-table-wrapper">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🧾</div>
              <p className="empty-state__title">No invoices found</p>
              <p className="empty-state__text">Try changing your filter.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id}>
                    <td className="data-table__id">{inv.id}</td>
                    <td>
                      <Link href={`/portal/orders/${inv.orderId}`} className="data-table__link" style={{ fontSize: "0.82rem" }}>
                        {inv.orderId}
                      </Link>
                    </td>
                    <td style={{ fontSize: "0.82rem" }}>
                      {new Date(inv.date).toLocaleDateString("en-AE", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ fontSize: "0.82rem", color: inv.status === "overdue" ? "var(--color-error)" : "inherit" }}>
                      {new Date(inv.dueDate).toLocaleDateString("en-AE", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--color-navy-700)" }}>
                      AED {inv.total.toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-badge status-badge--${inv.status}`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Link href={`/portal/invoices/${inv.id}`} className="btn btn--outline btn--sm">
                          View <MdArrowForward />
                        </Link>
                        <button className="btn btn--outline btn--sm btn--icon" title="Download PDF">
                          <MdDownload />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
