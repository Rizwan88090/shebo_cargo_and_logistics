"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MdCheckCircle, MdLocalShipping, MdSecurity, MdSpeed } from "react-icons/md";
import { login, isAdmin } from "@/lib/auth";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push(isAdmin() ? "/admin/dashboard" : "/portal/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Left Brand Panel */}
      <div className="auth-brand">
        <div className="auth-brand__shape auth-brand__shape--1" />
        <div className="auth-brand__shape auth-brand__shape--2" />
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="auth-brand__logo">{siteConfig.name.split(" ")[0]} Cargo</div>
        </motion.div>
        <motion.p className="auth-brand__tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Your trusted logistics partner for worldwide cargo shipping and relocation services.
        </motion.p>
        <motion.div className="auth-brand__features" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="auth-brand__feature"><MdLocalShipping className="auth-brand__feature-icon" /> Real-time shipment tracking</div>
          <div className="auth-brand__feature"><MdSpeed className="auth-brand__feature-icon" /> Express delivery worldwide</div>
          <div className="auth-brand__feature"><MdSecurity className="auth-brand__feature-icon" /> Fully insured cargo protection</div>
          <div className="auth-brand__feature"><MdCheckCircle className="auth-brand__feature-icon" /> 24/7 customer support</div>
        </motion.div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-wrapper">
        <motion.div className="auth-form-container" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="auth-form__title">Welcome Back</h1>
          <p className="auth-form__subtitle">Sign in to your account to manage shipments, track orders, and view invoices.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input type="email" id="login-email" className="form-input" placeholder="you@example.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input type="password" id="login-password" className="form-input" placeholder="••••••••" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>

            <div className="auth-form__extras">
              <label className="auth-form__remember">
                <input type="checkbox" /> Remember me
              </label>
              <Link href="/login" className="auth-form__forgot">Forgot password?</Link>
            </div>

            {error && (
              <div style={{
                marginBottom: "1rem",
                padding: "0.75rem 1rem",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "0.5rem",
                fontSize: "0.85rem",
                color: "#b91c1c",
                textAlign: "center",
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>


          </form>
        </motion.div>
      </div>
    </>
  );
}
