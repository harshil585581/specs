import React from "react";
import { Link } from "react-router-dom";

const TermsConditions = () => {
  return (
    <section className="blog-details" style={{paddingTop:"10px", paddingBottom:"80px", marginLeft:"3%", marginRight:"3%"}}>
      <div className="container container-lg">
        <div className="row gy-5">
          <div className="col-lg-12 pe-xl-4">
            <div className="blog-item-wrapper">
              <div className="blog-item">
                <div className="blog-item__content mt-24">
                  <h3 className="mb-20 text-main-600">TERMS & CONDITIONS</h3>
                  <p className="text-gray-700 mb-16">
                    Welcome to <strong style={{color:"#001d3d"}}>Specskraft</strong> your trusted
                    destination for high quality spectacles, powered lenses, and
                    eyewear accessories. These Terms and Conditions (“Terms”)
                    govern your access to and use of our website, products, and
                    services. By using this website, you agree to be legally
                    bound by these Terms. Please read them carefully before
                    making any purchase or using our services.
                  </p>

                  {/* Section 1 */}
                  <h5 className="mt-32 mb-12">1. Introduction</h5>
                  <p className="text-gray-700 mb-12">
                    Specskraft (“we,” “our,” “us”) operates this website to
                    provide customers with a seamless shopping experience for
                    eyewear and optical products. These Terms apply to all
                    users including visitors, registered users, and
                    customers. If you do not agree with these Terms, please
                    refrain from using our website or purchasing any products.
                  </p>

                  {/* Section 2 */}
                  <h5 className="mt-32 mb-12">2. Account Registration</h5>
                  <p className="text-gray-700 mb-8">
                    To access certain parts of our website or place orders, you
                    may be required to create an account. You agree to:
                  </p>
                  <ul className="text-gray-700 mb-12">
                    <li>• Provide accurate, complete, and up-to-date information.</li>
                    <li>• Keep your login credentials confidential and secure.</li>
                    <li>• Accept full responsibility for any activity under your account.</li>
                    <li>• Notify us immediately if you suspect unauthorized access or misuse.</li>
                  </ul>

                  {/* Section 3 */}
                  <h5 className="mt-32 mb-12">3. Product Information & Availability</h5>
                  <p className="text-gray-700 mb-12">
                    We strive to ensure that every product listed on Specskraft
                    is described accurately. Product images, descriptions, and
                    pricing are updated regularly, but minor variations in color
                    or size may occur due to lighting or screen settings.
                    Product availability is subject to stock, and we reserve the
                    right to discontinue or change items without prior notice.
                  </p>

                  {/* Section 4 */}
                  <h5 className="mt-32 mb-12">4. Pricing & Payments</h5>
                  <p className="text-gray-700 mb-8">
                    All prices listed on Specskraft are in Indian Rupees (INR)
                    and are inclusive of applicable taxes unless stated
                    otherwise. We accept secure payments through:
                  </p>
                  <ul className="text-gray-700 mb-12">
                    <li>• Debit/Credit Cards (Visa, Mastercard, Rupay)</li>
                    <li>• UPI and Net Banking</li>
                    <li>• Wallets and authorized third-party gateways</li>
                  </ul>
                  <p className="text-gray-700 mb-12">
                    By placing an order, you authorize us (or our payment
                    partner) to charge your selected method. Orders are
                    confirmed only after successful payment processing.
                  </p>

                  {/* Section 5 */}
                  <h5 className="mt-32 mb-12">5. Prescription Lenses</h5>
                  <p className="text-gray-700 mb-8">
                    When ordering powered lenses, you agree that:
                  </p>
                  <ul className="text-gray-700 mb-12">
                    <li>• You have a valid and updated prescription.</li>
                    <li>• The prescription is issued by a certified eye specialist.</li>
                    <li>• Specskraft is not responsible for issues caused by incorrect prescriptions.</li>
                  </ul>

                  {/* Section 6 */}
                  <h5 className="mt-32 mb-12">6. Shipping & Delivery</h5>
                  <p className="text-gray-700 mb-8">
                    We aim to deliver your eyewear safely and on time. Delivery
                    timelines depend on location, customization, and courier
                    availability. You will receive tracking details after
                    dispatch.
                  </p>
                  <ul className="text-gray-700 mb-12">
                    <li>• Standard delivery: 5–10 business days.</li>
                    <li>• Powered lenses: extra 3–5 days for processing.</li>
                    <li>• We are not liable for courier delays or unforeseen logistics issues.</li>
                  </ul>

                  {/* Section 7 */}
                  <h5 className="mt-32 mb-12">7. Returns, Exchanges & Refunds</h5>
                  <p className="text-gray-700 mb-8">
                    We want you to be happy with your Specskraft purchase.
                    Please review our return guidelines:
                  </p>
                  <ul className="text-gray-700 mb-12">
                    <li>• Non-powered frames: returnable within 7 days in unused condition.</li>
                    <li>• Powered lenses: non-returnable due to customization.</li>
                    <li>• Refunds are issued within 7–10 working days after inspection.</li>
                  </ul>

                  {/* Section 8 */}
                  <h5 className="mt-32 mb-12">8. Intellectual Property</h5>
                  <p className="text-gray-700 mb-12">
                    All images, designs, logos, and text on Specskraft are our
                    intellectual property. Reproduction or redistribution
                    without permission is prohibited and may result in legal
                    action.
                  </p>

                  {/* Section 9 */}
                  <h5 className="mt-32 mb-12">9. User Responsibilities</h5>
                  <p className="text-gray-700 mb-8">
                    You agree not to use this website for:
                  </p>
                  <ul className="text-gray-700 mb-12">
                    <li>• Illegal, fraudulent, or unauthorized purposes.</li>
                    <li>• Uploading harmful code, viruses, or misleading data.</li>
                    <li>• Infringing on others’ intellectual property rights.</li>
                  </ul>

                  {/* Section 10 */}
                  <h5 className="mt-32 mb-12">10. Limitation of Liability</h5>
                  <p className="text-gray-700 mb-12">
                    Specskraft shall not be liable for direct, indirect, or
                    consequential damages arising from your use of our website
                    or products. Our total liability shall not exceed the price
                    paid for the product in question.
                  </p>

                  {/* Section 11 */}
                  <h5 className="mt-32 mb-12">11. Privacy & Data Protection</h5>
                  <p className="text-gray-700 mb-12">
                    Your personal data is handled securely and in compliance
                    with our{" "}
                    <Link to="/privacy-policy" className="text-main-600 fw-medium">
                      Privacy Policy
                    </Link>
                    . We collect only essential data for order processing and do
                    not sell or misuse customer information.
                  </p>

                  {/* Section 12 */}
                  <h5 className="mt-32 mb-12">12. Termination</h5>
                  <p className="text-gray-700 mb-12">
                    We may suspend or terminate your access to our services if
                    you violate these Terms. On termination, your rights to use
                    Specskraft immediately cease.
                  </p>

                  {/* Section 13 */}
                  <h5 className="mt-32 mb-12">13. Governing Law & Jurisdiction</h5>
                  <p className="text-gray-700 mb-12">
                    These Terms are governed by Indian law. Any disputes shall
                    fall under the jurisdiction of the courts in Bengaluru,
                    Karnataka.
                  </p>

                  {/* Section 14 */}
                  <h5 className="mt-32 mb-12">14. Updates to Terms</h5>
                  <p className="text-gray-700 mb-12">
                    Specskraft reserves the right to update or modify these
                    Terms at any time. Continued use of our site after changes
                    implies acceptance of the new Terms.
                  </p>

                  <p className="text-gray-700 mt-32">
                    For support or inquiries, contact us at{" "}
                    <a
                      href="mailto:specskraft.info@gmail.com"
                      className="text-main-600 fw-medium"
                    >
                      specskraft.info@gmail.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
