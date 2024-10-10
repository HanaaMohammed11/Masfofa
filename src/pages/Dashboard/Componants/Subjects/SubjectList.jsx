import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import SubjectForm from "./subjectForm";
import { SubjctCard } from "./SubjectCard";
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
    <div>
  
    <div className="p-9 flex">
      
       <div>
 
       </div>

       <div>
      <div className="flex flex-col w-full  xs:items-center">
     
        <div
          className="add-btn add-g add-c add-uppercase add-text mb-7"
          onClick={handleClick}
        >
          {t("subjectEditForm.addSubject")}
        </div>
        <div className="search flex justify-center">
          <input
            type="text"
            placeholder={t("subjectEditForm.search")}
            className="xs:w-72 sm:w-96 rounded-full text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
<div className="w-full flex justify-center" >
{showMatrixForm ? (
        <SubjectForm />
      ) : (
        <SubjctCard searchTerm={searchTerm} />
      )}</div>
</div>
</div>

    </div>
  );
}
