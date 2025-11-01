import React from "react";
import Preloader from "../helper/Preloader";

import HeaderOne from "../components/HeaderOne";
import FooterOne from "../components/FooterOne";
import ShippingOne from "../components/ShippingOne";
import Account from "../components/Account";
import ColorInit from "../helper/ColorInit";


const AccountPage = () => {



  return (
    <>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* Preloader */}
      <Preloader />

       {/* HeaderOne */}
      <HeaderOne />

      {/* Account */}
      <Account />

      {/* ShippingOne */}
      <ShippingOne />

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default AccountPage;
