import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ===== API bases ===== */
const API_ROOT = (process.env.REACT_APP_API_BASE || "").trim().replace(/\/+$/g, "");
const CART_API = (API_ROOT ? API_ROOT : "") + "/api/cart";
const PROFILE_API = (API_ROOT ? API_ROOT : "") + "/api/profile";

/* ===== Auth header ===== */
const authHeader = () => {
  const t = localStorage.getItem("access_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

/* ===== API helpers ===== */
async function fetchCart() {
  const res = await fetch(`${CART_API}/items/`, { headers: { ...authHeader() } });
  const text = await res.text().catch(() => "");
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!res.ok) throw new Error((data && (data.error || data.detail)) || "Failed to load cart");
  return data || { items: [] };
}

/** Save/clear prescription (power) on a cart item */
async function updateCartPrescription(cartItemId, prescription_id) {
  const headers = { "Content-Type": "application/json", ...authHeader() };
  const body = { prescription_id };
  const res = await fetch(`${CART_API}/items/${cartItemId}/set-prescription/`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => "");
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!res.ok) {
    throw new Error((data && (data.error || data.detail || data.message)) || text || `Request failed (${res.status})`);
  }
  return data || {};
}

async function deleteCartItem(cartItemId) {
  const res = await fetch(`${CART_API}/items/${cartItemId}/`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = null; }
    throw new Error((data && (data.error || data.detail)) || "Failed to remove item");
  }
  return true;
}

async function fetchMyPrescriptions() {
  const res = await fetch(`${PROFILE_API}/prescriptions/`, { headers: { ...authHeader() } });
  const text = await res.text().catch(() => "");
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!res.ok) throw new Error((data && (data.error || data.detail)) || "Failed to load prescriptions");
  return data || { items: [] };
}

/* ===== helpers ===== */
const LENS_LABELS = {
  basic: "Lenskart Anti-Glare Normal Clear",
  "blue-cut": "Blue Coated Lens",
  "super-blue": "Premium Super Blue Light Lens",
  photochromatic: "Photochromic (Light-Adaptive) Lens",
  "photochromatic-blue": "Blue Coated Photochromic Lens",
};
const lensLabel = (v) => LENS_LABELS[v] || v || "-";

const toNumber = (v, f = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : f;
};
const currency = (n) =>
  `₹${toNumber(n, 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

/* ===== Component ===== */
const CartSection = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Add Power UI
  const [rxOpenMap, setRxOpenMap] = useState({});
  const [rxLoading, setRxLoading] = useState(false);
  const [rxList, setRxList] = useState([]);
  const [rxSel, setRxSel] = useState({});
  const [rxErr, setRxErr] = useState({});
  const [rxMsg, setRxMsg] = useState({});

  // Remove states
  const [removing, setRemoving] = useState({});
  const [removeErr, setRemoveErr] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/account");
      return;
    }
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await fetchCart();
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        setErr(e.message || "Could not load cart.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + toNumber(it.line_total || it.unit_total), 0),
    [items]
  );

  const togglePowerPanel = async (cartItemId, currentRxId) => {
    setRxErr((p) => ({ ...p, [cartItemId]: "" }));
    setRxMsg((p) => ({ ...p, [cartItemId]: "" }));

    setRxOpenMap((m) => {
      const next = !m[cartItemId];
      // when opening, initialize selection = current power id (or empty)
      if (next) {
        setRxSel((s) => ({ ...s, [cartItemId]: currentRxId || "" }));
      }
      return { ...m, [cartItemId]: next };
    });

    // lazy-load list once
    if (rxList.length === 0) {
      try {
        setRxLoading(true);
        const data = await fetchMyPrescriptions();
        setRxList(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        setRxErr((p) => ({ ...p, [cartItemId]: e.message || "Failed to load prescriptions." }));
      } finally {
        setRxLoading(false);
      }
    }
  };

  const savePower = async (cartItemId) => {
    let pid = rxSel[cartItemId];
    setRxErr((p) => ({ ...p, [cartItemId]: "" }));
    setRxMsg((p) => ({ ...p, [cartItemId]: "" }));

    // Allow "None" to clear the power
    if (pid === "__none__" || pid === "" || pid == null) {
      pid = null;
    }

    try {
      const updated = await updateCartPrescription(cartItemId, pid);
      if (updated && updated.id) {
        setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        // fallback: refresh cart if server returns nothing
        const data = await fetchCart();
        setItems(Array.isArray(data.items) ? data.items : []);
      }
      // close immediately after successful save
      setRxOpenMap((m) => ({ ...m, [cartItemId]: false }));
      setRxMsg((p) => ({ ...p, [cartItemId]: "" }));
    } catch (e) {
      setRxErr((p) => ({ ...p, [cartItemId]: e.message || "Could not save power." }));
    }
  };

  const removeItem = async (cartItemId) => {
    setRemoveErr((p) => ({ ...p, [cartItemId]: "" }));
    setRemoving((p) => ({ ...p, [cartItemId]: true }));
    try {
      await deleteCartItem(cartItemId);
      setItems((prev) => prev.filter((x) => x.id !== cartItemId));
    } catch (e) {
      setRemoveErr((p) => ({ ...p, [cartItemId]: e.message || "Failed to remove item." }));
    } finally {
      setRemoving((p) => ({ ...p, [cartItemId]: false }));
    }
  };

  return (
    <section className="cart py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          {/* LEFT: item cards */}
          <div className="col-xl-9 col-lg-8">
            <div className="border border-gray-100 rounded-16 p-24 p-md-32">
              {err && (
                <div style={{ color: "#b91c1c", marginBottom: 12, fontWeight: 600 }}>
                  {err}
                </div>
              )}

              {loading ? (
                <p>Loading cart…</p>
              ) : items.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <div className="cart-card-grid">
                  {items.map((row) => {
                    const p = row.spectacle || {};
                    const lensText = lensLabel(row.lens_type);
                    const price = toNumber(row.line_total || row.unit_total, 0);
                    const currentRxId = row.prescription?.id;

                    return (
                      <div key={row.id} className="ck-card">
                        {/* remove button */}
                        <button
                          type="button"
                          className="ck-remove"
                          onClick={() => removeItem(row.id)}
                          disabled={!!removing[row.id]}
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          {removing[row.id] ? <span className="ck-spinner" /> : <i className="ph ph-x" />}
                        </button>

                        {/* image */}
                        <div className="ck-media">
                          <Link to={`/product-details?id=${p.id || ""}`} className="ck-thumb">
                            {p.image1 ? <img src={p.image1} alt={p.name || "Product"} /> : <div className="ck-noimg" />}
                          </Link>
                        </div>

                        {/* details */}
                        <div className="ck-body">
                          <h5 className="ck-title">
                            <Link to={`/product-details?id=${p.id || ""}`}>{p.name || row.spectacle_name || "—"}</Link>
                          </h5>

                          {(p.size || p.model_name || row.spectacle_model_name) && (
                            <div className="ck-subtle">
                              {p.size ? p.size : null}
                              {p.size && (p.model_name || row.spectacle_model_name) ? " · " : ""}
                              {p.model_name || row.spectacle_model_name || ""}
                            </div>
                          )}

                          <div className="ck-lens">
                            <span className="ck-lens-text">{lensText}</span>
                            <i className="ph ph-caret-down ck-caret" />
                          </div>

                          <div className="ck-power-line">
                            <button
                              type="button"
                              className="ck-power-btn"
                              onClick={() => togglePowerPanel(row.id, currentRxId)}
                            >
                              {row.prescription && row.prescription.name
                                ? `Power: ${row.prescription.name}`
                                : "Submit Power later"}
                              <i className="ph ph-caret-down ck-caret" />
                            </button>

                            {rxOpenMap[row.id] && (
                              <div className="ck-power-panel">
                                {rxLoading ? (
                                  <p className="ck-hint">Loading your saved prescriptions…</p>
                                ) : (
                                  <>
                                    <label className="ck-label">Select a saved power</label>
                                    <select
                                      className="ck-select"
                                      value={rxSel[row.id] ?? (currentRxId || "")}
                                      onChange={(e) =>
                                        setRxSel((m) => ({ ...m, [row.id]: e.target.value }))
                                      }
                                    >
                                      {/* None option */}
                                      <option value="__none__">None (I’ll share later)</option>
                                      {/* Existing prescriptions */}
                                      {rxList.map((rx) => (
                                        <option key={rx.id} value={String(rx.id)}>
                                          {(rx.name || "Untitled") +
                                            (rx.powerType || rx.power_type ? ` — ${rx.powerType || rx.power_type}` : "")}
                                        </option>
                                      ))}
                                    </select>

                                    {rxErr[row.id] && <div className="ck-err">{rxErr[row.id]}</div>}
                                    {rxMsg[row.id] && <div className="ck-ok">{rxMsg[row.id]}</div>}

                                    <div className="ck-power-actions">
                                      <button type="button" className="ck-save-btn" onClick={() => savePower(row.id)}>
                                        Save Power
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="ck-badges">
                            <span className="ck-badge">
                              <span className="ck-dot" /> BestSeller
                            </span>
                            <span className="ck-badge ghost">Frame + Lens</span>
                          </div>

                          {removeErr[row.id] && (
                            <div className="ck-err" style={{ marginTop: 8 }}>{removeErr[row.id]}</div>
                          )}
                        </div>

                        {/* price */}
                        <div className="ck-price">{currency(price)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: totals */}
          <div className="col-xl-3 col-lg-4">
            <div className="cart-sidebar border border-gray-100 rounded-16 px-24 py-32">
              <h6 className="text-xl mb-24">Cart Totals</h6>
              <div className="bg-color-three rounded-12 p-20">
                <div className="flex-between gap-8 mb-20">
                  <span className="text-gray-900">Subtotal</span>
                  <span className="text-gray-900 fw-semibold">{currency(subtotal)}</span>
                </div>
                <div className="flex-between gap-8 mb-20">
                  <span className="text-gray-900">Estimated Delivery</span>
                  <span className="text-gray-900 fw-semibold">Free</span>
                </div>
                <div className="flex-between gap-8">
                  <span className="text-gray-900">Estimated Taxes</span>
                  <span className="text-gray-900 fw-semibold">—</span>
                </div>
              </div>

              <div className="bg-color-three rounded-12 p-20 mt-16">
                <div className="flex-between gap-8">
                  <span className="text-gray-900 text-lg fw-semibold">Total</span>
                  <span className="text-gray-900 text-lg fw-semibold">{currency(subtotal)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn btn-main mt-28 py-16 w-100 rounded-8">
                Proceed to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Styles for the new card layout + small-screen tweaks */}
      <style>{`
        .ck-card{
          position: relative;
          display: grid;
          grid-template-columns: 140px 1fr auto;
          gap: 16px;
          padding: 16px;
          border: 1px solid #eef2f6;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.04);
        }
        .ck-card + .ck-card { margin-top: 16px; }

        .ck-remove{
          position:absolute;
          top:10px; right:10px;
          width:28px; height:28px;
          border-radius:999px;
          border:1px solid #e5e7eb;
          background:#fff;
          display:flex; align-items:center; justify-content:center;
          color:#6b7280;
        }
        .ck-remove:hover{ background:#f9fafb; }
        .ck-spinner{
          width:14px; height:14px; border-radius:50%;
          border:2px solid #9ca3af; border-top-color:transparent;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin{ to{ transform: rotate(360deg); } }

        .ck-media{ display:flex; align-items:center; justify-content:center; }
        .ck-thumb{
          width: 140px; height: 100px; border:1px solid #eef2f6; border-radius:10px;
          display:flex; align-items:center; justify-content:center; overflow:hidden; background:#fff;
        }
        .ck-thumb img{ max-width: 130px; max-height: 90px; object-fit: contain; }
        .ck-noimg{ width:120px; height:90px; background:#f3f4f6; border-radius:8px; }

        .ck-body{ display:flex; flex-direction:column; gap:6px; padding-right:16px; }
        .ck-title{ margin:0; font-size:18px; font-weight:800; color:#0b1c39; }
        .ck-title a{ color:inherit; text-decoration:none; }
        .ck-title a:hover{ text-decoration:underline; }

        .ck-subtle{ color:#6b7280; font-size:13px; }

        .ck-lens{ display:flex; align-items:center; gap:6px; font-weight:700; color:#12744f; }
        .ck-lens-text{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .ck-caret{ font-size:12px; color:#6b7280; }

        .ck-power-line{ margin-top:2px; }
        .ck-power-btn{
          border:none; background:transparent; color:#12744f; font-weight:700;
          padding:0; cursor:pointer; display:inline-flex; align-items:center; gap:6px;
        }
        .ck-power-panel{
          margin-top:10px; border:1px solid #e5e7eb; border-radius:10px; padding:12px; background:#fbfbfb;
        }
        .ck-label{ font-size:12px; font-weight:700; color:#374151; margin-bottom:6px; display:block; }
        .ck-select{
          width:100%; height:40px; border:1px solid #e5e7eb; border-radius:8px; padding:0 10px;
          font-size:14px; background:#fff;
        }
        .ck-hint{ color:#6b7280; font-size:13px; }
        .ck-power-actions{ margin-top:10px; }
        .ck-save-btn{
          background:#299E60; color:#fff; border:none; padding:10px 14px; border-radius:8px; font-weight:700;
        }
        .ck-err{ color:#b91c1c; margin-top:6px; font-weight:700; }
        .ck-ok{ color:#166534; margin-top:6px; font-weight:700; }

        .ck-badges{ display:flex; gap:8px; margin-top:8px; flex-wrap:wrap; }
        .ck-badge{
          display:inline-flex; align-items:center; gap:6px;
          border:1px solid #e5e7eb; background:#fff; padding:6px 10px; border-radius:999px;
          font-size:12px; color:#374151; font-weight:700;
        }
        .ck-badge.ghost{ background:#f9fafb; }
        .ck-dot{ width:6px; height:6px; border-radius:999px; background:#f59e0b; display:inline-block; }

        .ck-price{
          align-self:end;
          font-size:18px; font-weight:800; color:#0b1c39;
          padding-right:4px; padding-bottom:2px;
        }

        .cart-card-grid{ display:flex; flex-direction:column; }

        @media (max-width: 640px){
          .ck-card{ grid-template-columns: 1fr; }
          .ck-media{ justify-content:flex-start; }
          .ck-thumb{ width: 100%; height: 180px; }
          .ck-thumb img{ max-width: 95%; max-height: 95%; }
          .ck-price{ justify-self:end; }
        }

        /* <=517px tweaks you requested earlier */
        @media (max-width: 517px) {
          .table-product__thumb { max-width: 100%; max-height: 150px; width: 100%; height: 100%; aspect-ratio: 1; }
          .table-product__thumb img { max-width: 130px; }
          .flex-align, .common-check { display: flex; align-items: center; justify-content: center; }
          .text-start { text-align: center !important; }
          .table-product__content { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default CartSection;