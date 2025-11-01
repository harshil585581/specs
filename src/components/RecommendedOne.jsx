import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/* ==== API base ==== */
const API_ROOT = (process.env.REACT_APP_API_BASE || "").trim().replace(/\/+$/g, "");
const ADMIN_BASE = (API_ROOT ? API_ROOT : "") + "/api/adminboard";

/* ==== Helpers ==== */
const clean = (v) => (v == null ? "" : String(v));
const toNumber = (v, f = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : f;
};
const currency = (n) =>
  `₹${toNumber(n, 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const norm = (s) =>
  clean(s)
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* ==== Canonical types ==== */
const TYPE = {
  TRANSPARENT: "transparent",
  RIMLESS: "rimless",
  RECTANGLE: "rectangle",
  CAT_EYE: "cat-eye",
};

const classifyTypes = (rawItem) => {
  const hay = [
    rawItem.spectacle_type,
    rawItem.frame_type,
    rawItem.category,
    rawItem.shape,
    rawItem.tags,
    rawItem.style,
    rawItem.name,
    rawItem.model_name,
  ]
    .map(norm)
    .filter(Boolean)
    .join(" | ");

  const out = new Set();

  // Transparent
  if (
    /\b(transparent|clear frame|clear|crystal|see through|see thru|see-thru|translucent)\b/.test(
      hay
    )
  ) {
    out.add(TYPE.TRANSPARENT);
  }

  // Rimless
  if (/\b(rimless|rim less|no rim|borderless)\b/.test(hay)) {
    out.add(TYPE.RIMLESS);
  }

  // Rectangle
  if (/\b(rectangle|rectangular|rect)\b/.test(hay)) {
    out.add(TYPE.RECTANGLE);
  }

  // Cat-eye
  if (/\b(cat ?eye|cat-eye|cateye|cat eye)\b/.test(hay)) {
    out.add(TYPE.CAT_EYE);
  }

  // Extra: exact field fallbacks (common DB values)
  const exacts = new Set(
    [rawItem.spectacle_type, rawItem.frame_type, rawItem.category, rawItem.shape]
      .map(norm)
      .filter(Boolean)
  );

  const hasAny = (arr) => arr.some((x) => exacts.has(x));
  if (hasAny(["transparent"])) out.add(TYPE.TRANSPARENT);
  if (hasAny(["rimless"])) out.add(TYPE.RIMLESS);
  if (hasAny(["rectangle", "rectangular"])) out.add(TYPE.RECTANGLE);
  if (hasAny(["cat eye", "cat-eye", "cateye"])) out.add(TYPE.CAT_EYE);

  return out;
};

const tabToType = {
  all: null,
  transparent: TYPE.TRANSPARENT,
  rimless: TYPE.RIMLESS,
  rectangle: TYPE.RECTANGLE,
  "cat-eye": TYPE.CAT_EYE,
};

const RecommendedOne = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${ADMIN_BASE}/list-spectacles/`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];

        const normalized = arr.map((raw) => {
          const item = {
            id: raw.id,
            name: clean(raw.name),
            model_name: clean(raw.model_name || ""),
            spectacle_type: clean(raw.spectacle_type || ""),
            frame_type: clean(raw.frame_type || ""),
            category: clean(raw.category || ""),
            shape: clean(raw.shape || ""),
            tags: clean(raw.tags || ""),
            style: clean(raw.style || ""),
            image1: clean(raw.image1 || ""),
            rating: toNumber(raw.rating, 0),
            review_count: toNumber(raw.review_count, 0),
            old_price: toNumber(raw.old_price, 0),
            new_price: toNumber(raw.new_price, 0),
          };
          item.__types = classifyTypes(item); // <- canonical tags here
          return item;
        });

        if (!cancelled) setItems(normalized);
      } catch (e) {
        console.error("load spectacles error:", e);
        if (!cancelled) setErr("Failed to load recommendations.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === "all") return items;
    const want = tabToType[activeTab];
    if (!want) return items;
    return items.filter((it) => it.__types && it.__types.has(want));
  }, [items, activeTab]);

  return (
    <section className="recommended">
      <div className="container container-lg">
        <div className="section-heading flex-between flex-wrap gap-16">
          <h5 className="mb-0">Recommended for you</h5>

          {/* Tabs — styling kept, wired to state for filtering */}
          <ul className="nav common-tab nav-pills" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                id="pills-all-tab"
                type="button"
                onClick={() => setActiveTab("all")}
              >
                All
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "transparent" ? "active" : ""}`}
                id="pills-grocery-tab"
                type="button"
                onClick={() => setActiveTab("transparent")}
              >
                Transparent Frames
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "rimless" ? "active" : ""}`}
                id="pills-fruits-tab"
                type="button"
                onClick={() => setActiveTab("rimless")}
              >
                Rimless Frames
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "rectangle" ? "active" : ""}`}
                id="pills-juices-tab"
                type="button"
                onClick={() => setActiveTab("rectangle")}
              >
                Rectangle Frames
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "cat-eye" ? "active" : ""}`}
                id="pills-vegetables-tab"
                type="button"
                onClick={() => setActiveTab("cat-eye")}
              >
                Cat Eye Frames
              </button>
            </li>
          </ul>
        </div>

        {/* One-row, horizontally scrollable, original card UI/size preserved */}
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id={`pills-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`pills-${activeTab}-tab`}
            tabIndex={0}
          >
            {err && (
              <div className="text-danger fw-semibold" style={{ padding: "8px 4px" }}>
                {err}
              </div>
            )}

            {loading ? (
              <div className="text-gray-600" style={{ padding: "8px 4px" }}>
                Loading…
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-gray-600" style={{ padding: "8px 4px" }}>
                No spectacles found.
              </div>
            ) : (
              <div className="reco-one-row-scroll">
                {filtered.map((sp) => {
                  const price = toNumber(sp.new_price, 0);
                  const old = toNumber(sp.old_price, 0);
                  const rating = toNumber(sp.rating, 0);
                  const reviews = toNumber(sp.review_count, 0);

                  return (
                    <div key={sp.id} className="col-xxl-2 col-lg-3 col-sm-4 col-6 reco-card-wrap">
                      <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                        <Link
                          to={`/product-details?id=${sp.id}`}
                          className="product-card__thumb flex-center"
                        >
                          {sp.image1 ? (
                            <img src={sp.image1} alt={sp.name} />
                          ) : (
                            <div
                              style={{
                                width: 140,
                                height: 120,
                                background: "#f3f4f6",
                                borderRadius: 12,
                              }}
                            />
                          )}
                        </Link>

                        <div className="product-card__content p-sm-2">
                          <h6 className="title text-lg fw-semibold mt-12 mb-8">
                            <Link to={`/product-details?id=${sp.id}`} className="link text-line-2">
                              {sp.name}
                            </Link>
                          </h6>

                          <div className="product-card__content mt-12">
                            <div className="product-card__price mb-8">
                              <span className="text-heading text-md fw-semibold">
                                {currency(price)}{" "}
                                &nbsp; &nbsp;{" "}
                              </span>
                              {old > 0 && old > price ? (
                                <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                  {currency(old)}
                                </span>
                              ) : null}
                            </div>

                            <div className="flex-align gap-6">
                              <span className="text-xs fw-bold text-gray-600">
                                {rating ? rating.toFixed(1) : "—"}
                              </span>
                              <span className="text-15 fw-bold text-warning-600 d-flex">
                                <i className="ph-fill ph-star" />
                              </span>
                              <span className="text-xs fw-bold text-gray-600">
                                ({reviews.toLocaleString("en-IN")})
                              </span>
                            </div>

                            <Link
                              to={`/product-details?id=${sp.id}`}
                              className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
                            >
                              View Spectacles <i className="ph ph-arrow-up-right" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* One-row scroller; keep your original card look/size */}
      <style>{`
        .reco-one-row-scroll{
          display: flex;
          gap: 12px;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 6px;
          scroll-snap-type: x proximity;
        }
        .reco-one-row-scroll::-webkit-scrollbar{ height: 8px; }
        .reco-one-row-scroll::-webkit-scrollbar-thumb{ background: #e5e7eb; border-radius: 8px; }

        .reco-card-wrap{
          flex: 0 0 auto;
          width: 220px; /* matches the visual width of your original card */
          scroll-snap-align: start;
        }

        .product-card__thumb img{
          max-width: 100%;
          height: auto;
          display: block;
        }
      `}</style>
    </section>
  );
};

export default RecommendedOne;
