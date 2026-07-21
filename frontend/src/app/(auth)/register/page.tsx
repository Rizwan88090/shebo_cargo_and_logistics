"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MdLocalShipping, MdSecurity, MdSpeed, MdCheckCircle } from "react-icons/md";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", terms: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { router.push("/login"); }, 1200);
  };

  return (
    <>
      <div className="auth-brand">
        <div className="auth-brand__shape auth-brand__shape--1" />
        <div className="auth-brand__shape auth-brand__shape--2" />
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="auth-brand__logo">Shebo Cargo</div>
        </motion.div>
        <motion.p className="auth-brand__tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Join thousands of businesses that trust Shebo Cargo for their logistics needs.
        </motion.p>
        <motion.div className="auth-brand__features" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="auth-brand__feature"><MdLocalShipping className="auth-brand__feature-icon" /> Book shipments online</div>
          <div className="auth-brand__feature"><MdSpeed className="auth-brand__feature-icon" /> Track in real-time</div>
          <div className="auth-brand__feature"><MdSecurity className="auth-brand__feature-icon" /> Manage invoices & payments</div>
          <div className="auth-brand__feature"><MdCheckCircle className="auth-brand__feature-icon" /> Save addresses for quick booking</div>
        </motion.div>
      </div>

      <div className="auth-form-wrapper">
        <motion.div className="auth-form-container" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="auth-form__title">Create Account</h1>
          <p className="auth-form__subtitle">Register to start booking shipments and managing your cargo.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-first">First Name</label>
                <input type="text" id="reg-first" className="form-input" placeholder="Ahmed" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-last">Last Name</label>
                <input type="text" id="reg-last" className="form-input" placeholder="Al Maktoum" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input type="email" id="reg-email" className="form-input" placeholder="you@example.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Phone Number</label>
              <input type="tel" id="reg-phone" className="form-input" placeholder="+971 50 123 4567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="auth-form__row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-pass">Password</label>
                <input type="password" id="reg-pass" className="form-input" placeholder="Min 6 characters" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                <input type="password" id="reg-confirm" className="form-input" placeholder="Re-enter password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
              </div>
            </div>

            <label className="auth-form__remember">
              <input type="checkbox" required checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} />
              I agree to the Terms of Service and Privacy Policy
            </label>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-form__footer">
            Already have an account? <Link href="/login">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
