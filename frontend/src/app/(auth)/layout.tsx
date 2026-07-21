import type { Metadata } from "next";
import "./auth.css";

export const metadata: Metadata = {
  title: "Account | Shebo Cargo & Logistics",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="auth-layout">{children}</div>;
}
