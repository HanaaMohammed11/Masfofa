/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import SubTable from "./SubCard";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import SubjectInfo from "./SubjectInfo";
import MatrixInfo from "../Matrixs/MatrixInfo";
import UserInfo from "../Employee/UserInfo";
export default function SubjectsLists() {
  const { t, i18n } = useTranslation("global");
  const location = useLocation();
  const { filteredMatrices } = location.state || [];
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMatrix, setSelectedMatrix] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const handleClearFilters = () => {
    setSearchTerm("");
    setSearchType("");
    setTempSearchQuery("");
    setTempSearchQuery("");
  };
  const handleSearch = () => {
    if (tempSearchQuery === "") {
      setSearchTerm("");
    } else {
      setSearchTerm(tempSearchQuery);
    }
  };
  const handleSubjectClick = (subject) => {
    setSelectedMatrix(null);
    setSelectedEmp(null);
    setSelectedSubject(subject);
  };
  const handleMatrixClick = (matrix) => {
    setSelectedEmp(null);
    setSelectedSubject(null);
    setSelectedMatrix(matrix);
  };
  const handleEmpClick = (emp) => {
    setSelectedSubject(null);
    setSelectedMatrix(null);
    setSelectedEmp(emp);
  };
  return (
    <div
      className="flex flex-col"
      style={{ paddingTop: "120px", paddingBottom: "44px" }}
    >
      <div className="search flex-col flex xs:flex-col md:flex-row xs:items-center xs:gap-y-4 md:gap-y-0 justify-center mt-9">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="w-32 rounded-md  ml-2 mr-2  p-2"
        >
          <option value="" disabled>
            {t("subjectEditForm.search")}
          </option>
          <option value="subjectTitle">{t("search.subjectTitle")}</option>
          <option value="subjectNum">{t("search.subjectNum")}</option>
          <option value="subjectContent">{t("search.subjectContent")}</option>
        </select>

        {/* حقل الإدخال للبحث */}
        <input
          type="text"
          placeholder={t("articels.searchPlaceholder")}
          className="xs:w-72 sm:w-96 rounded-full"
          dir={direction}
          value={tempSearchQuery}
          onChange={(e) => setTempSearchQuery(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="  ml-2 mr-2  px-4 py-2 rounded-full bg-[#CDA03D] text-white"
        >
          {t("matrix.searchButton")}
        </button>
        <button
          onClick={handleClearFilters}
          className="ml-2 px-4 py-2 rounded-full bg-[#CDA03D] text-white"
        >
          {t("matrix.clearFilters")}
        </button>
      </div>

      <div className="flex-grow">
        {!selectedSubject && !selectedMatrix && !selectedEmp ? (
          <SubTable
            searchTerm={searchTerm}
            searchType={searchType}
            onSubjectClick={handleSubjectClick}
            onEmpClick={handleEmpClick}
          />
        ) : !selectedSubject && !selectedEmp && selectedMatrix ? (
          <MatrixInfo
            matrix={selectedMatrix}
            onEmpClick={handleEmpClick}
            onSubjectClick={handleSubjectClick}
            onBack={() => setSelectedMatrix(null)}
          />
        ) : !selectedSubject && selectedEmp && !selectedMatrix ? (
          <UserInfo
            user={selectedEmp}
            onBack={() => setSelectedEmp(null)}
            onSubjectClick={handleSubjectClick}
            onEmpClick={handleEmpClick}
          />
        ) : (
          <SubjectInfo
            subject={selectedSubject}
            onEmpClick={handleEmpClick}
            onMatrixClick={handleMatrixClick}
            onBack={() => setSelectedSubject(null)}
          />
        )}
      </div>
    </div>
  );
}
