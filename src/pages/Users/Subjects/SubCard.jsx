import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import db from "../../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../../Login/loader";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

export default function SubTable({ searchTerm, searchType }) {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [matrixItems, setMatrixItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Filtered subjects
  const filteredSubjects = matrixItems.filter((subject) => {
    if (!searchType) return true;
    const searchText = searchTerm.toLowerCase().trim();
    return subject[searchType]?.toLowerCase().trim().includes(searchText);
  });

  // Total pages based on filtered subjects
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMatrices = filteredSubjects.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const qUser = query(
      collection(db, "users"),
      where("ID", "==", localStorage.getItem("id"))
    );

    const unsubscribe = onSnapshot(qUser, (snapshot) => {
      const userData = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setUser(userData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getSubjects = async () => {
      if (user.length > 0) {
        try {
          const q = query(
            collection(db, "subjects"),
            where("ownerAdmin", "==", user[0].ownerAdmin || user[0].ID)
          );
          const querySnapshot = await getDocs(q);
          const subjectsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMatrixItems(subjectsList);
        } catch (error) {
          console.error("Error fetching subjects: ", error);
        } finally {
          setLoading(false);
        }
      }
    };
    getSubjects();
  }, [user]);

  const handleButtonClick = (subject) => {
    navigate("/subjectInfo", { state: { subject } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center m-44">
        <Loader />
      </div>
    );
  }

  if (filteredSubjects.length === 0) {
    return (
      <div className={`flex justify-center mt-44 items-center h-full ${direction}`}>
        <p className="text-gray-600">{t("articels.noResults")}</p>
      </div>
    );
  }

  return (
    <div className={`p-4 overflow-x-auto mx-14 mt-9 mb-44 ${direction}`}>
      <table className="table-auto w-full text-sm text-center dark:text-gray-400 shadow-lg rounded-xl mb-9" dir={direction}>
        <thead className="text-center text-xl font-semibold uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-2">{t("subjectCardDashboard.subjectNum")}</th>
            <th className="px-4 py-2 text-lg">{t("subjectInfo.subjectTitle")}</th>
            <th className="px-4 py-2 text-lg">{t("subjectInfo.action")}</th>
          </tr>
        </thead>
        <tbody>
          {currentMatrices.map((item, index) => (
            <tr key={item.id} className={`${index % 2 === 0 ? "bg-[#DEBA9A]" : "bg-white"} border-b text-xl font-semibold`}>
              <td className="px-4 py-2 font-semibold"> {item.subjectNum}</td>
              <td className="px-4 py-3 font-semibold dark:text-white whitespace-nowrap">{item.subjectTitle}</td>
              <td className="px-4 py-3">
                <button className="hover:underline font-semibold" onClick={() => handleButtonClick(item)}>
                  {t("articels.details")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`flex items-center `}
        >
          {i18n.language === 'ar' ? (
            <MdKeyboardDoubleArrowRight className="ml-2" color="black" size={25} />
          ) : (
            <MdKeyboardDoubleArrowLeft className="mr-2" color="black" size={25} />
          )}
        </button>

        <span className="mx-2">
          {t("pagination.page")} {currentPage} {t("pagination.of")} {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`flex items-center }`}
        >
          {i18n.language === 'ar' ? (
            <MdKeyboardDoubleArrowLeft className="ml-2" color="black" size={25} />
          ) : (
            <MdKeyboardDoubleArrowRight className="mr-2" color="black" size={25} />
          )}
        </button>
      </div>
    </div>
  );
}
