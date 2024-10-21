import React, { useState } from "react";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import SubTable from "./SubCard";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function SubjectsLists() {
  const { t, i18n } = useTranslation("global");
  const location = useLocation();
  const { filteredMatrices } = location.state || [];
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState(""); 
  
  const handleSearch = () => {
    if (tempSearchQuery === "") {
      setSearchTerm("");
    } else {
      setSearchTerm(tempSearchQuery);
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{ paddingTop: "120px", paddingBottom: "44px" }}
    >


      <div className="search flex justify-center mt-9">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className=" rounded-md  ml-2 mr-2  p-2"
        >
          <option value="" disabled>{t("subjectEditForm.search")}</option>
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
      </div>

      <div className="flex-grow ">
        <SubTable searchTerm={searchTerm} searchType={searchType} />
      </div>

    
    </div>
  );
}
