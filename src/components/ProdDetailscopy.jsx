import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { getCountdown } from "../helper/Countdown";

/* ==== API bases ==== */
const API_ROOT = (process.env.REACT_APP_API_BASE || "")
  .trim()
  .replace(/\/+$/g, "");
const ADMIN_BASE = (API_ROOT ? API_ROOT : "") + "/api/adminboard";
const CART_API = (API_ROOT ? API_ROOT : "") + "/api/cart";
const WISHLIST_API = (API_ROOT ? API_ROOT : "") + "/api/wishlist";

/* ==== Auth header ==== */
const authHeader = () => {
  const t = localStorage.getItem("access_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

/* ==== Cart helper ==== */
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

/* ==== Utility helpers ==== */
const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const cleanStr = (v) => (v == null ? "" : String(v));
const blankIfZero = (n) => (Number.isFinite(n) && n > 0 ? String(n) : "—");

/* ==== Star rating ==== */
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
        />
      ))}
    </span>
  );
  return (
    <span className="position-relative d-inline-flex" style={{ lineHeight: 1 }}>
      {row(false)}
      <span
        className="position-absolute top-0 start-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        {row(true)}
      </span>
    </span>
  );
};

/* ==== Lens options ==== */
const LENS_OPTIONS = [
  { value: "basic", label: "Standard Clear Lens", price: 0, points: ["Anti-glare base coat", "Scratch resistant", "Everyday use"] },
  { value: "blue-cut", label: "Blue Coated Lens", price: 200, points: ["Blue light filter", "Comfort for digital work", "Anti-glare"] },
  { value: "super-blue", label: "Premium Super Blue Light Lens", price: 300, points: ["High-intensity screen use", "Reduced eye strain", "Anti-glare"] },
  { value: "photochromatic", label: "Photochromic (Light-Adaptive) Lens", price: 300, points: ["UV responsive tint", "No need for sunglasses", "Anti-UV"] },
  { value: "photochromatic-blue", label: "Blue Coated Photochromic Lens", price: 400, points: ["Adaptive tint + blue filter", "Outdoor & screen comfort", "Anti-UV"] },
];

const currency = (n) =>
  `₹ ${toNumber(n, 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ProductDetailsOne = () => {
  const [timeLeft, setTimeLeft] = useState(getCountdown());
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [quantity] = useState(1);
  const [lensType, setLensType] = useState("");

  const selectedLens = useMemo(
    () => LENS_OPTIONS.find((o) => o.value === lensType) || null,
    [lensType]
  );
  const lensPrice = selectedLens ? selectedLens.price : 0;

  /* ==== Add to cart ==== */
  const handleAddToCart = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/account");
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
      navigate("/cart");
    } catch (err) {
      if (err?.status === 401) navigate("/account");
      else alert(err.message);
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

  /* ==== Load product ==== */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${ADMIN_BASE}/list-spectacles/`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        const raw = arr.find((p) => Number(p.id) === numericId);
        if (!raw) return;
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
      } catch {
        if (!cancelled) setItem(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [numericId]);

  /* ==== Check if wishlisted ==== */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    let cancelled = false;
    const checkWishlist = async () => {
      try {
        const items = await wishlistList();
        const found = items.some((i) => i.spectacle?.id === numericId);
        if (!cancelled) setWishlisted(found);
      } catch {}
    };
    checkWishlist();
    return () => {
      cancelled = true;
    };
  }, [numericId]);

  /* ==== Gallery ==== */
  const images = useMemo(() => {
    if (!item) return [];
    return [item.image1, item.image2, item.image3, item.image4].filter(Boolean);
  }, [item]);

  const [mainImage, setMainImage] = useState("");
  useEffect(() => {
    if (images.length) setMainImage(images[0]);
  }, [images]);

  const settingsThumbs = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    focusOnSelect: true,
  };

  if (loading)
    return (
      <section className="product-details py-80">
        <div className="container container-lg">
          <p>Loading spectacle…</p>
        </div>
      </section>
    );
  if (!item)
    return (
      <section className="product-details py-80">
        <div className="container container-lg">
          <p>Not found.</p>
        </div>
      </section>
    );

  const rating = toNumber(item.rating, 0);
  const basePrice = toNumber(item.new_price, 0);
  const totalPrice = basePrice + lensPrice;

  return (
    <section className="product-details py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-lg-9">
            <div className="row gy-4">
              <div className="col-xl-6">
                <div className="product-details__left">
                  <div className="pd1-main-wrap">
                    <div className="pd1-main-frame">
                      {mainImage ? (
                        <img src={mainImage} alt={item.name} className="pd1-main-img" />
                      ) : (
                        <div>No Image</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-24">
                    <Slider {...settingsThumbs}>
                      {images.map((image, index) => (
                        <div
                          key={index}
                          onClick={() => setMainImage(image)}
                          className="border rounded-16 p-8"
                        >
                          <img src={image} alt={`thumb ${index}`} />
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
              </div>

              <div className="col-xl-6">
                <div className="product-details__content">
                  <h5>{item.name}</h5>
                  <FractionalStars rating={rating} />
                  <div className="mt-3">
                    <h4>{currency(totalPrice)}</h4>
                  </div>

                  <div className="flex-between gap-16 flex-wrap mt-4">
                    <div className="flex-align flex-wrap gap-16">
                      <Link
                        to="#"
                        onClick={handleAddToCart}
                        className="btn btn-main rounded-pill flex-align gap-8 px-48"
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
                        title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <i className={wishlisted ? "ph-fill ph-heart" : "ph ph-heart"} />
                      </Link>
                    </div>
                  </div>

                  <p className="mt-3">{item.small_description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="border rounded-16 p-24">
              <h6>by SpecsKraft</h6>
              <p>Fast Delivery | Easy Returns | Secure Payments</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsOne;
