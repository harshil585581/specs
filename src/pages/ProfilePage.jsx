import React, { useEffect, useMemo, useState } from "react";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";
import FooterOne from "../components/FooterOne";
import BottomFooter from "../components/BottomFooter";

const PROFILE_API = (process.env.REACT_APP_API_BASE || "") + "/api/profile";
const WISHLIST_API = (process.env.REACT_APP_API_BASE || "") + "/api/wishlist";
const mkId = () => Math.random().toString(36).slice(2);

/* ---------------- helpers ---------------- */
const authHeader = () => {
  const t = localStorage.getItem("access_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

/* profile endpoints */
async function apiGetMe() {
  const res = await fetch(`${PROFILE_API}/me/`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}
async function apiUpdateMe(payload) {
  const res = await fetch(`${PROFILE_API}/update/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Update failed");
  return data;
}
async function rxList() {
  const res = await fetch(`${PROFILE_API}/prescriptions/`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to load prescriptions");
  return res.json();
}
async function rxCreate(payload) {
  const res = await fetch(`${PROFILE_API}/prescriptions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Create failed");
  return data;
}
async function rxDelete(id) {
  const res = await fetch(`${PROFILE_API}/prescriptions/${id}/`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Delete failed");
  return data;
}

/* wishlist endpoints */
async function wlList() {
  const res = await fetch(`${WISHLIST_API}/items/`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to load wishlist");
  return res.json();
}
async function wlDeleteByItemId(wishlistItemId) {
  const res = await fetch(`${WISHLIST_API}/items/${wishlistItemId}/`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Delete failed");
  return data;
}

/* ---------------- Component ---------------- */
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    newPassword: "",
  });

  // --------- ORDERS (dummy) ----------
  const [orders] = useState([
    {
      id: "1320599840",
      orderDate: new Date("2025-10-05"),
      deliveredOn: new Date("2025-10-08"),
      totalPrice: 0,
      item: {
        title: "John Jacobs Eyeglasses",
        addOns: "+ Hydrophobic Anti-Glare",
        img: "./assets/images/products/spec1.png",
        policyNote: "Refund cannot be taken for this product as per our policy",
        returnOrExchangeWindow: "Exchange your product until 28 Oct 2025",
      },
      power: {
        label: "Harshil",
        left: { sph: -5.0, cyl: -0.75, axis: 170, pd: 32 },
        right: { sph: -3.5, cyl: -1.25, axis: 20, pd: 30 },
      },
    },
    {
      id: "1312335002",
      orderDate: new Date("2025-06-16"),
      deliveredOn: new Date("2025-06-17"),
      totalPrice: 0,
      item: {
        title: "Vincent Chase Eyeglasses",
        addOns: "+ Bluecut Fully Loaded Anti Glare Thin Lens",
        img: "https://via.placeholder.com/380x240?text=Frame",
        policyNote: "Return window closed on 17 Jul 2025",
      },
      power: {
        label: "Harshil",
        left: { sph: -5.0, cyl: -0.75, axis: 170, pd: 30.5 },
        right: { sph: -3.5, cyl: -1.25, axis: 20, pd: 30.5 },
      },
    },
  ]);

  // --------- PRESCRIPTIONS ----------
  const [rxItems, setRxItems] = useState([]);
  const [loadingRx, setLoadingRx] = useState(true);
  const [rxErr, setRxErr] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newRx, setNewRx] = useState({
    name: "HARSHIL",
    powerType: "SINGLE VISION",
    right: { spherical: "", cylindrical: "", axis: "", ap: "", pd: "" },
    left: { spherical: "", cylindrical: "", axis: "", ap: "", pd: "" },
  });

  // Confirm delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rxToDelete, setRxToDelete] = useState(null);

  // --------- WISHLIST ----------
  const [wlItems, setWlItems] = useState([]); // [{id, spectacle:{...}}]
  const [loadingWl, setLoadingWl] = useState(false);
  const [wlErr, setWlErr] = useState("");

  // load profile + prescriptions + wishlist
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingProfile(true);
        const me = await apiGetMe();
        if (!mounted) return;
        setForm({
          username: me.username || "",
          email: me.email || "",
          phone: me.phone || "",
          newPassword: "",
        });
      } catch (e) {
        console.error(e);
        setSaveErr("Could not load your profile. Please log in again.");
      } finally {
        mounted && setLoadingProfile(false);
      }
    })();
    (async () => {
      try {
        setLoadingRx(true);
        const data = await rxList();
        if (!mounted) return;
        setRxItems(data.items || []);
      } catch (e) {
        console.error(e);
        setRxErr("Could not load prescriptions.");
      } finally {
        mounted && setLoadingRx(false);
      }
    })();
    (async () => {
      try {
        setLoadingWl(true);
        const data = await wlList();
        if (!mounted) return;
        setWlItems(data.items || []);
      } catch (e) {
        console.error(e);
        setWlErr("Could not load wishlist.");
      } finally {
        mounted && setLoadingWl(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };
  const onPhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((p) => ({ ...p, phone: digits }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveErr("");
    setSaveMsg("");

    if (!form.username.trim()) return setSaveErr("Username is required.");
    if (!form.email.trim()) return setSaveErr("Email is required.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      return setSaveErr("Enter a valid email address.");
    if (!/^\d{10}$/.test(form.phone))
      return setSaveErr("Phone must be a 10-digit number.");

    try {
      setSaving(true);
      await apiUpdateMe({
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        newPassword: form.newPassword.trim() || undefined,
      });
      setSaveMsg("Profile updated successfully.");
      setForm((p) => ({ ...p, newPassword: "" }));
    } catch (err) {
      console.error(err);
      setSaveErr(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // PRESCRIPTIONS delete (with confirm)
  const askDelete = (rx) => {
    setRxToDelete(rx);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!rxToDelete) return;
    try {
      await rxDelete(rxToDelete.id);
      setRxItems((l) => l.filter((x) => x.id !== rxToDelete.id));
    } catch (err) {
      setRxErr(err.message || "Failed to delete.");
    } finally {
      setShowDeleteModal(false);
      setRxToDelete(null);
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRxToDelete(null);
  };

  const [powerOpenMap, setPowerOpenMap] = useState({});
  const togglePower = (orderId) =>
    setPowerOpenMap((m) => ({ ...m, [orderId]: !m[orderId] }));

  const maskedPwd = useMemo(() => "••••••••••", []);
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    window.location.href = "/account";
  };

  const fmtShort = (d) =>
    d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  const fmtFull = (d) =>
    d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  // WISHLIST remove
  const removeFromWishlist = async (wishlistItemId) => {
    try {
      await wlDeleteByItemId(wishlistItemId);
      setWlItems((prev) => prev.filter((x) => x.id !== wishlistItemId));
    } catch (e) {
      console.error(e);
      setWlErr("Failed to remove item.");
    }
  };

  return (
    <>
      <Preloader />
      <ScrollToTop smooth color="#299E60" />
      <ColorInit color={false} />
      <HeaderOne />

      <div className="profile-shell account-screen">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="side-list">
            <li
              className={`side-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveTab("orders")}
            >
              MY ORDERS
            </li>
            <li
              className={`side-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveTab("profile")}
            >
              ACCOUNT INFORMATION
            </li>
            <li
              className={`side-item ${activeTab === "prescription" ? "active" : ""}`}
              onClick={() => setActiveTab("prescription")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && setActiveTab("prescription")
              }
            >
              MY PRESCRIPTIONS
            </li>
            <li
              className={`side-item ${activeTab === "wishlist" ? "active" : ""}`}
              onClick={() => setActiveTab("wishlist")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveTab("wishlist")}
            >
              MY WISHLIST
            </li>
            <li className="side-item logout" onClick={logout} role="button" tabIndex={0}>
              LOGOUT
            </li>
          </ul>
        </aside>

        {/* Main */}
        <main className="main">
          {/* PROFILE */}
          {activeTab === "profile" && (
            <form onSubmit={handleSave} className="card" noValidate>
              <h1 className="page-title">Edit Account Information</h1>
              <h2 className="section-title">Account Information</h2>

              {loadingProfile ? (
                <p>Loading your profile…</p>
              ) : (
                <>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        autoComplete="username"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="grid-2 mt-20">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={onPhoneChange}
                        inputMode="numeric"
                        placeholder="Enter 10-digit phone"
                        autoComplete="tel"
                        maxLength={10}
                      />
                    </div>

                    <div className="form-group">
                      <label>New Password (optional)</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        placeholder="Enter new password to change"
                      />
                    </div>
                  </div>

                  {saveErr && (
                    <div style={{ color: "#b91c1c", marginTop: 10, fontWeight: 600 }}>
                      {saveErr}
                    </div>
                  )}
                  {saveMsg && (
                    <div style={{ color: "#166534", marginTop: 10, fontWeight: 600 }}>
                      {saveMsg}
                    </div>
                  )}

                  <hr className="divider" />
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving…" : "Save & Continue"}
                  </button>
                </>
              )}
            </form>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="orders-scope">
              <div className="ord-wrap">
                {orders.map((o) => (
                  <div className="ord-card" key={o.id}>
                    <div className="ord-top">
                      <div className="ord-meta">
                        <span className="ord-muted">
                          Order ID: <strong>{o.id}</strong>
                        </span>
                        <span className="ord-muted">
                          Order Date: <strong>{fmtShort(o.orderDate)}</strong>
                        </span>
                      </div>
                      <div className="ord-muted">
                        Total Price: <strong>₹{o.totalPrice}</strong>
                      </div>
                    </div>

                    <div className="ord-delivered">
                      <span className="ord-dot" /> Delivered {fmtFull(o.deliveredOn)}
                    </div>

                    <div className="ord-item">
                      <img className="ord-thumb" src={o.item.img} alt="" />
                      <div className="ord-info">
                        <div className="ord-title">{o.item.title}</div>
                        <div className="ord-addons">{o.item.addOns}</div>
                        {o.item.returnOrExchangeWindow && (
                          <div className="ord-policy">{o.item.returnOrExchangeWindow}</div>
                        )}
                        {o.item.policyNote && (
                          <div className="ord-mini">{o.item.policyNote}</div>
                        )}
                      </div>
                    </div>

                    <div className="ord-actions">
                      <button className="ord-btn-outline" type="button">Order Details</button>
                      <button
                        className="ord-btn-outline ord-btn-power"
                        onClick={() => togglePower(o.id)}
                        type="button"
                      >
                        Power Submitted {powerOpenMap[o.id] ? "▲" : "▼"}
                      </button>
                    </div>

                    {powerOpenMap[o.id] && (
                      <div className="ord-power">
                        <div className="ord-power-h">Power Submitted</div>

                        <div className="ord-table ord-table-compact">
                          <div className="ord-row ord-th ord-three">
                            <div className="ord-col ord-eyeLabel">EYE</div>
                            <div className="ord-col ord-center">RIGHT EYE</div>
                            <div className="ord-col ord-center">LEFT EYE</div>
                          </div>

                          <div className="ord-row ord-three">
                            <div className="ord-col ord-eyeLabel wrap">SPHERICAL</div>
                            <div className="ord-col ord-center">{formatNum(o.power.right.sph)}</div>
                            <div className="ord-col ord-center">{formatNum(o.power.left.sph)}</div>
                          </div>

                          <div className="ord-row ord-three">
                            <div className="ord-col ord-eyeLabel wrap">CYLINDRICAL</div>
                            <div className="ord-col ord-center">{formatNum(o.power.right.cyl)}</div>
                            <div className="ord-col ord-center">{formatNum(o.power.left.cyl)}</div>
                          </div>

                          <div className="ord-row ord-three">
                            <div className="ord-col ord-eyeLabel">AXIS</div>
                            <div className="ord-col ord-center">{o.power.right.axis}</div>
                            <div className="ord-col ord-center">{o.power.left.axis}</div>
                          </div>

                          <div className="ord-row ord-three">
                            <div className="ord-col ord-eyeLabel">AP</div>
                            <div className="ord-col ord-center">-</div>
                            <div className="ord-col ord-center">-</div>
                          </div>

                          <div className="ord-row ord-three">
                            <div className="ord-col ord-eyeLabel">PD</div>
                            <div className="ord-col ord-center">{o.power.right.pd}</div>
                            <div className="ord-col ord-center">{o.power.left.pd}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRESCRIPTIONS */}
          {activeTab === "prescription" && (
            <div className="card">
              <div className="flex-between mb-16">
                <h1 className="page-title m-0">My Saved Prescriptions</h1>
                <button className="btn-outline" onClick={() => setShowAdd((v) => !v)} type="button">
                  {showAdd ? "Close" : "+ Add Prescription"}
                </button>
              </div>

              {showAdd && (
                <div className="add-section">
                  <h3 className="add-title">Add New Prescription</h3>
                  {rxErr && <div className="error">{rxErr}</div>}

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setRxErr("");
                      if (newRx.right.spherical === "" || newRx.left.spherical === "") {
                        setRxErr("Please enter Spherical values for both eyes.");
                        return;
                      }
                      try {
                        await rxCreate(newRx);
                        const data = await rxList();
                        setRxItems(data.items || []);
                        setNewRx({
                          name: "HARSHIL",
                          powerType: "SINGLE VISION",
                          right: { spherical: "", cylindrical: "", axis: "", ap: "", pd: "" },
                          left: { spherical: "", cylindrical: "", axis: "", ap: "", pd: "" },
                        });
                        setShowAdd(false);
                      } catch (err) {
                        setRxErr(err.message || "Failed to save prescription.");
                      }
                    }}
                  >
                    <div className="grid-2">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          value={newRx.name}
                          onChange={(e) =>
                            setNewRx((p) => ({ ...p, name: e.target.value }))
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Power Type</label>
                        <select
                          value={newRx.powerType}
                          onChange={(e) =>
                            setNewRx((p) => ({ ...p, powerType: e.target.value }))
                          }
                        >
                          <option>SINGLE VISION</option>
                          <option>BIFOCAL</option>
                          <option>PROGRESSIVE</option>
                          <option>COMPUTER</option>
                        </select>
                      </div>
                    </div>

                    <div className="rx-form-table">
                      <div className="rx-row rx-th">
                        <div className="col eye">FIELD</div>
                        <div className="col">RIGHT</div>
                        <div className="col">LEFT</div>
                      </div>

                      {["spherical", "cylindrical", "axis", "ap", "pd"].map((field) => (
                        <div className="rx-row" key={field}>
                          <div className="col eye eye-label">{field.toUpperCase()}</div>
                          <div className="col">
                            <input
                              type="text"
                              value={newRx.right[field]}
                              placeholder={
                                field === "spherical" || field === "cylindrical" ? "-3.50" : ""
                              }
                              onChange={(e) =>
                                setNewRx((p) => ({
                                  ...p,
                                  right: { ...p.right, [field]: e.target.value },
                                }))
                              }
                            />
                          </div>
                          <div className="col">
                            <input
                              type="text"
                              value={newRx.left[field]}
                              placeholder={
                                field === "spherical" || field === "cylindrical" ? "-5.00" : ""
                              }
                              onChange={(e) =>
                                setNewRx((p) => ({
                                  ...p,
                                  left: { ...p.left, [field]: e.target.value },
                                }))
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="add-actions">
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => {
                          setNewRx({
                            name: "HARSHIL",
                            powerType: "SINGLE VISION",
                            right: { spherical: "", cylindrical: "", axis: "", ap: "", pd: "" },
                            left: { spherical: "", cylindrical: "", axis: "", ap: "", pd: "" },
                          });
                          setShowAdd(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loadingRx ? (
                <p>Loading prescriptions…</p>
              ) : rxItems.length === 0 ? (
                <p>You have no saved prescriptions yet.</p>
              ) : (
                <div className="rx-grid">
                  {rxItems.map((rx) => (
                    <div className="rx-card" key={rx.id}>
                      <div className="rx-head">
                        <div className="rx-line">
                          <span className="rx-muted">NAME:</span>{" "}
                          <strong>{rx.name || "—"}</strong>
                        </div>
                        <div className="rx-line">
                          <span className="rx-muted">POWER TYPE:</span>{" "}
                          <strong>{rx.powerType}</strong>
                        </div>
                        <div className="rx-created">
                          Created{" "}
                          {new Date(rx.createdAt).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="rx-table">
                        <div className="rx-row rx-th">
                          <div className="col eye">EYE</div>
                          <div className="col">RIGHT EYE</div>
                          <div className="col">LEFT EYE</div>
                        </div>
                        <div className="rx-row">
                          <div className="col eye eye-label">SPHERICAL</div>
                          <div className="col value">{formatNum(rx.right.spherical)}</div>
                          <div className="col value">{formatNum(rx.left.spherical)}</div>
                        </div>
                        <div className="rx-row">
                          <div className="col eye eye-label">CYLINDRICAL</div>
                          <div className="col value">{formatNum(rx.right.cylindrical)}</div>
                          <div className="col value">{formatNum(rx.left.cylindrical)}</div>
                        </div>
                        <div className="rx-row">
                          <div className="col eye eye-label">AXIS</div>
                          <div className="col value">{rx.right.axis}</div>
                          <div className="col value">{rx.left.axis}</div>
                        </div>
                        <div className="rx-row">
                          <div className="col eye eye-label">AP</div>
                          <div className="col value">{rx.right.ap}</div>
                          <div className="col value">{rx.left.ap}</div>
                        </div>
                        <div className="rx-row">
                          <div className="col eye eye-label">PD</div>
                          <div className="col value">{rx.right.pd}</div>
                          <div className="col value">{rx.left.pd}</div>
                        </div>
                      </div>

                      <div className="flex-between mt-10">
                        <span />
                        <button
                          className="btn-primary"
                          onClick={() => askDelete(rx)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="card">
              <h1 className="page-title m-0" style={{ marginBottom: 16 }}>
                My Wishlist
              </h1>

              {wlErr && (
                <div style={{ color: "#b91c1c", marginBottom: 12, fontWeight: 600 }}>
                  {wlErr}
                </div>
              )}

              {loadingWl ? (
                <p>Loading wishlist…</p>
              ) : wlItems.length === 0 ? (
                <p>Your wishlist is empty.</p>
              ) : (
                <div className="cart-table border border-gray-100 rounded-8">
                  <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                    <table className="table rounded-8 overflow-hidden" style={{minWidth:"100%"}}>
                      <thead>
                        <tr className="border-bottom border-neutral-100">
                          <th className="h6 mb-0 text-lg fw-bold px-40 py-32" style={{textAlign:"center"}}>
                            Product Name
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {wlItems.map((row) => {
                          const p = row.spectacle;
                          return (
                            <tr key={row.id}>
                              <td className="px-40 py-32">
                                <div className="table-product d-flex align-items-center gap-24 flex-wrap">
                                  <a
                                    href={`/product-details-two?id=${p.id}`}
                                    className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                                  >
                                    {p.image1 ? (
                                      <img src={p.image1} alt={p.name} />
                                    ) : (
                                      <div
                                        style={{
                                          width: 120,
                                          height: 90,
                                          background: "#f3f4f6",
                                          borderRadius: 8,
                                        }}
                                      />
                                    )}
                                  </a>

                                  <div className="table-product__content text-start">
                                    <h6 className="title text-lg fw-semibold mb-8">
                                      <a
                                        href={`/product-details?id=${p.id}`}
                                        className="link text-line-2"
                                      >
                                        {p.name}
                                      </a>
                                    </h6>

                                    <div className="flex-align gap-16 mb-12">
                                      <div className="flex-align gap-6">
                                        <span className="text-md fw-medium text-warning-600 d-flex">
                                          <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-md fw-semibold text-gray-900">
                                          {String(p.rating || "0")}
                                        </span>
                                      </div>
                                      <span className="text-sm fw-medium text-gray-200">|</span>
                                      <span className="text-neutral-600 text-sm">
                                        {p.review_count || 0} Reviews
                                      </span>
                                    </div>

                                    <div className="flex-align gap-12">
                                      <span className="text-lg fw-semibold text-gray-900">
                                        ₹{Number(p.new_price || 0).toFixed(2)}
                                      </span>
                                      {Number(p.old_price || 0) > 0 && (
                                        <span className="text-md fw-semibold text-gray-500 text-decoration-line-through">
                                          ₹{Number(p.old_price).toFixed(2)}
                                        </span>
                                      )}
                                    </div>

                                    <div className="mt-12">
                                      <button
                                        onClick={() => removeFromWishlist(row.id)}
                                        type="button"
                                        className="btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-12 rounded-8 fw-medium"
                                      >
                                        Remove from Wishlist
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Confirm Delete Modal */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000000,
          }}
          onClick={cancelDelete}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: "24px 20px",
              width: 340,
              maxWidth: "90vw",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="confirm-title" style={{ margin: 0, marginBottom: 8 }}>
              Delete Prescription
            </h3>
            <p style={{ margin: 0, color: "#374151" }}>
              Are you sure you want to delete this prescription?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 18,
              }}
            >
              <button
                type="button"
                onClick={cancelDelete}
                style={{
                  background: "#e5e7eb",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                No
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterOne />
      <BottomFooter />

      {/* Styles (unchanged visuals; adds only stacking & click safety) */}
      <style>{`
        :root { --teal:#35b7a8; --border:#e5e7eb; --text:#111827; --orange:#f27c2c; --muted:#6b7280; --dark:#2f3740; }
        *{ box-sizing:border-box; }
        .profile-shell{ display:flex; gap:24px; max-width:1200px; margin:40px auto; padding:0 16px; color:var(--text); }

        /* bring this screen above any stray overlays without changing look */
        .account-screen { position: relative; z-index: 100000; }

        .sidebar{ width:280px; background:#fff; border:1px solid var(--border); border-radius:4px; height:max-content; position:relative; z-index: 100001; }
        .side-list{ list-style:none; margin:0; padding:0; }
        .side-item{ padding:18px 22px; border-bottom:1px solid var(--border); cursor:pointer; font-weight:700; color:#000; background:#fafafa; transition:.25s; pointer-events:auto; }
        .side-item:hover{ background:#f0f0f0; }
        .side-item.active{ background:var(--teal); color:#fff; }
        .main{ flex:1; position:relative; z-index: 100001; }

        .card{ background:#fff; border:1px solid var(--border); padding:28px 28px 36px; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.05); }
        .page-title{ font-size:32px; font-weight:800; color:#0b1c39; text-align:center; margin:0 0 8px; }
        .section-title{ font-size:22px; font-weight:700; color:#0b1c39; text-align:center; margin:6px 0 22px; }
        .grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:18px; }
        .form-group{ display:flex; flex-direction:column; gap:8px; }
        label{ font-weight:600; }
        input[type="text"], input[type="password"], input[type="tel"], input[type="email"], select{ height:46px; padding:0 12px; border:1px solid var(--border); border-radius:6px; font-size:14px; outline:none; }
        .mt-20{ margin-top:20px; }
        .divider{ border:none; border-top:1px dashed var(--border); margin:26px 0; }
        .btn-primary{ background:var(--orange); color:#fff; border:none; padding:12px 18px; border-radius:6px; font-weight:700; cursor:pointer; }
        .btn-outline{ background:#fff; border:1px solid var(--border); padding:10px 14px; border-radius:6px; cursor:pointer; }
        .flex-between{ display:flex; align-items:center; justify-content:space-between; }
        .mb-16{ margin-bottom:16px; }
        .m-0{ margin:0; }

        .orders-scope .ord-wrap{ display:flex; flex-direction:column; gap:24px; }
        .orders-scope .ord-card{ background:#fff; border:1px solid var(--border); border-radius:8px; overflow:hidden; }
        .orders-scope .ord-top{ display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:#fafafa; border-bottom:1px solid var(--border); font-size:14px; }
        .orders-scope .ord-meta{ display:flex; gap:18px; color:var(--muted); }
        .orders-scope .ord-meta strong{ color:#111; }
        .orders-scope .ord-muted{ color:var(--muted); }
        .orders-scope .ord-delivered{ display:flex; align-items:center; gap:8px; padding:12px 16px; font-weight:600; color:#1e8e3e; }
        .orders-scope .ord-dot{ width:8px; height:8px; border-radius:50%; background:#1e8e3e; display:inline-block; }
        .orders-scope .ord-item{ display:flex; align-items:center; gap:16px; padding:16px; flex-wrap:nowrap; }
        .orders-scope .ord-thumb{ width:190px; aspect-ratio:16 / 10; object-fit:cover; border:1px solid var(--border); border-radius:8px; flex-shrink:0; }
        .orders-scope .ord-info{ flex:1; overflow-wrap:anywhere; }
        .orders-scope .ord-title{ font-weight:700; font-size:16px; }
        .orders-scope .ord-addons{ color:#374151; margin-top:4px; }
        .orders-scope .ord-policy{ margin-top:6px; font-size:12px; color:#374151; }
        .orders-scope .ord-mini{ margin-top:2px; font-size:11px; color:#6b7280; }
        .orders-scope .ord-actions{ display:flex; justify-content:flex-end; gap:8px; padding:12px 16px; border-top:1px solid var(--border); }
        .orders-scope .ord-btn-outline{ background:#fff; border:1px solid var(--border); padding:8px 12px; border-radius:6px; cursor:pointer; font-size:13px; }
        .orders-scope .ord-btn-power{ font-weight:600; }

        .orders-scope .ord-power{ border-top:1px solid var(--border); background:#fbfbfb; }
        .orders-scope .ord-power-h{ padding:12px 16px; font-weight:600; }
        .orders-scope .ord-table-compact{ border-top:1px solid var(--border); }
        .orders-scope .ord-row{ display:grid; }
        .orders-scope .ord-three{ grid-template-columns:1fr 1fr 1fr; }
        .orders-scope .ord-th{ background:var(--dark); color:#fff; font-weight:700; }
        .orders-scope .ord-col{ padding:12px; border-bottom:1px solid var(--border); font-size:13px; display:flex; align-items:center; }
        .orders-scope .ord-center{ justify-content:center; text-align:center; }
        .orders-scope .ord-eyeLabel{ background:var(--dark); color:#fff; font-weight:700; justify-content:flex-start; }
        .orders-scope .wrap{ word-break:break-word; hyphens:auto; }

        @media (max-width: 640px) {
          .orders-scope .ord-thumb{ width:150px; aspect-ratio:16/10; }
          .orders-scope .ord-info{ font-size:14px; }
          .orders-scope .ord-col{ padding:10px; font-size:12.5px; }
          .orders-scope .ord-th .ord-col{ font-size:13px; }
          .orders-scope .ord-eyeLabel{ font-size:12.5px; }
          .orders-scope .wrap{ line-height:1.1; }
        }

        .rx-grid{ display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .rx-card{ border:1px solid var(--border); background:#f3f8fa; padding:16px; }
        .rx-head .rx-line{ font-weight:700; margin-bottom:6px; }
        .rx-created{ color:#6b7280; margin:10px 0 8px; }
        .rx-table{ border:1px solid var(--border); }
        .rx-row{ display:grid; grid-template-columns:1fr 1fr 1fr; }
        .rx-row + .rx-row{ border-top:1px solid var(--border); }
        .rx-th{ background:var(--dark); color:#fff; font-weight:700; }
        .col{ padding:12px; display:flex; align-items:center; }
        .eye{ background:var(--dark); color:#fff; }
        .eye-label{ text-transform:uppercase; font-weight:700; font-size:12.5px; letter-spacing:.03em; }
        .value{ font-size:13px; }
        .rx-form-table{ border:1px solid var(--border); margin-top:14px; }
        .rx-form-table .rx-row input{ width:100%; height:40px; border:1px solid var(--border); border-radius:6px; padding:0 10px; font-size:13px; }

        @media (max-width: 992px) {
          .profile-shell{ flex-direction:column; }
          .sidebar{ width:100%; }
          .rx-grid{ grid-template-columns:1fr; }
        }
        @media (max-width: 640px) {
          .grid-2{ grid-template-columns:1fr; }
          .page-title{ font-size:26px; }
          .section-title{ font-size:18px; }
        }

        /* <= 517px */
        @media (max-width: 517px) {
          .table-product__thumb {
            max-width: 100%;
            max-height: 150px;
            width: 100%;
            height: 100%;
            aspect-ratio: 1;
          }
          .table-product__thumb img {
            max-width: 130px;
          }
          .flex-align, .common-check {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .text-start {
            text-align: center !important;
          }
          .table-product__content {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

function formatNum(v) {
  if (v === null || v === undefined) return "-";
  if (typeof v === "string" && v.trim() === "") return "-";
  if (isNaN(Number(v))) return v;
  const n = Number(v);
  const abs = Math.abs(n).toFixed(2);
  return (n < 0 ? "-" : "") + abs;
}

export default ProfilePage;
