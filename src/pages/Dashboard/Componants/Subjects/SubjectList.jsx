/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import SubjectForm from "./subjectForm";
import { SubjctCard } from "./SubjectCard";
import { useTranslation } from "react-i18next";
import btn from "../../../../assets/btn.png"

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
          className="text-lg font-bold mx-5 text-white "
          style={{
            backgroundImage:               `url(${btn})`,
            
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "79px",
            width: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={handleClick}
        >
          {t("subjectEditForm.addSubject")}
        </div>
        <div className="search flex justify-center mt-9">
          <input
            type="text"
            placeholder={t("subjectEditForm.search")}
            className="xs:w-72 sm:w-96 rounded-full text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term state on change
          />
        </div>
      </div>

      {showMatrixForm ? <SubjectForm /> : <SubjctCard />}
    </div>
  );
}
