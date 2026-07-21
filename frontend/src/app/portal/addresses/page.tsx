"use client";

import { useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdLocationOn, MdClose, MdSave, MdCheck } from "react-icons/md";
import { mockAddresses, Address } from "@/data/mock/addresses";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<Partial<Address>>({
    label: "",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isDefault: false,
  });

  const openAddModal = () => {
    setEditingAddress(null);
    setForm({ label: "", fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", country: "", postalCode: "", isDefault: false });
    setShowModal(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setForm({ ...addr });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingAddress) {
      setAddresses((prev) => prev.map((a) => (a.id === editingAddress.id ? { ...a, ...form } as Address : a)));
    } else {
      const newAddr: Address = {
        id: `addr-${Date.now()}`,
        label: form.label || "New Address",
        fullName: form.fullName || "",
        phone: form.phone || "",
        addressLine1: form.addressLine1 || "",
        addressLine2: form.addressLine2,
        city: form.city || "",
        state: form.state,
        country: form.country || "",
        postalCode: form.postalCode || "",
        isDefault: form.isDefault || false,
      };
      setAddresses((prev) => [...prev, newAddr]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div>
      <div className="portal-page__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="portal-page__title">Saved Addresses</h1>
          <p className="portal-page__subtitle">Manage pickup and delivery addresses for faster booking.</p>
        </div>
        <button className="btn btn--primary" onClick={openAddModal}>
          <MdAdd /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="empty-state" style={{ background: "#fff", borderRadius: "1rem", border: "1px solid var(--color-gray-100)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", paddingTop: "4rem", paddingBottom: "4rem" }}>
          <div className="empty-state__icon">📍</div>
          <p className="empty-state__title">No saved addresses</p>
          <p className="empty-state__text">Add an address to speed up future bookings.</p>
          <button className="btn btn--primary" onClick={openAddModal} style={{ marginTop: "1.25rem" }}>
            <MdAdd /> Add Address
          </button>
        </div>
      ) : (
        <div className="address-cards">
          {addresses.map((addr) => (
            <div key={addr.id} className={`address-card ${addr.isDefault ? "address-card--default" : ""}`}>
              <div className="address-card__label-row">
                <MdLocationOn style={{ color: "var(--color-navy-500)", fontSize: "1rem" }} />
                <span className="address-card__label">{addr.label}</span>
                {addr.isDefault && (
                  <span className="address-card__default-badge">
                    <MdCheck style={{ fontSize: "0.75rem", verticalAlign: "middle" }} /> Default
                  </span>
                )}
              </div>
              <p className="address-card__name">{addr.fullName}</p>
              <p className="address-card__detail">{addr.addressLine1}</p>
              {addr.addressLine2 && <p className="address-card__detail">{addr.addressLine2}</p>}
              <p className="address-card__detail">
                {addr.city}{addr.state ? `, ${addr.state}` : ""}
              </p>
              <p className="address-card__detail">{addr.country} {addr.postalCode}</p>
              <p className="address-card__detail">📞 {addr.phone}</p>
              <div className="address-card__actions">
                <button className="btn btn--outline btn--sm" onClick={() => openEditModal(addr)}>
                  <MdEdit /> Edit
                </button>
                {!addr.isDefault && (
                  <button className="btn btn--outline btn--sm" onClick={() => handleSetDefault(addr.id)}>
                    Set Default
                  </button>
                )}
                <button
                  className="btn btn--danger btn--sm btn--icon"
                  onClick={() => handleDelete(addr.id)}
                  title="Delete address"
                  style={{ marginLeft: "auto" }}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__header">
              <h3 className="modal__title">{editingAddress ? "Edit Address" : "Add New Address"}</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}><MdClose /></button>
            </div>
            <div className="modal__body">
              <div className="portal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Label (e.g. Office, Home)</label>
                    <input
                      className="form-input"
                      placeholder="Office"
                      value={form.label || ""}
                      onChange={(e) => setForm({ ...form, label: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      placeholder="Ahmed Al Maktoum"
                      value={form.fullName || ""}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    placeholder="+971 50 000 0000"
                    value={form.phone || ""}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line 1</label>
                  <input
                    className="form-input"
                    placeholder="Building, Floor, Unit"
                    value={form.addressLine1 || ""}
                    onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line 2 (Optional)</label>
                  <input
                    className="form-input"
                    placeholder="Street, District"
                    value={form.addressLine2 || ""}
                    onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      className="form-input"
                      placeholder="Dubai"
                      value={form.city || ""}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      className="form-input"
                      placeholder="United Arab Emirates"
                      value={form.country || ""}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, color: "var(--color-gray-700)" }}>
                    <input
                      type="checkbox"
                      checked={form.isDefault || false}
                      onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    />
                    Set as default address
                  </label>
                </div>
              </div>
            </div>
            <div className="modal__footer">
              <button className="btn btn--outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={handleSave}>
                <MdSave /> {editingAddress ? "Save Changes" : "Add Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
