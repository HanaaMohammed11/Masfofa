import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {  MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

export default function MatrixTable(props) {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar'; 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 
  const totalPages = Math.ceil(props.matrices.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMatrices = props.matrices.slice(startIndex, startIndex + itemsPerPage);

  if (props.matrices.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-44">
        {t("matrixCardDashboard.noMatrix")}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto mx-14  mb-44 mt-9 ${direction}`}>
      <table className="w-full text-center shadow-lg" dir={direction}>
        <thead className="text-xl font-semibold uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              {t("matrixinfo.name")}
            </th>
            <th scope="col" className="px-6 py-3">
              {t("matrixinfo.publisher")}
            </th>
            <th scope="col" className="px-6 py-3">
              {t("subjectInfo.action")}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentMatrices.map((item, index) => (
            <tr
              key={item.id}
              className={`${
                index % 2 === 0 ? "bg-[#DEBA9A]" : "bg-white"
              } border-b text-xl transition-all`}
            >
              {/* Role */}
              <td className="px-6 py-4 text-xl dark:text-white whitespace-nowrap">
                {item.title}
              </td>

              <td className="px-6 py-4 text-xl ">{item.companyName}</td>

              {/* Actions */}
              <td className="px-6 py-4 ">
                <button
                  className={`hover:underline`}
                  onClick={() => {
                    navigate("/MatrixInfo", { state: { item } });
                  }}
                >
                  {t("matrix.details")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
      <div
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center"
      >
        {isArabic ? (
          <MdKeyboardDoubleArrowRight className="ml-2" color="black" size={25} /> 
        ) : (
          <MdKeyboardDoubleArrowLeft className="mr-2" color="black" size={25} /> 
        )}
      </div>

      <span className="mx-2">
        {t("pagination.page")} {currentPage} {t("pagination.of")} {totalPages}
      </span>

      <div
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center"
      >
        {isArabic ? (
          <MdKeyboardDoubleArrowLeft className="ml-2" color="black" size={25} /> 
        ) : (
          <MdKeyboardDoubleArrowRight className="mr-2" color="black" size={25} /> 
        )}
      </div>
    </div>

    </div>
  );
}
