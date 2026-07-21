"use client";

import { useState } from "react";
import { MdEdit, MdLock, MdSave, MdPerson } from "react-icons/md";
import { mockUser } from "@/data/mock/user";
import { changePassword } from "@/lib/auth";

export default function ProfilePage() {
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [profile, setProfile] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
    phone: mockUser.phone,
    company: mockUser.company,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [savedProfile, setSavedProfile] = useState(false);
  const [pw, setPw] = useState<{ loading: boolean; error: string | null; ok: boolean }>({
    loading: false,
    error: null,
    ok: false,
  });

  const handleSaveProfile = () => {
    setSavedProfile(true);
    setEditingProfile(false);
    setTimeout(() => setSavedProfile(false), 3000);
  };

  const handleChangePassword = async () => {
    setPw({ loading: false, error: null, ok: false });
    if (!passwords.current || !passwords.newPass) {
      setPw({ loading: false, error: "Please fill in all password fields.", ok: false });
      return;
    }
    if (passwords.newPass.length < 6) {
      setPw({ loading: false, error: "New password must be at least 6 characters.", ok: false });
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPw({ loading: false, error: "New passwords do not match.", ok: false });
      return;
    }
    setPw({ loading: true, error: null, ok: false });
    try {
      await changePassword(passwords.current, passwords.newPass);
      setPw({ loading: false, error: null, ok: true });
      setPasswords({ current: "", newPass: "", confirm: "" });
      setEditingPassword(false);
      setTimeout(() => setPw((p) => ({ ...p, ok: false })), 4000);
    } catch (err) {
      setPw({
        loading: false,
        error: err instanceof Error ? err.message : "Could not change password.",
        ok: false,
      });
    }
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">My Profile</h1>
        <p className="portal-page__subtitle">Manage your personal information and account security.</p>
      </div>

      {/* Avatar Section */}
      <div className="profile-avatar-section">
        <div className="profile-avatar">{mockUser.avatar}</div>
        <div>
          <p className="profile-avatar__name">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="profile-avatar__email">{profile.email}</p>
          <div className="profile-avatar__badge">
            <MdPerson style={{ fontSize: "0.85rem" }} />
            Verified Customer
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {savedProfile && (
        <div style={{
          background: "rgba(16,185,129,0.1)",
          border: "1.5px solid rgba(16,185,129,0.3)",
          borderRadius: "0.75rem",
          padding: "0.875rem 1.25rem",
          fontSize: "0.875rem",
          color: "#065f46",
          fontWeight: 600,
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          ✅ Profile updated successfully!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Profile Form */}
        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Personal Information</h2>
            {!editingProfile ? (
              <button className="btn btn--outline btn--sm" onClick={() => setEditingProfile(true)}>
                <MdEdit /> Edit
              </button>
            ) : (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn--outline btn--sm" onClick={() => setEditingProfile(false)}>
                  Cancel
                </button>
                <button className="btn btn--primary btn--sm" onClick={handleSaveProfile}>
                  <MdSave /> Save
                </button>
              </div>
            )}
          </div>
          <div className="panel__body">
            <div className="portal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-input"
                    value={profile.firstName}
                    disabled={!editingProfile}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    value={profile.lastName}
                    disabled={!editingProfile}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  value={profile.email}
                  disabled={!editingProfile}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  className="form-input"
                  value={profile.phone}
                  disabled={!editingProfile}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  className="form-input"
                  value={profile.company}
                  disabled={!editingProfile}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Account Stats */}
          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Account Info</h2>
            </div>
            <div className="panel__body">
              {[
                { label: "Member Since", value: new Date(mockUser.createdAt).toLocaleDateString("en-AE", { month: "long", year: "numeric" }) },
                { label: "Account Type", value: "Customer" },
                { label: "Customer ID", value: mockUser.id },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.55rem 0",
                    borderBottom: "1px solid var(--color-gray-100)",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "var(--color-gray-500)" }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: "var(--color-navy-800)" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Change Password */}
          <div className="panel">
            <div className="panel__header">
              <h2 className="panel__title">
                <MdLock style={{ verticalAlign: "middle", marginRight: "0.4rem" }} />
                Change Password
              </h2>
              {!editingPassword && (
                <button className="btn btn--outline btn--sm" onClick={() => setEditingPassword(true)}>
                  <MdEdit /> Change
                </button>
              )}
            </div>
            {editingPassword && (
              <div className="panel__body">
                <div className="portal-form">
                  {pw.error && (
                    <div style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: "0.5rem",
                      padding: "0.6rem 0.9rem",
                      fontSize: "0.82rem",
                      color: "#b91c1c",
                      marginBottom: "0.75rem",
                    }}>
                      {pw.error}
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Repeat new password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button className="btn btn--outline btn--sm" onClick={() => { setEditingPassword(false); setPw({ loading: false, error: null, ok: false }); }}>
                      Cancel
                    </button>
                    <button className="btn btn--primary btn--sm" onClick={handleChangePassword} disabled={pw.loading}>
                      <MdSave /> {pw.loading ? "Updating…" : "Update Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!editingPassword && (
              <div className="panel__body" style={{ paddingTop: 0 }}>
                {pw.ok ? (
                  <p style={{ fontSize: "0.82rem", color: "#047857", fontWeight: 600, margin: 0 }}>
                    ✅ Password changed successfully.
                  </p>
                ) : (
                  <p style={{ fontSize: "0.82rem", color: "var(--color-gray-400)", margin: 0 }}>
                    Use a strong, unique password.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
