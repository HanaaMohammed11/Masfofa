/* eslint-disable no-unused-vars */
import { IoMdAdd } from "react-icons/io";
import MatrixForm from "./MatrixForm";
import MatrixCard from "./MatrixCard";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import btn from "../../../../assets/btn.png"
import "../../../Dashboard/btns.css"
import SideBar from "../../SideBar";
import Topbanner from "../../../Home/componants/banner/Topbanner";

export default function MatrixList({handleClickShow}) {
  const [showMatrixForm, setShowMatrixForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const handleClick = () => {
    setShowMatrixForm(!showMatrixForm);
  };

  return (
    <>


      <div className="flex flex-col p-9  ">
        

        <div className="flex  flex-col w-full   xs:items-center">
        <div
  className="add-btn add-g add-c add-uppercase add-text mb-6"
  onClick={handleClick}
>
  {t("matrixForm.addNewMatrix")}
</div>


          {/* Search Input */}
          <div className="search flex justify-center ">
            <input
              type="text"
              className="xs:w-72 sm:w-96 rounded-full text-right"
              placeholder={t("matrixForm.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>
      </div>

<div className="flex flex-wrap justify-center pb-20 ">
      {showMatrixForm ? (
        <MatrixForm />
      ) : (
        <MatrixCard searchQuery={searchQuery} handleShowInfo={handleClickShow}/>
      )}
  </div>
    </>

  );
}
