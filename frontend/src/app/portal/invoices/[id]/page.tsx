"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MdArrowBack, MdDownload, MdPrint } from "react-icons/md";
import { mockInvoices } from "@/data/mock/invoices";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const invoice = mockInvoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="empty-state" style={{ paddingTop: "6rem" }}>
        <div className="empty-state__icon">🧾</div>
        <p className="empty-state__title">Invoice Not Found</p>
        <Link href="/portal/invoices" className="btn btn--primary" style={{ marginTop: "1.25rem" }}>
          <MdArrowBack /> Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Top Nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <Link href="/portal/invoices" className="btn btn--outline btn--sm">
          <MdArrowBack /> Invoices
        </Link>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn btn--outline btn--sm">
            <MdPrint /> Print
          </button>
          <button className="btn btn--primary btn--sm">
            <MdDownload /> Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Header Card */}
      <div className="invoice-header-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="invoice-company">Shebo Cargo & Logistics</p>
            <p className="invoice-meta">Dubai, United Arab Emirates &nbsp;•&nbsp; +971 4 123 4567</p>
            <p className="invoice-meta">info@shebocargo.com &nbsp;•&nbsp; www.shebocargo.com</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="invoice-number">{invoice.id}</p>
            <span className={`status-badge status-badge--${invoice.status}`} style={{ fontSize: "0.85rem", padding: "0.35rem 1rem" }}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="invoice-amounts-grid" style={{ marginTop: "1.5rem" }}>
          {[
            { label: "Invoice Date", value: new Date(invoice.date).toLocaleDateString("en-AE", { day: "numeric", month: "long", year: "numeric" }) },
            { label: "Due Date", value: new Date(invoice.dueDate).toLocaleDateString("en-AE", { day: "numeric", month: "long", year: "numeric" }) },
            { label: "Order Reference", value: invoice.orderId },
          ].map((item) => (
            <div key={item.label} className="invoice-amount-item">
              <div className="invoice-amount-label">{item.label}</div>
              <div className="invoice-amount-value" style={{ fontSize: "0.9rem" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Line Items */}
      <div className="panel" style={{ marginBottom: "1.5rem" }}>
        <div className="panel__header">
          <h2 className="panel__title">Line Items</h2>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table invoice-items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate (AED)</th>
                <th>Amount (AED)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.description}</td>
                  <td>{item.qty}</td>
                  <td>{item.rate.toLocaleString()}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{item.amount.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="invoice-total-row">
                <td colSpan={3} style={{ textAlign: "right" }}>Subtotal</td>
                <td style={{ textAlign: "right" }}>AED {invoice.subtotal.toLocaleString()}</td>
              </tr>
              <tr className="invoice-total-row">
                <td colSpan={3} style={{ textAlign: "right" }}>VAT (5%)</td>
                <td style={{ textAlign: "right" }}>AED {invoice.tax.toLocaleString()}</td>
              </tr>
              <tr style={{ background: "var(--color-navy-900)" }}>
                <td colSpan={3} style={{ textAlign: "right", fontWeight: 800, color: "#fff", fontSize: "1rem" }}>Total Due</td>
                <td style={{ textAlign: "right", fontWeight: 800, color: "var(--color-gold-400)", fontSize: "1.1rem" }}>
                  AED {invoice.total.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Info */}
      {invoice.status !== "paid" && (
        <div style={{
          background: invoice.status === "overdue" ? "rgba(239,68,68,0.05)" : "rgba(59,130,246,0.05)",
          border: `1.5px solid ${invoice.status === "overdue" ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)"}`,
          borderRadius: "0.875rem",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <div>
            <div style={{ fontWeight: 700, color: invoice.status === "overdue" ? "var(--color-error)" : "var(--color-info)", marginBottom: "0.25rem" }}>
              {invoice.status === "overdue" ? "⚠ Payment Overdue" : "💳 Payment Pending"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-gray-500)" }}>
              Amount due: <strong>AED {invoice.total.toLocaleString()}</strong>
            </div>
          </div>
          <button className="btn btn--gold">Pay Now</button>
        </div>
      )}
    </div>
  );
}
