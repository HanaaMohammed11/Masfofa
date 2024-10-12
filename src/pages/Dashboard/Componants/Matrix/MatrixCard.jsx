import React, { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import Loader from "../../../Login/loader";
import { AiFillEye, AiFillEdit, AiFillDelete } from "react-icons/ai";

export default function MatrixCard({ searchQuery, handleShowInfo }) {
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const id = useId();
  const navigate = useNavigate();

  const deleteMatrix = async (matrixId) => {
    const matrixRef = doc(db, "matrix", matrixId);
    try {
      await deleteDoc(matrixRef);
      console.log("تم حذف المستند بنجاح!");
    } catch (error) {
      console.error("خطأ في حذف المستند: ", error);
    }
  };

  const show = (matrixItem) => {
    handleShowInfo(matrixItem);
  };

  const edit = (matrixItem) => {
    navigate("/MatrixEditForm", { state: { matrix: matrixItem } });
  };

  useEffect(() => {
    const q = query(
      collection(db, "matrix"),
      where("ownerAdmin", "==", localStorage.getItem("id"))
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matrixData = [];
      snapshot.forEach((doc) => {
        matrixData.push({ id: doc.id, ...doc.data() });
      });
      setMatrix(matrixData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredMatrix = matrix.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`mx-4 md:mx-3 mt-6 mb-9 ${direction}`}>
      {loading ? (
        <div className="flex justify-center items-center ">
          <Loader />
        </div>
      ) : filteredMatrix.length > 0 ? (
        <div className="overflow-y-auto h-96"> {/* تحديد ارتفاع الجدول */}
          <table
            className="min-w-full text-center text-gray-500 dark:text-gray-400 shadow-lg"
            dir={direction}
          >
            <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-2 md:px-6 md:py-3">
                  {t("matrixinfo.name")}
                </th>
                <th scope="col" className="px-4 py-2 md:px-6 md:py-3">
                  {t("matrixinfo.publisher")}
                </th>
                <th scope="col" className="px-4 py-2 md:px-6 md:py-3">
                  {t("subjectInfo.action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMatrix.map((card, index) => (
                <tr
                  key={card.id}
                  className={`${
                    index % 2 === 0 ? "bg-[#DEBA9A]" : "bg-white"
                  } border-b dark:bg-gray-800 dark:border-gray-700 transition-all`}
                >
                  {/* العنوان */}
                  <td className="px-4 py-2 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap text-sm md:text-base">
                    {card.title}
                  </td>
  
                  <td className="px-4 py-2 md:px-6 md:py-4 text-sm md:text-base">{card.companyName}</td>
  
                  <td className="py-2 px-4 text-center">
                    <div className="flex justify-center space-x-2 md:space-x-4">
                      {/* أيقونة العرض */}
                      <button onClick={() => show(card)} className="text-blue-500 ml-4">
                        <AiFillEye size={20} />
                      </button>
  
                      {/* أيقونة التعديل */}
                      <button onClick={() => edit(card)} className="text-yellow-500 ">
                        <AiFillEdit size={20} />
                      </button>
  
                      {/* أيقونة الحذف */}
                      <button onClick={() => deleteMatrix(card.id)} className="text-red-500">
                        <AiFillDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center">{t("matrixCardDashboard.noMatrix")}</div>
      )}
    </div>
  );
  
  
}
