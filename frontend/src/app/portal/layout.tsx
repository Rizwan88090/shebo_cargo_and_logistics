"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdLocalShipping, MdListAlt, MdLocationOn, MdReceipt, MdNotifications, MdPerson, MdBookmark, MdLogout, MdMenu, MdClose, MdSearch } from "react-icons/md";
import { mockUser } from "@/data/mock/user";
import { mockNotifications } from "@/data/mock/notifications";
import "./portal.css";

const sidebarLinks = [
  { href: "/portal/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/portal/book-shipment", label: "Book Shipment", icon: <MdLocalShipping /> },
  { href: "/portal/orders", label: "My Orders", icon: <MdListAlt /> },
  { href: "/portal/tracking", label: "Tracking", icon: <MdLocationOn /> },
  { href: "/portal/invoices", label: "Invoices", icon: <MdReceipt /> },
  { href: "/portal/notifications", label: "Notifications", icon: <MdNotifications /> },
  { href: "/portal/profile", label: "Profile", icon: <MdPerson /> },
  { href: "/portal/addresses", label: "Saved Addresses", icon: <MdBookmark /> },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="portal">
      {/* Sidebar */}
      <aside className={`portal__sidebar ${sidebarOpen ? "portal__sidebar--open" : ""}`}>
        <div className="portal__sidebar-header">
          <Link href="/" className="portal__logo">Shebo Cargo</Link>
          <button className="portal__sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><MdClose /></button>
        </div>

        <nav className="portal__nav">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`portal__nav-link ${pathname === link.href || pathname.startsWith(link.href + "/") ? "portal__nav-link--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="portal__nav-icon">{link.icon}</span>
              <span>{link.label}</span>
              {link.label === "Notifications" && unreadCount > 0 && (
                <span className="portal__nav-badge">{unreadCount}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="portal__sidebar-footer">
          <Link href="/" className="portal__nav-link portal__nav-link--logout">
            <span className="portal__nav-icon"><MdLogout /></span>
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="portal__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="portal__main">
        {/* Top bar */}
        <header className="portal__header">
          <button className="portal__menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <MdMenu />
          </button>

          <div className="portal__search">
            <MdSearch className="portal__search-icon" />
            <input type="text" placeholder="Search orders, tracking..." className="portal__search-input" />
          </div>

          <div className="portal__header-actions">
            <Link href="/portal/notifications" className="portal__header-notif">
              <MdNotifications />
              {unreadCount > 0 && <span className="portal__header-notif-dot" />}
            </Link>

            <div className="portal__header-user">
              <div className="portal__header-avatar">{mockUser.avatar}</div>
              <div className="portal__header-info">
                <span className="portal__header-name">{mockUser.firstName}</span>
                <span className="portal__header-role">Customer</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="portal__content">
          {children}
        </div>
      </div>
    </div>
  );
}
