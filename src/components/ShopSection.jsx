import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReactSlider from "react-slider";

/* API base */
const API_ROOT = (process.env.REACT_APP_API_BASE || "").trim().replace(/\/+$/g, "");
const API_BASE = (API_ROOT ? API_ROOT : "") + "/api/adminboard";

/* Helpers */
const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const cleanStr = (v) => (v == null ? "" : String(v));
const uniqueNonEmpty = (arr) => [...new Set(arr.map(cleanStr).filter(Boolean))];

/* Stars with fractional fill */
const FractionalStars = ({ rating = 0 }) => {
  const pct = Math.max(0, Math.min(100, (toNumber(rating) / 5) * 100));
  const stars = Array.from({ length: 5 });

  const row = (filled) => (
    <span className="text-15 fw-medium d-flex" style={{ gap: 2 }}>
      {stars.map((_, i) => (
        <i
          key={i}
          className={`ph-fill ph-star ${filled ? "text-warning-600" : "text-gray-400"}`}
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

/* Card */
const ProductCard = ({ product }) => {
  const rating = toNumber(product.rating, 0);
  const oldPrice = toNumber(product.old_price, 0);
  const newPrice = toNumber(product.new_price ?? product.price, 0);
  const imageUrl = cleanStr(product.image1 || product.image || "");

  return (
    <div className="product-card skshop-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
      <Link
        to={`/product-details/${product.id}`}
        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative skshop-thumb"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-auto skshop-thumb-img"
            draggable="false"
          />
        ) : (
          <div
            style={{
              width: 160,
              height: 120,
              background: "#f3f4f6",
              borderRadius: 8,
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
      </Link>

      <div className="product-card__content mt-16 text-center d-flex flex-column align-items-center w-100">
        <h6 className="title text-lg fw-semibold mt-12 mb-8 skshop-title">
          <Link to={`/product-details/${product.id}`} className=" text-line-2" tabIndex={0}>
            {product.name}
          </Link>
        </h6>

        <div className="flex-align gap-6" style={{ paddingTop: "6px" }}>
          <span className=" fw-medium text-gray-500">{rating.toFixed(1)}</span>
          <FractionalStars rating={rating} />
          <span className=" fw-medium text-gray-500">
            ({cleanStr(product.review_count) || "0"})
          </span>
        </div>

        <div className="product-card__price my-20">
          {oldPrice > 0 && (
            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
              Rs{oldPrice.toFixed(2)}
            </span>
          )}
          <span
            className="text-heading fw-semibold "
            style={{ marginLeft: oldPrice > 0 ? 8 : 0, fontSize: "15px" }}
          >
            Rs{newPrice.toFixed(2)} <span className="text-gray-500 fw-normal">/Qty</span>{" "}
          </span>
        </div>

        <Link
          to={`/product-details/${product.id}`}
          className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium w-100"
          tabIndex={0}
        >
          View Spectacles <i className="ph ph-shopping-cart" />
        </Link>
      </div>
    </div>
  );
};

/* Main */
const ShopSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters + view
  const [grid, setGrid] = useState(false);
  const [active, setActive] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [sliderMax, setSliderMax] = useState(3000);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null); // NEW: size filter
  const [sortOption, setSortOption] = useState("Popular");

  const sidebarController = () => setActive((s) => !s);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/list-spectacles/`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        const normalized = (Array.isArray(data) ? data : []).map((p) => ({
          id: p.id,
          name: cleanStr(p.name),
          model_name: cleanStr(p.model_name || ""),
          category: cleanStr(p.category),
          rating: toNumber(p.rating, 0),
          review_count: cleanStr(p.review_count || ""),
          old_price: toNumber(p.old_price, 0),
          new_price: toNumber(p.new_price, 0),
          color: cleanStr(p.color),
          size: cleanStr(p.size || ""), // NEW: carry size from backend
          image1: cleanStr(p.image1 || ""),
        }));

        if (!cancelled) {
          setProducts(normalized);
          const prices = normalized.map((x) => toNumber(x.new_price) || toNumber(x.old_price) || 0);
          const maxP = Math.max(0, ...prices);
          const maxRounded = Math.ceil(maxP || 3000);
          setSliderMax(maxRounded);
          setPriceRange([0, maxRounded]);
        }
      } catch (e) {
        console.error("load spectacles error:", e);
        if (!cancelled) {
          setProducts([]);
          setSliderMax(3000);
          setPriceRange([0, 3000]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => uniqueNonEmpty(products.map((p) => p.category)), [products]);
  const colors = useMemo(() => uniqueNonEmpty(products.map((p) => p.color)), [products]);
  const sizes = useMemo(() => uniqueNonEmpty(products.map((p) => p.size)), [products]); // NEW

  /* Bucketed rating data & counts */
  const ratingData = useMemo(() => {
    const total = products.length || 1;
    const rows = [];
    for (let r = 5; r >= 1; r--) {
      let count = 0;
      if (r === 5) {
        count = products.filter((p) => Math.floor(toNumber(p.rating)) === 5).length;
      } else {
        const lo = r;
        const hi = r + 1;
        count = products.filter((p) => {
          const val = toNumber(p.rating);
          return val >= lo && val < hi;
        }).length;
      }
      rows.push({
        rating: r,
        count,
        percentage: Math.round((count / total) * 100),
      });
    }
    return rows;
  }, [products]);

  /* Filtering + sorting */
  const filteredProducts = useMemo(() => {
    let list = products.slice();

    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    list = list.filter((p) => {
      const price = toNumber(p.new_price) || toNumber(p.old_price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (selectedRating) {
      if (selectedRating === 5) {
        list = list.filter((p) => Math.floor(toNumber(p.rating)) === 5);
      } else {
        const lo = selectedRating;
        const hi = selectedRating + 1;
        list = list.filter((p) => {
          const r = toNumber(p.rating);
          return r >= lo && r < hi;
        });
      }
    }

    if (selectedColor) list = list.filter((p) => p.color === selectedColor);

    if (selectedSize) list = list.filter((p) => p.size === selectedSize); // NEW

    switch (sortOption) {
      case "Latest":
        list.sort((a, b) => b.id - a.id);
        break;
      case "PriceAsc":
        list.sort(
          (a, b) =>
            (toNumber(a.new_price) || toNumber(a.old_price)) -
            (toNumber(b.new_price) || toNumber(b.old_price))
        );
        break;
      case "PriceDesc":
        list.sort(
          (a, b) =>
            (toNumber(b.new_price) || toNumber(b.old_price)) -
            (toNumber(a.new_price) || toNumber(a.old_price))
        );
        break;
      case "Trending":
        list.sort((a, b) => toNumber(b.rating) - toNumber(a.rating));
        break;
      case "Popular":
      default:
        list.sort((a, b) => toNumber(b.rating) - toNumber(a.rating));
        break;
    }
    return list;
  }, [products, selectedCategory, priceRange, selectedRating, selectedColor, selectedSize, sortOption]);

  const totalResults = filteredProducts.length;
  const productsToDisplay = filteredProducts.slice(0, 20);

  const getFilterCount = (type, value) =>
    products.filter((p) => cleanStr(p[type]) === cleanStr(value)).length;

  return (
    <section className="shop" style={{paddingTop:"40px", paddingBottom:"60px"}}>
      <div className={`side-overlay ${active && "show"}`} onClick={sidebarController}></div>
      <div className="container container-lg">
        <div className="row">
          {/* Sidebar Start */}
          <div className="col-lg-3">
            <div className={`shop-sidebar ${active && "active"}`}>
              <button
                onClick={sidebarController}
                type="button"
                className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
              >
                <i className="ph ph-x" />
              </button>

              {/* Product Category */}
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Product Category</h6>
                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  {categories.map((cat) => (
                    <li className="mb-24" key={cat}>
                      <button
                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        className={`text-gray-900 hover-text-main-600 w-100 text-start ${
                          selectedCategory === cat ? "fw-bold text-main-600" : ""
                        }`}
                        style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
                      >
                        {cat} ({getFilterCount("category", cat)})
                      </button>
                    </li>
                  ))}
                  <li className="mb-0">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-danger-600 fw-bold mt-8"
                      style={{
                        border: "none",
                        background: "none",
                        padding: 0,
                        cursor: "pointer",
                        visibility: selectedCategory ? "visible" : "hidden",
                      }}
                    >
                      Clear Category Filter
                    </button>
                  </li>
                </ul>
              </div>

              {/* Price */}
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Filter by Price</h6>
                <div className="custom--range">
                  <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="example-thumb"
                    trackClassName="example-track"
                    min={0}
                    max={sliderMax}
                    value={priceRange}
                    onAfterChange={setPriceRange}
                    ariaLabel={["Lower thumb", "Upper thumb"]}
                    renderThumb={(props, state) => {
                      const { key, ...restProps } = props;
                      const thumbStyle =
                        state.index === 1
                          ? { whiteSpace: "nowrap", transform: "translateX(-100%)" }
                          : { whiteSpace: "nowrap", transform: "translateX(-50%)" };
                      return (
                        <div
                          {...restProps}
                          key={state.index}
                          style={{ ...restProps.style, ...thumbStyle }}
                        >
                          ₹{state.valueNow.toFixed(0)}
                        </div>
                      );
                    }}
                    pearling
                    minDistance={1}
                  />
                  <br />
                  <br />
                  <div
                    className="flex-between flex-wrap gap-8 mt-24"
                    style={{ alignItems: "center" }}
                  >
                    <button
                      type="button"
                      onClick={() => setPriceRange([...priceRange])}
                      className="btn btn-main h-40 flex-align"
                      style={{ flexShrink: 0 }}
                    >
                      Filter
                    </button>
                  </div>
                </div>
              </div>

              {/* Color */}
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Filter by Color</h6>
                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  {colors.map((color, idx) => {
                    let checkedClass = `checked-${color.toLowerCase().replace(/\s/g, "-")}`;
                    const cl = color.toLowerCase();
                    if (cl === "blue") checkedClass = "checked-primary";
                    if (cl === "green") checkedClass = "checked-success";
                    if (cl === "red") checkedClass = "checked-danger";
                    if (cl === "purple") checkedClass = "checked-purple";
                    if (cl === "gray") checkedClass = "checked-gray";
                    if (cl === "white") checkedClass = "checked-white";
                    if (cl === "black") checkedClass = "checked-black";

                    const count = getFilterCount("color", color);

                    return (
                      <li className="mb-24" key={color || idx}>
                        <div className={`form-check common-check common-radio ${checkedClass}`}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="colorFilter"
                            id={`color${idx + 1}`}
                            checked={selectedColor === color}
                            onChange={() => setSelectedColor(color)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`color${idx + 1}`}
                            onClick={() =>
                              setSelectedColor(selectedColor === color ? null : color)
                            }
                          >
                            {color || "Unspecified"} ({count})
                          </label>
                        </div>
                      </li>
                    );
                  })}
                  <li className="mb-0 mt-24">
                    <button
                      onClick={() => setSelectedColor(null)}
                      className="text-danger-600 fw-bold"
                      style={{
                        border: "none",
                        background: "none",
                        padding: 0,
                        cursor: "pointer",
                        visibility: selectedColor ? "visible" : "hidden",
                      }}
                    >
                      Clear Color Filter
                    </button>
                  </li>
                </ul>
              </div>

              {/* Size (NEW) */}
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Filter by Size</h6>
                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  {sizes.map((sz, idx) => {
                    const count = getFilterCount("size", sz);
                    return (
                      <li className="mb-24" key={sz || idx}>
                        <div className="form-check common-check common-radio">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="sizeFilter"
                            id={`size${idx + 1}`}
                            checked={selectedSize === sz}
                            onChange={() => setSelectedSize(sz)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`size${idx + 1}`}
                            onClick={() =>
                              setSelectedSize(selectedSize === sz ? null : sz)
                            }
                          >
                            {sz || "Unspecified"} ({count})
                          </label>
                        </div>
                      </li>
                    );
                  })}
                  <li className="mb-0 mt-24">
                    <button
                      onClick={() => setSelectedSize(null)}
                      className="text-danger-600 fw-bold"
                      style={{
                        border: "none",
                        background: "none",
                        padding: 0,
                        cursor: "pointer",
                        visibility: selectedSize ? "visible" : "hidden",
                      }}
                    >
                      Clear Size Filter
                    </button>
                  </li>
                </ul>
              </div>

              {/* Rating */}
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Filter by Rating</h6>
                {ratingData.map((data) => (
                  <div key={data.rating} className="flex-align gap-8 position-relative mb-20">
                    <label
                      className="position-absolute w-100 h-100 cursor-pointer"
                      htmlFor={`rating${data.rating}`}
                      onClick={() =>
                        setSelectedRating(selectedRating === data.rating ? null : data.rating)
                      }
                    >
                      {" "}
                    </label>
                    <div className="common-check common-radio mb-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="ratingFilter"
                        id={`rating${data.rating}`}
                        checked={selectedRating === data.rating}
                        onChange={() => setSelectedRating(data.rating)}
                      />
                    </div>
                    <div
                      className="progress w-100 bg-gray-100 rounded-pill h-8"
                      role="progressbar"
                      aria-label={`Rating ${data.rating} bucket`}
                      aria-valuenow={data.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="progress-bar bg-main-600 rounded-pill"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                    <div className="flex-align gap-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs fw-medium d-flex ${
                            i < data.rating ? "text-warning-600" : "text-gray-400"
                          }`}
                        >
                          <i className="ph-fill ph-star" />
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-900 flex-shrink-0">
                      {data.count}
                    </span>
                  </div>
                ))}
                {selectedRating && (
                  <button
                    onClick={() => setSelectedRating(null)}
                    className="text-danger-600 fw-bold mt-8"
                    style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
                  >
                    Clear Rating Filter
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Sidebar End */}

          {/* Content Start */}
          <div className="col-lg-9">
            {/* Top */}
            <div className="flex-between gap-16 flex-wrap mb-40 ">
              <span className="text-gray-900">
                {loading
                  ? "Loading…"
                  : `Showing 1-${Math.min(productsToDisplay.length, 20)} of ${totalResults} result`}
              </span>
              <div className="position-relative flex-align gap-16 flex-wrap">
                <div className="list-grid-btns flex-align gap-16">
                  <button
                    onClick={() => setGrid(true)}
                    type="button"
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${
                      grid === true && "border-main-600 text-white bg-main-600"
                    }`}
                  >
                    <i className="ph-bold ph-list-dashes" />
                  </button>
                </div>
                <div className="position-relative text-gray-500 flex-align gap-4 text-14">
                  <label htmlFor="sorting" className="text-inherit flex-shrink-0">
                    Sort by:{" "}
                  </label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="form-control common-input px-14 py-14 text-inherit rounded-6 w-auto"
                    id="sorting"
                  >
                    <option value="Popular">Popular</option>
                    <option value="Latest">Latest</option>
                    <option value="PriceAsc">Price: Low to High</option>
                    <option value="PriceDesc">Price: High to Low</option>
                    <option value="Trending">Trending</option>
                  </select>
                </div>
                <button
                  onClick={sidebarController}
                  type="button"
                  className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
                >
                  <i className="ph-bold ph-funnel" />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className={`list-grid-wrapper skshop-grid ${grid && "list-view"}`}>
              {loading ? (
                <div className="text-center w-100 p-5">
                  <p className="text-xl text-gray-600">Loading products…</p>
                </div>
              ) : productsToDisplay.length > 0 ? (
                productsToDisplay.map((product) => <ProductCard key={product.id} product={product} />)
              ) : (
                <div className="text-center w-100 p-5">
                  <p className="text-xl text-gray-600">No products match your current filters. 😔</p>
                </div>
              )}
            </div>

            {/* Pagination (placeholder) */}
            {totalResults > 20 && !loading && (
              <ul className="pagination flex-center flex-wrap gap-16">
                <li className="page-item">
                  <Link
                    className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    to="#"
                  >
                    <i className="ph-bold ph-arrow-left" />
                  </Link>
                </li>
                <li className="page-item active">
                  <Link
                    className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    to="#"
                  >
                    01
                  </Link>
                </li>
                <li className="page-item">
                  <Link
                    className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    to="#"
                  >
                    02
                  </Link>
                </li>
                <li className="page-item">
                  <Link
                    className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    to="#"
                  >
                    <i className="ph-bold ph-arrow-right" />
                  </Link>
                </li>
              </ul>
            )}
          </div>
          {/* Content End */}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
