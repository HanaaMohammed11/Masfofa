import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import SubjectForm from "./subjectForm";
import  SubjctCard  from "./SubjectCard";
import { useTranslation } from "react-i18next";
import btn from "../../../../assets/btn.png";
import "../../../Dashboard/btns.css";
import SideBar from "../../SideBar";
import Topbanner from "../../../Home/componants/banner/Topbanner";
import Bottombanner from "../../../Home/componants/banner/Bottombanner";

export default function SubjectList() {
  const [showMatrixForm, setShowMatrixForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const handleClick = () => {
    setShowMatrixForm(!showMatrixForm);
  };

  return (
    <div className="">
      <div className="">
        {/* Header Section */}
 

        <div className={`flex flex-col md:flex-row w-full justify-end items-center gap-4 md:gap-9  fixed `}>
  
  <div
    className="btn-button text-center btn-curve btn-gold flex items-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300"
    onClick={handleClick}
  >
    <span className="whitespace-nowrap flex items-center space-x-2 btn-text">
    <span className="whitespace-nowrap flex items-center space-x-2 btn-text">{t("subjectEditForm.addSubject")}</span>    
    </span>
  </div>
  
  {/* Search Input */}
  <div className="search flex justify-center items-center">
    <input
      type="text"
      className="rounded-full text-right h-9 px-4"  // أضفنا padding للمدخل
      placeholder={t("matrixForm.search")}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
  
</div>
  
        {/* Content Section */}
        <div className="flex flex-wrap justify-center mb-96">
          {showMatrixForm ? (
            <SubjectForm />
          ) : (
            <SubjctCard searchTerm={searchTerm}  />
          )}
        </div>
      </div>
    </div>
  );
  
}
