import React from "react";
import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import HeaderOne from "../components/HeaderOne";
import FooterOne from "../components/FooterOne";
import ShippingOne from "../components/ShippingOne";
import TermsConditions from "../components/TermsConditions";
const TermsAndConditions = () => {
  return (
    <>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <HeaderOne />

      {/* TermsConditions */}
      <TermsConditions />

      {/* ShippingOne */}
      <ShippingOne />

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default TermsAndConditions;
