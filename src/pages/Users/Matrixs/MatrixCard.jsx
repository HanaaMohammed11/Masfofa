import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MatrixTable(props) {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();

  if (props.matrices.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-44">
        {t("matrixCardDashboard.noMatrix")}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto mx-14  mb-9 mt-9 ${direction}`}>
      <table className="w-full text-center text-gray-500 dark:text-gray-400 shadow-lg" dir={direction} >
        <thead className="text-مل text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
          {props.matrices.map((item, index) => (
            <tr
            key={item.id}
            className={`${
              index % 2 === 0 ? "bg-[#DEBA9A]"  : "bg-white"
            } border-b dark:bg-gray-800 dark:border-gray-700  transition-all`}
            >
              {/* Role */}
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {item.title}
              </td>

              <td className="px-6 py-4">
             
              
              {item.companyName}
       
             
              </td>

              {/* Actions */}
              <td className="px-6 py-4 ">
              <button className={`font-semibold hover:underline  text-gray-600`} 
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
    </div>
  );
}
