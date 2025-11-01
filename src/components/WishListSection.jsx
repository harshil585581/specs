import React from "react";
import { Link } from "react-router-dom";

const WishListSection = () => {
  return (
    <section className="cart py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-lg-11">
            <div className="cart-table border border-gray-100 rounded-8">
              <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                <table className="table rounded-8 overflow-hidden">
                  <thead>
                    <tr className="border-bottom border-neutral-100">
                      <th className="h6 mb-0 text-lg fw-bold px-40 py-32">
                        Product Name
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* Row 1 */}
                    <tr>
                      <td className="px-40 py-32">
                        <div className="table-product d-flex align-items-center gap-24 flex-wrap">
                          <Link
                            to="/product-details-two"
                            className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                          >
                            <img
                              src="assets/images/thumbs/product-two-img1.png"
                              alt=""
                            />
                          </Link>

                          <div className="table-product__content text-start">
                            <h6 className="title text-lg fw-semibold mb-8">
                              <Link
                                to="/product-details"
                                className="link text-line-2"
                                tabIndex={0}
                              >
                                Taylor Farms Broccoli Florets Vegetables
                              </Link>
                            </h6>

                            {/* Reviews */}
                            <div className="flex-align gap-16 mb-16">
                              <div className="flex-align gap-6">
                                <span className="text-md fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-md fw-semibold text-gray-900">
                                  4.8
                                </span>
                              </div>
                              <span className="text-sm fw-medium text-gray-200">|</span>
                              <span className="text-neutral-600 text-sm">
                                128 Reviews
                              </span>
                            </div>

                            {/* Price: New + Old (strike-through) */}
                            <div className="flex-align gap-12">
                              <span className="text-lg fw-semibold text-gray-900">
                                $125.00
                              </span>
                              <span className="text-md fw-semibold text-gray-500 text-decoration-line-through">
                                $149.00
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr>
                      <td className="px-40 py-32">
                        <div className="table-product d-flex align-items-center gap-24 flex-wrap">
                          <Link
                            to="/product-details-two"
                            className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                          >
                            <img
                              src="assets/images/thumbs/product-two-img3.png"
                              alt=""
                            />
                          </Link>

                          <div className="table-product__content text-start">
                            <h6 className="title text-lg fw-semibold mb-8">
                              <Link
                                to="/product-details"
                                className="link text-line-2"
                                tabIndex={0}
                              >
                                Smart Phone With Intel Celeron
                              </Link>
                            </h6>

                            {/* Reviews */}
                            <div className="flex-align gap-16 mb-16">
                              <div className="flex-align gap-6">
                                <span className="text-md fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-md fw-semibold text-gray-900">
                                  4.8
                                </span>
                              </div>
                              <span className="text-sm fw-medium text-gray-200">|</span>
                              <span className="text-neutral-600 text-sm">
                                128 Reviews
                              </span>
                            </div>

                            {/* Price: New + Old (strike-through) */}
                            <div className="flex-align gap-12">
                              <span className="text-lg fw-semibold text-gray-900">
                                $125.00
                              </span>
                              <span className="text-md fw-semibold text-gray-500 text-decoration-line-through">
                                $149.00
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr>
                      <td className="px-40 py-32">
                        <div className="table-product d-flex align-items-center gap-24 flex-wrap">
                          <Link
                            to="/product-details-two"
                            className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                          >
                            <img
                              src="assets/images/thumbs/product-two-img14.png"
                              alt=""
                            />
                          </Link>

                          <div className="table-product__content text-start">
                            <h6 className="title text-lg fw-semibold mb-8">
                              <Link
                                to="/product-details"
                                className="link text-line-2"
                                tabIndex={0}
                              >
                                HP Chromebook With Intel Celeron
                              </Link>
                            </h6>

                            {/* Reviews */}
                            <div className="flex-align gap-16 mb-16">
                              <div className="flex-align gap-6">
                                <span className="text-md fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-md fw-semibold text-gray-900">
                                  4.8
                                </span>
                              </div>
                              <span className="text-sm fw-medium text-gray-200">|</span>
                              <span className="text-neutral-600 text-sm">
                                128 Reviews
                              </span>
                            </div>

                            {/* Price: New + Old (strike-through) */}
                            <div className="flex-align gap-12">
                              <span className="text-lg fw-semibold text-gray-900">
                                $125.00
                              </span>
                              <span className="text-md fw-semibold text-gray-500 text-decoration-line-through">
                                $149.00
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Row 4 */}
                    <tr>
                      <td className="px-40 py-32">
                        <div className="table-product d-flex align-items-center gap-24 flex-wrap">
                          <Link
                            to="/product-details-two"
                            className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                          >
                            <img
                              src="assets/images/thumbs/product-two-img2.png"
                              alt=""
                            />
                          </Link>

                          <div className="table-product__content text-start">
                            <h6 className="title text-lg fw-semibold mb-8">
                              <Link
                                to="/product-details"
                                className="link text-line-2"
                                tabIndex={0}
                              >
                                Smart watch With Intel Celeron
                              </Link>
                            </h6>

                            {/* Reviews */}
                            <div className="flex-align gap-16 mb-16">
                              <div className="flex-align gap-6">
                                <span className="text-md fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-md fw-semibold text-gray-900">
                                  4.8
                                </span>
                              </div>
                              <span className="text-sm fw-medium text-gray-200">|</span>
                              <span className="text-neutral-600 text-sm">
                                128 Reviews
                              </span>
                            </div>

                            {/* Price: New + Old (strike-through) */}
                            <div className="flex-align gap-12">
                              <span className="text-lg fw-semibold text-gray-900">
                                $125.00
                              </span>
                              <span className="text-md fw-semibold text-gray-500 text-decoration-line-through">
                                $149.00
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {/* End rows */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* /col */}
        </div>
      </div>
    </section>
  );
};

export default WishListSection;
