import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { getCountdown } from "../helper/Countdown";

/* ==== API bases (same pattern you use elsewhere) ==== */
const API_ROOT = (process.env.REACT_APP_API_BASE || "")
  .trim()
  .replace(/\/+$/g, "");
const ADMIN_BASE = (API_ROOT ? API_ROOT : "") + "/api/adminboard";
const CART_API = (API_ROOT ? API_ROOT : "") + "/api/cart";
const WISHLIST_API = (API_ROOT ? API_ROOT : "") + "/api/wishlist";

/* ==== Auth header (JWT from localStorage) ==== */
const authHeader = () => {
  const t = localStorage.getItem("access_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

/* ==== Cart API helper (robust error surface) ==== */
async function cartAdd({ spectacle_id, lens_type, quantity }) {
  const res = await fetch(`${CART_API}/items/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ spectacle_id, lens_type, quantity }),
  });
  const text = await res.text().catch(() => "");
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const msg =
      (data && (data.error || data.detail || data.message)) ||
      text ||
      `Cart add failed (HTTP ${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data || {};
}

/* ==== Wishlist helpers ==== */
async function wishlistAdd(spectacle_id) {
  const res = await fetch(`${WISHLIST_API}/items/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ spectacle_id }),
  });
  const text = await res.text().catch(() => "");
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const msg =
      (data && (data.error || data.detail || data.message)) ||
      text ||
      `Wishlist add failed (HTTP ${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data || {};
}

async function wishlistRemove(spectacle_id) {
  const res = await fetch(`${WISHLIST_API}/by-spectacle/${spectacle_id}/`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Wishlist remove failed (${res.status})`);
  }
  return true;
}

async function wishlistList() {
  const res = await fetch(`${WISHLIST_API}/items/`, {
    headers: { Accept: "application/json", ...authHeader() },
  });
  if (!res.ok) throw new Error(`Wishlist fetch failed (${res.status})`);
  const data = await res.json();
  return data.items || [];
}

/* ==== Helpers ==== */
const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const cleanStr = (v) => (v == null ? "" : String(v));
const blankIfZero = (n) => (Number.isFinite(n) && n > 0 ? String(n) : "—");

/* Stars with fractional fill (uses your star classes) */
const FractionalStars = ({ rating = 0 }) => {
  const pct = Math.max(0, Math.min(100, (toNumber(rating) / 5) * 100));
  const stars = Array.from({ length: 5 });
  const row = (filled) => (
    <span className="text-15 fw-medium d-flex" style={{ gap: 2 }}>
      {stars.map((_, i) => (
        <i
          key={i}
          className={`ph-fill ph-star ${
            filled ? "text-warning-600" : "text-gray-400"
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
  return (
    <span className="position-relative d-inline-flex" style={{ lineHeight: 1 }}>
      {row(false)}
      <span
        className="position-absolute top-0 start-0 overflow-hidden"
        style={{ width: `${pct}%`, pointerEvents: "none" }}
        aria-hidden="true"
      >
        {row(true)}
      </span>
    </span>
  );
};

/* ==== Lens options & prices (UI only; server re-computes) ==== */
const LENS_OPTIONS = [
  {
    value: "basic",
    label: "Standard Clear Lens",
    price: 0,
    points: ["Anti-glare base coat", "Scratch resistant", "Everyday use"],
  },
  {
    value: "blue-cut",
    label: "Blue Coated Lens",
    price: 200,
    points: ["Blue light filter", "Comfort for digital work", "Anti-glare"],
  },
  {
    value: "super-blue",
    label: "Premium Super Blue Light Lens",
    price: 300,
    points: ["High-intensity screen use", "Reduced eye strain", "Anti-glare"],
  },
  {
    value: "photochromatic",
    label: "Photochromic (Light-Adaptive) Lens",
    price: 300,
    points: ["UV responsive tint", "No need for sunglasses", "Anti-UV"],
  },
  {
    value: "photochromatic-blue",
    label: "Blue Coated Photochromic Lens",
    price: 400,
    points: [
      "Adaptive tint + blue filter",
      "Outdoor & screen comfort",
      "Anti-UV",
    ],
  },
];

const currency = (n) =>
  `₹ ${toNumber(n, 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ProductDetailsOne = () => {
  /* countdown (kept) */
  const [timeLeft, setTimeLeft] = useState(getCountdown());
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  /* routing params */
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);

  /* product state */
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  /* quantity (kept, default 1) */
  const [quantity] = useState(1);

  /* lens type selection */
  const [lensType, setLensType] = useState("");

  /* selected lens & price */
  const selectedLens = useMemo(
    () => LENS_OPTIONS.find((o) => o.value === lensType) || null,
    [lensType]
  );
  const lensPrice = selectedLens ? selectedLens.price : 0;

  /* Add To Cart */
  const handleAddToCart = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/account");
      return;
    }
    if (!Number.isFinite(numericId)) {
      alert("Invalid product.");
      return;
    }
    if (!lensType) {
      alert("Please select lens");
      return;
    }
    try {
      await cartAdd({
        spectacle_id: numericId,
        lens_type: lensType,
        quantity,
      });
      // go to cart page so the user sees the newly added item
      navigate("/cart");
    } catch (err) {
      console.error("Cart add error:", err);
      if (err?.status === 401) {
        navigate("/account");
        return;
      }
      if (err?.status === 404) {
        alert("Product not found.");
        return;
      }
      alert(err?.message || "Something went wrong while adding to cart.");
    }
  };

  /* ==== Wishlist toggle ==== */
  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/account");
      return;
    }
    try {
      if (wishlisted) {
        await wishlistRemove(numericId);
        setWishlisted(false);
      } else {
        await wishlistAdd(numericId);
        setWishlisted(true);
      }
    } catch (err) {
      if (err?.status === 401) navigate("/account");
      else alert(err.message);
    }
  };

  /* fetch product from list */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${ADMIN_BASE}/list-spectacles/`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        const raw = arr.find((p) => Number(p.id) === numericId);

        if (!raw) {
          if (!cancelled) setItem(null);
          return;
        }

        const normalized = {
          id: raw.id,
          name: cleanStr(raw.name),
          model_name: cleanStr(raw.model_name || ""),
          category: cleanStr(raw.category || ""),
          rating: toNumber(raw.rating, 0),
          review_count: cleanStr(raw.review_count || ""),
          small_description: cleanStr(raw.small_description || ""),
          big_description: cleanStr(raw.big_description || ""),
          old_price: toNumber(raw.old_price, 0),
          new_price: toNumber(raw.new_price, 0),
          color: cleanStr(raw.color || ""),
          size: cleanStr(raw.size || ""),
          width: toNumber(raw.width, 0),
          height: toNumber(raw.height, 0),
          frame_type: cleanStr(raw.frame_type || ""),
          frame_material: cleanStr(raw.frame_material || ""),
          gender: cleanStr(raw.gender || ""),
          image1: cleanStr(raw.image1 || ""),
          image2: cleanStr(raw.image2 || ""),
          image3: cleanStr(raw.image3 || ""),
          image4: cleanStr(raw.image4 || ""),
        };

        if (!cancelled) setItem(normalized);
      } catch (e) {
        console.error("load spectacle details error (from list):", e);
        if (!cancelled) setItem(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (Number.isFinite(numericId)) load();
    return () => {
      cancelled = true;
    };
  }, [numericId]);

  /* gallery */
  const images = useMemo(() => {
    if (!item) return [];
    return [item.image1, item.image2, item.image3, item.image4]
      .map(cleanStr)
      .filter(Boolean);
  }, [item]);

  const [mainImage, setMainImage] = useState("");
  useEffect(() => {
    if (images.length) setMainImage(images[0]);
    else setMainImage("");
  }, [images]);

  /* slider thumbs */
  const settingsThumbs = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    focusOnSelect: true,
  };

  /* loading / not found */
  if (loading) {
    return (
      <section className="product-details py-80">
        <div className="container container-lg">
          <p className="text-xl text-gray-600">Loading spectacle…</p>
        </div>
      </section>
    );
  }
  if (!item) {
    return (
      <section className="product-details py-80">
        <div className="container container-lg">
          <p className="text-xl text-gray-600">Not found.</p>
        </div>
      </section>
    );
  }

  const rating = toNumber(item.rating, 0);
  const oldPrice = toNumber(item.old_price, 0);
  const basePrice = toNumber(item.new_price, 0);
  const totalPrice = basePrice + lensPrice;

  return (
    <section className="product-details py-80">
      {/* Scoped CSS for main image bg/heights, specs grid, and lens card (unchanged visuals) */}
      <style>{`
        .pd1-main-wrap {
          padding: 0 !important;
          background-image: url('/assets/images/products/productsdt-bg.jpg');
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          border-radius: 16px;
        }
        .pd1-main-frame {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 16px;
          padding: 0 !important;
        }
        .pd1-main-img {
          width: auto;
          height: auto;
          max-width: 100%;
          object-fit: contain;
          display: block;
        }
        @media (max-width: 524.98px) {
          .pd1-main-img { height: auto; }
          .pd1-main-frame { height: auto; }
        }
        @media (min-width: 525px) and (max-width: 991.98px) {
          .pd1-main-img { height: 420px; }
          .pd1-main-frame { height: 440px; }
        }
        @media (min-width: 992px) and (max-width: 1199.98px) {
          .pd1-main-img { height: 450px; }
          .pd1-main-frame { height: 470px; }
        }
        @media (min-width: 1120px) {
          .pd1-main-img { height: 380px; }
          .pd1-main-frame { height: 400px; }
        }
        .pd1-no-pad { padding: 0 !important; }

        .pd1-specs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 700px) {
          .pd1-specs-grid {
            grid-template-columns: 1fr 1fr;
            column-gap: 32px;
          }
        }

        .pd1-size-chip {
          display: inline-block;
          padding: 6px 12px;
          border: 1px dashed #e5e7eb;
          border-radius: 9999px;
          font-size: 13px;
          color: #111827;
          background: #fafafa;
          width: fit-content;
        }

        .lens-select {
          width: 100%;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px 14px;
          background: #fff;
          color: #374151;
          font-size: 14px;
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .lens-select:focus {
          outline: none;
          border-color: var(--main-600, #7c3aed);
          box-shadow: 0 0 0 3px rgba(124,58,237,.15);
        }

        .lens-card {
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          background: #ffffff;
          padding: 16px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        @media (min-width: 640px) {
          .lens-card { grid-template-columns: 1fr 1fr; }
        }
        .lens-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          color: #111827;
        }
        .lens-points {
          margin: 0;
          padding-left: 18px;
          color: #4b5563;
          font-size: 13px;
        }
        .price-break {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #f9fafb;
          border: 1px dashed #e5e7eb;
          border-radius: 9999px;
          padding: 8px 12px;
          font-size: 13px;
          color: #374151;
        }
      `}</style>

      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-lg-9">
            <div className="row gy-4">
              {/* LEFT: main image + thumbs */}
              <div className="col-xl-6">
                <div className="product-details__left">
                  <div
                    className="product-details__thumb-slider border border-gray-100 rounded-16 pd1-main-wrap pd1-no-pad"
                    style={{ height: "520px" }}
                  >
                    <div className="pd1-no-pad">
                      <div className="product-details__thumb pd1-main-frame">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={item.name}
                            className="pd1-main-img"
                          />
                        ) : (
                          <div
                            style={{
                              width: 220,
                              height: 180,
                              background: "#f3f4f6",
                              borderRadius: 12,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#9ca3af",
                              fontSize: 12,
                            }}
                          >
                            No Image
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-24">
                    <div className="product-details__images-slider">
                      <Slider {...settingsThumbs}>
                        {images.map((image, index) => (
                          <div
                            className="center max-w-120 max-h-120 h-100 flex-center border border-gray-100 rounded-16 p-8"
                            key={index}
                            onClick={() => setMainImage(image)}
                          >
                            <img
                              className="thum"
                              src={image}
                              alt={`Thumbnail ${index}`}
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: content box */}
              <div className="col-xl-6">
                <div className="product-details__content">
                  <h5 className="mb-12">{item.name}</h5>

                  <div className="flex-align flex-wrap gap-12">
                    <div className="flex-align gap-12 flex-wrap">
                      <div className="flex-align gap-8">
                        <FractionalStars rating={rating} />
                      </div>
                      <span className="text-sm fw-medium text-neutral-600">
                        {rating.toFixed(1)} Star Rating
                      </span>
                      <span className="text-sm fw-medium text-gray-500">
                        ({cleanStr(item.review_count) || "0"})
                      </span>
                    </div>
                    <span className="text-sm fw-medium text-gray-500">|</span>
                    <span className="text-gray-900">
                      <span className="text-gray-400">Model Number:</span>{" "}
                      {item.model_name || "-"}
                    </span>
                  </div>

                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />

                  {/* small description */}
                  {item.small_description ? (
                    <p className="text-gray-700">{item.small_description}</p>
                  ) : null}

                  {/* price block with live total + breakdown */}
                  <div className="mt-32 flex-align flex-wrap gap-16">
                    <div className="flex-align gap-8">
                      <h4 className="mb-0">{currency(totalPrice)}</h4>
                      {oldPrice > 0 && (
                        <span className="text-md text-gray-500 text-decoration-line-through">
                          {currency(oldPrice)}
                        </span>
                      )}
                    </div>
                    <span className="price-break">
                      <span>Base: {currency(basePrice)}</span>
                      <span>+</span>
                      <span>Lens: {currency(lensPrice)}</span>
                    </span>
                  </div>

                  {/* Lens dropdown + dynamic card + Size */}
                  <div className="mt-28 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 px-4 md:px-0">
                    {/* Lens Dropdown + Card */}
                    <div className="flex flex-col gap-3">
                      <label className="text-gray-900 text-sm md:text-base font-semibold tracking-wide uppercase">
                        Lens Type
                      </label>

                      <select
                        value={lensType}
                        onChange={(e) => setLensType(e.target.value)}
                        className="lens-select"
                      >
                        <option value="">Select lens type</option>
                        {LENS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label} —{" "}
                            {o.price === 0
                              ? "₹0"
                              : `₹${o.price.toLocaleString("en-IN")}`}
                          </option>
                        ))}
                      </select>

                      {selectedLens ? (
                        <div className="lens-card mt-2">
                          <div className="lens-header">
                            <i className="ph ph-eyeglasses text-main-600 text-lg" />
                            <span>{selectedLens.label}</span>
                          </div>
                          {selectedLens.points?.length ? (
                            <ul className="lens-points">
                              {selectedLens.points.map((p, i) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">
                          Pick a lens to view details.
                        </span>
                      )}
                    </div>

                    {/* SIZE from DB (read-only) */}
                    <div
                      className="flex flex-col space-y-2"
                      style={{ marginTop: "36px" }}
                    >
                      <label className="text-gray-900 text-sm md:text-base font-semibold tracking-wide uppercase mb-3">
                        Spectacles Size
                      </label>
                      <span
                        className="pd1-size-chip"
                        style={{ marginLeft: "5px" }}
                      >
                        {item.size || "—"}
                      </span>
                    </div>
                  </div>

                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />

                  <div className="flex-between gap-16 flex-wrap">
                    <div className="flex-align flex-wrap gap-16">
                      <Link
                        to="#"
                        onClick={handleAddToCart}
                        className="btn btn-main rounded-pill flex-align d-inline-flex gap-8 px-48"
                      >
                        <i className="ph ph-shopping-cart" /> Add To Cart
                      </Link>
                    </div>

                    <div className="flex-align gap-12">
                      <Link
                        to="#"
                        onClick={handleToggleWishlist}
                        className={`w-52 h-52 text-xl flex-center rounded-circle transition-all ${
                          wishlisted
                            ? "bg-main-600 text-white"
                            : "bg-main-50 text-main-600 hover-bg-main-600 hover-text-white"
                        }`}
                        title={
                          wishlisted
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                      >
                        <i
                          className={
                            wishlisted ? "ph-fill ph-heart" : "ph ph-heart"
                          }
                        />
                      </Link>
                      <Link
                        to="#"
                        className="w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"
                      >
                        <i className="ph ph-shuffle" />
                      </Link>
                      <Link
                        to="#"
                        className="w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"
                      >
                        <i className="ph ph-share-network" />
                      </Link>
                    </div>
                  </div>

                  <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (unchanged content) */}
          <div className="col-lg-3">
            <div className="product-details__sidebar border border-gray-100 rounded-16 overflow-hidden">
              <div className="p-24">
                <div className="flex-between bg-main-600 rounded-pill p-8">
                  <div className="flex-align gap-8">
                    <span className="w-44 h-44 bg-white rounded-circle flex-center text-2xl">
                      <i className="ph ph-storefront" />
                    </span>
                    <span className="text-white">by SpecsKraft</span>
                  </div>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-truck" />
                </span>
                <div className="">
                  <h6 className="text-sm mb-8">Fast Delivery</h6>
                  <p className="text-gray-700">
                    Lightning-fast shipping, guaranteed.
                  </p>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-arrow-u-up-left" />
                </span>
                <div className="">
                  <h6 className="text-sm mb-8">Free 90-day returns</h6>
                  <p className="text-gray-700">
                    Shop risk-free with easy returns.
                  </p>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-credit-card" />
                </span>
                <div className="">
                  <h6 className="text-sm mb-8">Payment</h6>
                  <p className="text-gray-700">
                    Payment upon receipt of goods, Payment by card in the
                    department, Google Pay, Online card.
                  </p>
                </div>
              </div>
              <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                  <i className="ph-fill ph-check-circle" />
                </span>
                <div className="">
                  <h6 className="text-sm mb-8">Warranty</h6>
                  <p className="text-gray-700">
                    The Consumer Protection Act does not provide for the return
                    of this product of proper quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Reviews tabs */}
        <div className=".pt-80shop">
          <div className="product-dContent border rounded-24">
            <div className="product-dContent__header border-bottom border-gray-100 flex-between flex-wrap gap-16">
              <ul
                className="nav common-tab nav-pills mb-3"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="pills-description-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-description"
                    type="button"
                    role="tab"
                    aria-controls="pills-description"
                    aria-selected="true"
                  >
                    Description
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-reviews-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-reviews"
                    type="button"
                    role="tab"
                    aria-controls="pills-reviews"
                    aria-selected="false"
                  >
                    Reviews
                  </button>
                </li>
              </ul>
              <Link
                to="#"
                className="btn bg-color-one rounded-16 flex-align gap-8 text-main-600 hover-bg-main-600 hover-text-white"
              >
                <img src="assets/images/icon/satisfaction-icon.png" alt="" />
                100% Satisfaction Guaranteed
              </Link>
            </div>

            <div className="product-dContent__box">
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-description"
                  role="tabpanel"
                  aria-labelledby="pills-description-tab"
                  tabIndex={0}
                >
                  <div className="mb-40">
                    <h6 className="mb-24">Product Description</h6>
                    <p>
                      {cleanStr(item.big_description) ||
                        "No description available."}
                    </p>
                  </div>

                  <div className="mb-40">
                    <h6 className="mb-24">Product Specifications</h6>

                    <div
                      className="pd1-specs-grid"
                      style={{ fontSize: "18px" }}
                    >
                      <ul className="">
                        <li className="text-gray-400 mb-14 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Product Name:
                            <span className="text-gray-500">
                              {" "}
                              {item.name || "—"}
                            </span>
                          </span>
                        </li>
                        <li className="text-gray-400 mb-14 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Product Type:
                            <span className="text-gray-500">
                              {" "}
                              {item.gender || "Spectacles"}
                            </span>
                          </span>
                        </li>
                        <li className="text-gray-400 mb-14 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Model Number:
                            <span className="text-gray-500">
                              {" "}
                              {item.model_name || "—"}
                            </span>
                          </span>
                        </li>
                        <li className="text-gray-400 mb-14 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Frame Size:
                            <span className="text-gray-500">
                              {" "}
                              {item.size || "—"}
                            </span>
                          </span>
                        </li>
                        <li className="text-gray-400 mb-14 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Frame Type:
                            <span className="text-gray-500">
                              {" "}
                              {item.frame_type || "—"}
                            </span>
                          </span>
                        </li>
                        <li className="text-gray-400 mb-0 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Frame Shape (category):
                            <span className="text-gray-500">
                              {" "}
                              {item.category || "—"}
                            </span>
                          </span>
                        </li>
                      </ul>

                      <ul className="">
                        <li className="text-gray-400 mb-14 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Frame Width:
                            <span className="text-gray-500">
                              {" "}
                              {blankIfZero(item.width)}mm
                            </span>
                          </span>
                        </li>
                        <li className="text-gray-400 mb-14 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Frame Height:
                            <span className="text-gray-500">
                              {" "}
                              {blankIfZero(item.height)}mm
                            </span>
                          </span>
                        </li>
                        <li className="text-gray-400 mb-14 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Frame Color:
                            <span className="text-gray-500">
                              {" "}
                              {item.color || "—"}
                            </span>
                          </span>
                        </li>
                        <li className="text-gray-400 mb-14 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Frame Material:
                            <span className="text-gray-500">
                              {" "}
                              {item.frame_material || "—"}
                            </span>
                          </span>
                        </li>
                        <li className="text-gray-400 mb-14 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Lens Options:
                            <span className="text-gray-500">
                              {" "}
                              All Types Of Lens
                            </span>
                          </span>
                        </li>
                        <li className="text-gray-400 mb-0 flex-align gap-14">
                          <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                            <i className="ph ph-check" />
                          </span>
                          <span className="text-heading fw-medium">
                            Brand:
                            <span className="text-gray-500"> Specskraft</span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* REVIEWS TAB — placeholder kept */}
                <div
                  className="tab-pane fade"
                  id="pills-reviews"
                  role="tabpanel"
                  aria-labelledby="pills-reviews-tab"
                  tabIndex={0}
                >
                  {/* your original static review UI remains unchanged */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsOne;
