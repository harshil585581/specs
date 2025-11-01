import React from "react";
import { Link } from "react-router-dom";

const FooterOne = () => {
  // ✅ Check login status from localStorage (adjust key if different)
  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  // ✅ Define redirect route
  const accountRoute = isLoggedIn ? "/profile" : "/account";

  return (
    <>
      <style>{`
        .footer {
          position: relative;
          background: #f8f9fa;
          padding: 80px 20px 40px;
          color: #333;
          font-family: "Poppins", sans-serif;
        }

        .footer-bg {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          opacity: 0.1;
          z-index: 0;
        }

        .footer-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 40px;
          align-items: start;
        }

        .footer-item {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-logo img {
          max-width: 160px;
          margin-bottom: 10px;
        }

        .footer-desc {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #444;
          font-size: 14px;
        }

        .icon {
          background: hsl(217, 80%, 55%);
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .contact-link {
          color: #333;
          text-decoration: none;
        }

        .contact-link:hover {
          color: #001d3d;
        }

        .footer-title {
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 10px;
          color: #000;
        }

        .footer-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-menu li {
          margin-bottom: 10px;
        }

        .footer-menu li a {
          color: #666;
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-menu li a:hover {
          color: #001d3d;
        }

        .social-section {
          margin-top: 10px;
        }

        .social-list {
          display: flex;
          gap: 12px;
          list-style: none;
          padding: 0;
          margin-top: 8px;
        }

        .social-list a {
          width: 40px;
          height: 40px;
          background: #e9ecef;
          color: #001d3d;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          transition: all 0.3s;
        }

        .social-list a:hover {
          background: #001d3d;
          color: white;
        }

        .footer-bottom {
          margin-top: 50px;
          text-align: center;
          border-top: 1px solid #ddd;
          padding-top: 20px;
          font-size: 14px;
          color: #666;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .footer {
            padding: 60px 20px 30px;
          }

          .footer-grid {
            gap: 30px;
          }
        }

        @media (max-width: 576px) {
          .footer {
            padding: 50px 15px 20px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .contact-item {
            justify-content: center;
          }

          .social-list {
            justify-content: center;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Info */}
            <div className="footer-item">
              <div className="footer-logo">
                <Link to="/">
                  <img src="assets/images/logo/logo.png" alt="Logo" />
                </Link>
              </div>
              {/* <p className="footer-desc">
                We're <strong style={{ color: "#001d3d" }}>Specskraft</strong>,
                dedicated to bringing clarity and confidence through our
                expertly crafted spectacles.
              </p> */}

              <div className="footer-contact">
                <div className="contact-item">
                  <i className="ph-fill ph-phone-call icon" />
                  <a href="tel:+918310286381" className="contact-link" style={{marginTop:"4px"}}>
                    +91 83102 86381
                  </a>
                </div>
                <div className="contact-item">
                  <i className="ph-fill ph-envelope icon" />
                  <a
                    href="mailto:specskraft.info@gmail.com"
                    className="contact-link"
                  >
                    specskraft.info@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div className="footer-item">
              <h6 className="footer-title">Customer Support</h6>
              <ul className="footer-menu">
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
                </li>
              </ul>
            </div>

            {/* My Account */}
            <div className="footer-item">
              <h6 className="footer-title">My Account</h6>
              <ul className="footer-menu">
                <li>
                  <Link to={accountRoute}>My Account</Link>
                </li>
                <li>
                  <Link to={accountRoute}>Shopping Cart</Link>
                </li>
                <li>
                  <Link to={accountRoute}>Wishlist</Link>
                </li>
              </ul>
            </div>

            {/* Social Icons */}
            <div className="footer-item social-section">
              <h6 className="footer-title">Follow Us</h6>
              <ul className="social-list">
                <li>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ph-fill ph-facebook-logo"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ph-fill ph-twitter-logo"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ph-fill ph-instagram-logo"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ph-fill ph-linkedin-logo"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 Specskraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterOne;
