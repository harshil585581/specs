import React from "react";
import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import HeaderOne from "../components/HeaderOne";
import FooterOne from "../components/FooterOne";
import ShippingOne from "../components/ShippingOne";
import BlogDetails from "../components/BlogDetails";
const BlogDetailsPage = () => {
  return (
    <>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <HeaderOne />

      {/* BlogDetails */}
      <BlogDetails />

      {/* ShippingOne */}
      <ShippingOne />

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default BlogDetailsPage;
