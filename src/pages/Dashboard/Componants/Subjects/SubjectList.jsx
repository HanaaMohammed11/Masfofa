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

export default function SubjectList({handleClickShow}) {
  const [showMatrixForm, setShowMatrixForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const handleClick = () => {
    setShowMatrixForm(!showMatrixForm);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-lg px-4">
        {/* Header Section */}
        <div className="flex justify-between flex-col md:flex-row mb-6">
          <div
            className="add-btn add-g add-c add-uppercase add-text mb-4 md:mb-0 flex items-center text-center"
            onClick={handleClick}
          >
            {t("subjectEditForm.addSubject")}
          </div>
  
          {/* Search Input */}
          <div className="search flex justify-center w-full md:w-auto">
            <input
              type="text"
              placeholder={t("subjectEditForm.search")}
              className="h-12 w-full md:w-80 rounded-full text-right"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
  
        {/* Content Section */}
        <div className="flex flex-wrap justify-center pb-20">
          {showMatrixForm ? (
            <SubjectForm />
          ) : (
            <SubjctCard searchTerm={searchTerm} handleShowInfo={handleClickShow} />
          )}
        </div>
      </div>
    </div>
  );
  
}
