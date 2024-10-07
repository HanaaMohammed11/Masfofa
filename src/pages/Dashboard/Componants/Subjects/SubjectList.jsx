/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import SubjectForm from "./subjectForm";
import { SubjctCard } from "./SubjectCard";
import { useTranslation } from "react-i18next";
import btn from "../../../../assets/btn.png"
import "../../../Dashboard/btns.css"
export default function SubjectList() {
  const [showMatrixForm, setShowMatrixForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const handleClick = () => {
    setShowMatrixForm(!showMatrixForm);
  };
  return (
    <div className=" p-9">
      <div className="flex justify-between w-full xs:flex-col md:flex-row xs:items-center">
      <div
  className="add-btn add-g add-c add-uppercase add-text"
  onClick={handleClick}
>
          {t("subjectEditForm.addSubject")}
        </div>
        <div className="search flex justify-center ">
          <input
            type="text"
            placeholder={t("subjectEditForm.search")}
            className="xs:w-72 sm:w-96 rounded-full text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {showMatrixForm ? <SubjectForm /> : <SubjctCard />}
    </div>
  );
}
