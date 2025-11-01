import React from "react";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import BannerOne from "../components/BannerOne";
import PromotionalOne from "../components/PromotionalOne";
import OfferOne from "../components/OfferOne";
import RecommendedOne from "../components/RecommendedOne";
import HotDealsOne from "../components/HotDealsOne";
import ShippingOne from "../components/ShippingOne";
import NewsletterOne from "../components/NewsletterOne";
import FooterOne from "../components/FooterOne";
import ColorInit from "../helper/ColorInit";
const HomePageOne = () => {

  return (

    <>

      {/* Preloader */}
      <Preloader />

      {/* ColorInit */}
      <ColorInit color={false} />

      {/* HeaderOne */}
      <HeaderOne />

      {/* BannerOne */}
      <BannerOne />

      {/* PromotionalOne */}
      <PromotionalOne />

      {/* OfferOne */}
      <OfferOne /> 

      {/* RecommendedOne */}
      <RecommendedOne />

      {/* HotDealsOne */}
      <HotDealsOne />

      {/* ShippingOne */}
      <ShippingOne />

      {/* NewsletterOne */}
      <NewsletterOne />

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default HomePageOne;
