"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdDashboard,
  MdBarChart,
  MdSupportAgent,
  MdListAlt,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import "./admin.css";

const adminSidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/admin/analytics", label: "Analytics", icon: <MdBarChart /> },
  { href: "/support", label: "Support Tickets", icon: <MdSupportAgent /> },
  { href: "/admin/orders", label: "Manage Orders", icon: <MdListAlt /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    try {
      localStorage.removeItem("meridian_token");
      localStorage.removeItem("shebo_token");
    } catch {
      /* ignore */
    }
    router.push("/login");
  };

  return (
    <div className="adminLayout">
      {/* Sidebar */}
      <aside className={`adminSidebar ${sidebarOpen ? "adminSidebarOpen" : ""}`}>
        <div className="adminSidebarHeader">
          <Link href="/" className="adminLogo">
            Shebo Admin
          </Link>
          <button className="adminSidebarClose" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <MdClose />
          </button>
        </div>

        <nav className="adminNav">
          {adminSidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`adminNavLink ${
                pathname === link.href || pathname.startsWith(link.href + "/") ? "adminNavLinkActive" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <Link href="/" className="adminNavLink" style={{ color: "#ef4444" }}>
            <span><MdLogout /></span>
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile sidebar clickaway */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 199,
          }}
        />
      )}

      {/* Main Column */}
      <div className="adminMain">
        <header className="adminHeader">
          <button className="adminMenuBtn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <MdMenu />
          </button>

          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-navy-800)" }}>
            Control Center
          </h2>

          <div className="adminHeaderActions">
            <LanguageSwitch />
            <div className="adminUserMenu">
              <button
                className="adminAvatar"
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-label="Account menu"
                aria-expanded={userMenuOpen}
              >
                AD
              </button>
              {userMenuOpen && (
                <>
                  <div className="adminUserOverlay" onClick={() => setUserMenuOpen(false)} />
                  <div className="adminUserDropdown">
                    <div className="adminUserInfo">
                      <span className="adminUserName">Shebo Admin</span>
                      <span className="adminUserEmail">itxsheboo@gmail.com</span>
                    </div>
                    <button className="adminUserLogout" onClick={handleLogout}>
                      <MdLogout /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="adminContent">{children}</div>
      </div>
    </div>
  );
}
