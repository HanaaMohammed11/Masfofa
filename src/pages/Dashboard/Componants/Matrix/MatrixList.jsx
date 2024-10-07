/* eslint-disable no-unused-vars */
import { IoMdAdd } from "react-icons/io";
import MatrixForm from "./MatrixForm";
import MatrixCard from "./MatrixCard";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import btn from "../../../../assets/btn.png"
import "../../../Dashboard/btns.css"

export default function MatrixList() {
  const [showMatrixForm, setShowMatrixForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const handleClick = () => {
    setShowMatrixForm(!showMatrixForm);
  };

  return (
    <>
      <div className="flex justify-between p-9">
        <div className="flex justify-between w-full xs:flex-col md:flex-row xs:items-center">
        <div
  className="add-btn add-g add-c add-uppercase add-text"
  onClick={handleClick}
>
            {t("matrixForm.addNewMatrix")}{" "}
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

      {showMatrixForm ? (
        <MatrixForm />
      ) : (
        <MatrixCard searchQuery={searchQuery} />
      )}
    </>
  );
}
