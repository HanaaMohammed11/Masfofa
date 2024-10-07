/* eslint-disable no-unused-vars */
import React from "react";
import Topbanner from "./componants/banner/Topbanner";
import Bottombanner from "./componants/banner/Bottombanner";
import Cards from "./Card";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation("global");
  return (
    <div
      className="relative flex flex-col min-h-screen bg-gray-300"
      style={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-center items-center text-center  inset-0 bg-black  ">
        <Topbanner />
       
      </div>
<div className="mt-auto">
<Cards />
</div>
     

      <div className='mt-auto'>
        <Bottombanner />
      </div>
    </div>
  );
}
