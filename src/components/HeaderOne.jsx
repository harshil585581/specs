import React, { useEffect, useRef, useState } from "react";
import query from "jquery";
import { Link, NavLink, useNavigate } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_BASE || "") + "/api";

const HeaderOne = () => {
  const [scroll, setScroll] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSearch, setActiveSearch] = useState(false);
  const [activeCategory, setActiveCategory] = useState(false);
  const [activeIndexCat, setActiveIndexCat] = useState(null);
  const [user, setUser] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScroll(window.pageYOffset > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // measure header height (for spacer to avoid layout shift)
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight || 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const selectElement = query(".js-example-basic-single");
    if (selectElement.length && typeof selectElement.select2 === "function") {
      selectElement.select2();
    }
    return () => {
      if (selectElement?.data && selectElement.data("select2")) {
        selectElement.select2("destroy");
      }
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/me/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem("username", data.username);
        } else {
          handleLogout();
        }
      } catch (e) {
        console.error("Profile fetch failed:", e);
        handleLogout();
      }
    };
    fetchProfile();
  }, []);

  const handleMenuClick = (index) =>
    setActiveIndex(activeIndex === index ? null : index);
  const handleMenuToggle = () => setMenuActive(!menuActive);
  const handleSearchToggle = () => setActiveSearch(!activeSearch);
  const handleCategoryToggle = () => setActiveCategory(!activeCategory);
  const handleCatClick = (index) =>
    setActiveIndexCat(activeIndexCat === index ? null : index);

  const username = user?.username || localStorage.getItem("username") || null;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setUser(null);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (!username) navigate("/account");
    else navigate("/profile");
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!username) navigate("/account");
    else navigate("/cart");
  };

  return (
    <>
      <style>{`
        /* --- Layout + fixed header --- */
        .header-middle {
          position: fixed; /* fixed header */
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 1030;
          transition: background .25s ease, box-shadow .25s ease, backdrop-filter .25s ease;
          will-change: backdrop-filter, background, box-shadow;
          background: #ffffff; /* initial on page top */
        }
        .header-middle.glass {
          background: rgba(208, 227, 255, 0.62);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(7.5px);
          -webkit-backdrop-filter: blur(7.5px);
        }
        .header-spacer {
          height: ${headerHeight}px;
        }

        /* equal 3-column layout */
        .header-middle-grid {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 24px;
        }
        .center-nav-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }
        .center-nav {
          display: flex;
          align-items: center;
          gap: 20px;
          white-space: nowrap;
        }
        .center-nav a { text-decoration: none; }
        .center-nav .nav-menu__link { padding: 8px 6px; }

        .center-search {
          min-width: 320px;
          max-width: 520px;
          width: 40%;
        }
        .center-search .form-control {
          background: #fff; border: 1px solid #E5E7EB;
        }

        /* Overlay for side panels */
        .side-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.45);
          opacity: 0; visibility: hidden;
          transition: opacity .25s ease, visibility .25s ease;
          z-index: 1040;
        }
        .side-overlay.show { opacity: 1; visibility: visible; }

        /* Mobile sidebar — right slide-in */
        .mobile-menu {
          position: fixed; top: 0; right: 0; left: auto;
          height: 100vh; width: 320px; max-width: 86vw;
          background: #fff; box-shadow: 0 0 24px rgba(0,0,0,.12);
          transform: translateX(100%); transition: transform .3s ease;
          z-index: 1050;
        }
        .mobile-menu.active { transform: translateX(0); }
        .mobile-menu .close-button {
          position: absolute; top: 12px; left: 12px;
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid #eee; background: #fff;
        }
        .mobile-menu__inner { height: 100%; overflow-y: auto; padding: 56px 16px 24px; }

        /* Mobile ≤ 991px */
        @media (max-width: 991px) {
          .logo img { max-height: 36px; width: auto; }
          .center-nav-wrap { display: none !important; }
          .account-topbar { display: none !important; }
          .mobile-search-slide {
            display: block; max-height: 0; overflow: hidden; transition: max-height .3s ease;
          }
          .mobile-search-slide.open { max-height: 200px; }

          .icon-btn {
            background: transparent; border: 0; padding: 0; margin: 0;
            display: inline-flex; align-items: center; justify-content: center;
            width: 32px; height: 32px; font-size: 24px; line-height: 1; color: #111827;
          }
          .icon-btn:focus { outline: 2px solid #E5E7EB; outline-offset: 2px; border-radius: 50%; }
          .header-right .gap-24 { gap: 16px !important; }
        }

        @media (min-width: 992px) { .mobile-search-slide { display: none !important; } }
        @media (max-width: 1127px) { .mvtext{ display: none !important; } }
        @media (max-width: 991px) { .alignrightmobile{ justify-content: right !important; } }

        /* Simple link reset for username */
        .username-link { 
          display: inline-flex; align-items: center; gap: 8px;
          color: #000; text-decoration: none;
        }
        .username-link:hover { opacity: .85; }

        .headermaxwidth{
            max-width: 1328px;
          }

        .psize{
            font-size:15px; 
          }
      `}</style>

      {/* click-overlay for mobile side panels */}
      <div
        className={`side-overlay ${(menuActive || activeCategory) ? "show" : ""}`}
        onClick={() => {
          setMenuActive(false);
          setActiveCategory(false);
          setActiveIndex(null);
        }}
        aria-hidden={!menuActive && !activeCategory}
      />

      {/* Optional full-screen search (desktop) */}
      <form action="#" className={`search-box ${activeSearch && "active"}`}>
        <button
          onClick={handleSearchToggle}
          type="button"
          className="search-box__close position-absolute inset-block-start-0 inset-inline-end-0 m-16 w-48 h-48 border border-gray-100 rounded-circle flex-center text-white hover-text-gray-800 hover-bg-white text-2xl transition-1"
        >
          <i className="ph ph-x" />
        </button>
        <div className="container">
          <div className="position-relative">
            <input
              type="text"
              className="form-control py-16 px-24 text-xl rounded-pill pe-64"
              placeholder="Search for a product or brand"
            />
            <button
              type="submit"
              className="w-48 h-48 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-8"
            >
              <i className="ph ph-magnifying-glass" />
            </button>
          </div>
        </div>
      </form>

      {/* Mobile sidebar (right) */}
      <div
        className={`mobile-menu scroll-sm d-lg-none d-block ${menuActive ? "active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <button
          onClick={() => {
            handleMenuToggle();
            setActiveIndex(null);
          }}
          type="button"
          className="close-button"
          aria-label="Close menu"
        >
          <i className="ph ph-x" />
        </button>
        <div className="mobile-menu__inner">
          <Link to="/" className="mobile-menu__logo" onClick={() => setMenuActive(false)}>
            <img src="assets/images/logo/logo.jpeg" alt="Logo" />
          </Link>
          <div className="mobile-menu__menu">
            <ul className="nav-menu flex-align nav-menu--mobile">
              {/* Account block – simplified after login */}
              <li className="nav-menu__item">
                {username ? (
                  <div className="py-10">
                    <div className="text-md fw-medium mb-8" style={{color:"#001d3d"}}>Hi, {username}</div>
                    <div className="d-flex flex-column gap-6" >
                      <Link
                        to="/profile"
                        onClick={() => setMenuActive(false)}
                        className="nav-submenu__link hover-bg-gray-100 text-sm py-8 px-12 d-block " style={{color:"#001d3d"}}
                      >
                        PROFILE
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/account"
                    onClick={() => setMenuActive(false)}
                    className="nav-menu__link"
                  >
                    Account
                  </Link>
                )}
              </li>

              {/* Home */}
              <li
                onClick={() => handleMenuClick(0)}
                className={`on-hover-item nav-menu__item has-submenu ${activeIndex === 0 ? "d-block" : ""}`}
              >
                <Link to="/" className="nav-menu__link">Home</Link>
              </li>

              {/* Shop */}
              <li
                onClick={() => handleMenuClick(1)}
                className={`on-hover-item nav-menu__item has-submenu ${activeIndex === 1 ? "d-block" : ""}`}
              >
                <Link to="/shop" className="nav-menu__link">Shop</Link>
              </li>

              {/* Contact */}
              <li className="nav-menu__item" style={{color:"black"}}>
                <Link
                  to="/contact"
                  className="nav-menu__link"
                  onClick={() => { setActiveIndex(null); setMenuActive(false); }}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ===== FIXED Header (glass on scroll) ===== */}
      <header
        ref={headerRef}
        className={`header-middle ${scroll ? "glass" : ""} border-bottom border-gray-100`}
      >
        <div className="container container-lg headermaxwidth">
          <nav className="header-inner header-middle-grid">
            {/* Left: Logo */}
            <div className="logo">
              <Link to="/" className="link">
                <img src="assets/images/logo/logo.jpeg" alt="Logo" />
              </Link>
            </div>

            {/* Center: Desktop nav + inline search */}
            <div className="center-nav-wrap d-none d-lg-flex">
              <ul className="center-nav nav-menu">
                <li className="nav-menu__item" style={{color:"black"}}>
                  <NavLink
                    to="/"
                    className={(n) => n.isActive ? "nav-menu__link activePage psize" : "nav-menu__link"}
                    style={{color:"black"}}
                  >
                    HOME
                  </NavLink>
                </li>
                <li className="on-hover-item nav-menu__item has-submenu">
                  <Link to="/shop" className="nav-menu__link psize" style={{color:"black"}}>
                    SHOP
                  </Link>
                </li>
                <li className="nav-menu__item">
                  <NavLink
                    to="/contact"
                    className={(n) => n.isActive ? "nav-menu__link activePage psize" : "nav-menu__link psize"}
                    style={{color:"black"}}
                  >
                    CONTACT US
                  </NavLink>
                </li>
              </ul>

              {/* inline search on desktop */}
              <div className="center-search">
                <form className="w-100">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control py-8 px-12 rounded-pill pe-48"
                      placeholder='Search "flexible eyeglasses"'
                    />
                    <button
                      type="submit"
                      className="w-36 h-36 rounded-circle flex-center text-lg text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-6"
                      style={{ background: "#111827" }}
                    >
                      <i className="ph ph-magnifying-glass" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Account + Wishlist + Cart + Mobile buttons */}
            <div className="header-right flex-align alignrightmobile">
              <div className="d-flex align-items-center gap-24">

                {/* Account (desktop) – icon + username, no dropdown */}
                <div className="account-topbar d-none d-lg-block">
                  {username ? (
                    <Link to="/profile" className="username-link">
                      <span className="text-2xl d-flex" aria-hidden="true">
                        <i className="ph ph-user" />
                      </span>
                      <span className="fw-medium">{username}</span>
                    </Link>
                  ) : (
                    <Link to="/account" className="text-black text-md py-8 d-flex align-items-center">
                      <span className="text-2xl text-black d-flex position-relative me-6 mt-6">
                        <i className='ph ph-user' style={{marginBottom: '8px'}}/>
                      </span>
                      <span className="text-black d-none d-lg-flex mvtext psize">PROFILE</span>
                    </Link>
                  )}
                </div>

                {/* Mobile-only Search Button */}
                <button
                  type="button"
                  aria-label="Open mobile search"
                  className="icon-btn d-lg-none"
                  onClick={() => setMobileSearchOpen((s) => !s)}
                  aria-expanded={mobileSearchOpen}
                >
                  <i className="ph ph-magnifying-glass" />
                </button>

                {/* Wishlist */}
                <a href="#" onClick={handleWishlistClick} className="flex-align gap-4 item-hover">
                  <span className="text-2xl text-black d-flex position-relative me-6 mt-6 item-hover__text" style={{marginBottom:"8px"}}>
                    <i className="ph ph-heart" />
                  </span>
                  <span className="text-black item-hover__text d-none d-lg-flex mvtext psize">
                    WISHLIST
                  </span>
                </a>

                {/* Cart */}
                <a href="#" onClick={handleCartClick} className="flex-align gap-4 item-hover">
                  <span className="text-2xl text-black d-flex position-relative me-6 mt-6 item-hover__text" style={{marginBottom:"8px"}}>
                    <i className="ph ph-shopping-cart-simple" />
                  </span>
                  <span className=" text-black item-hover__text d-none d-lg-flex mvtext psize">
                    CART
                  </span>
                </a>

                {/* Mobile Hamburger */}
                <button
                  onClick={handleMenuToggle}
                  type="button"
                  className="icon-btn d-lg-none"
                  aria-label="Open menu"
                  aria-expanded={menuActive}
                >
                  <i className="ph ph-list" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer to offset fixed header height */}
      <div className="header-spacer" />

      {/* Minimal secondary header only for mobile slide-down search (kept) */}
      <header className={`header bg-white border-bottom border-gray-100`}>
        <div className={`mobile-search-slide ${mobileSearchOpen ? "open" : ""} d-lg-none`}>
          <div className="container container-lg py-10">
            <form className="w-100">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control py-10 px-16 rounded-pill pe-56"
                  placeholder="Search for a product or brand"
                  style={{ background: "#fff", border: "1px solid #E5E7EB" }}
                />
                <button
                  type="submit"
                  className="w-40 h-40 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-6"
                  style={{ background: "#111827" }}
                >
                  <i className="ph ph-magnifying-glass" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderOne;
