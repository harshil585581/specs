import React from "react";

const ShippingOne = () => {
  return (
    <>
      <style>
        {`
        /* ==== Equal Height Cards ==== */
        .shipping-item {
          display: flex;
          align-items: center;
          gap: 16px;
          border-radius: 16px;
          background-color: #d0e3ff; /* same as bg-main-50 */
          transition: all 0.3s ease;
          height: 100%;
          padding: 20px;
        }

        /* Make all cards same height */
        .equal-card {
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        /* Hover effect */
        .shipping-item:hover {
          background-color: #dbe8ff; /* similar to hover-bg-main-100 */
          transform: translateY(-4px);
        }

        /* Icon Circle */
        .icon-circle {
          width: 56px;
          height: 56px;
          background-color: #001d3d; /* main brand color */
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        /* Icon hover animation */
        .shipping-item:hover .icon-circle {
          transform: scale(1.1);
        }

        /* Text section */
        .shipping-text h6 {
          font-weight: 600;
          font-size: 23px;
          color: #001d3d;
        }

        .shipping-text span {
          font-size: 14px;
          color: #333;
        }

        /* Responsive layout for mobile */
        @media (max-width: 575px) {
          .shipping-item {
            justify-content: center;
            text-align: center;
            flex-direction: column;
          }
          .icon-circle {
            margin-bottom: 8px;
          }
        }
      `}
      </style>

      <section className="shipping mb-24" id="shipping">
        <div className="container container-lg">
          <div className="row gy-4">
            {/* Card 1 */}
            <div className="col-xxl-3 col-sm-6">
              <div className="shipping-item equal-card">
                <span className="icon-circle">
                  <i className="ph-fill ph-car-profile" />
                </span>
                <div className="shipping-text">
                  <h6 className="mb-0">Free Shipping</h6>
                  <span className="text-sm text-heading">
                    Enjoy free shipping always <br />
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-xxl-3 col-sm-6">
              <div className="shipping-item equal-card">
                <span className="icon-circle">
                  <i className="ph-fill ph-hand-heart" />
                </span>
                <div className="shipping-text">
                  <h6 className="mb-0">100% Satisfaction</h6>
                  <span className="text-sm text-heading">
                    Your Happiness is Our Priority
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-xxl-3 col-sm-6">
              <div className="shipping-item equal-card">
                <span className="icon-circle">
                  <i className="ph-fill ph-credit-card" />
                </span>
                <div className="shipping-text">
                  <h6 className="mb-0">Secure Payments</h6>
                  <span className="text-sm text-heading">
                    Safe & Secure Checkout
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-xxl-3 col-sm-6">
              <div className="shipping-item equal-card">
                <span className="icon-circle">
                  <i className="ph-fill ph-chats" />
                </span>
                <div className="shipping-text">
                  <h6 className="mb-0">24/7 Support</h6>
                  <span className="text-sm text-heading">
                    Always Here to Help You
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShippingOne;
