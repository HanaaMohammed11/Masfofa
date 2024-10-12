/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Card } from "flowbite-react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import db from "../../../../config/firebase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../../../Login/loader";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineInfoCircle, AiFillEye } from 'react-icons/ai'; 

export default function SubjctCard({ searchTerm , handleShowInfo }) {
  const navigation = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const deleteSubject = async (subjectId, subjectTitle) => {
    const subjectRef = doc(db, "subjects", subjectId);
    try {
      await deleteDoc(subjectRef);
    } catch (error) {
      console.error("Error deleting subject: ", error);
    }
  };

  const handleButtonClick = (subjectItem) => {
    handleShowInfo(subjectItem);
  };
  const Edit = (subjectItem) => {
    navigation("/editsubject", { state: { subject: subjectItem } });
  };

  useEffect(() => {
    // const usersCollectionRef = collection(db, "subjects");
    const q = query(
      collection(db, "subjects"),
      where("ownerAdmin", "==", localStorage.getItem("id"))
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subjects = [];
      snapshot.forEach((doc) => {
        subjects.push({ id: doc.id, ...doc.data() });
      });
      setSubjects(subjects);
      setLoading(false); // Set loading to false once subjects are fetched
    });

    return () => unsubscribe();
  }, []);

  // Filter subjects based on the search term
  const filteredSubjects = subjects.filter((subject) =>
    subject.subjectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`overflow-x-auto mx-4 md:mx-3  mt-6 mb-9  ${direction}`}>
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader /> {/* Show loader while fetching data */}
        </div>
      ) : filteredSubjects.length > 0 ? (
        <div className="overflow-x-auto flex justify-center items-center ">
          <table className="table-auto w-full border-collapse  overflow-x-auto">
            <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr >
                <th className="px-4 py-2  text-center">{t("subjectInfo.subjectTitle")}</th>
          
                <th className="px-4 py-2  text-center">          {t("subjectCardDashboard.subjectNum")} </th>
                <th className="px-4 py-2  text-center">{t("subjectInfo.action")}</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
  {filteredSubjects.map((subject, index) => (
    <tr 
      key={index} 
      className={`border-b  ${index % 2 === 1 ? "bg-white" : "bg-[#D3A17A]"}`}
    >
      <td className="px-4 py-2 text-center">{subject.subjectTitle}</td>
      <td className="px-4 py-2 text-center">
        {t("subjectCardDashboard.subjectNum")}: {subject.subjectNum}
      </td>
      <td className="px-4 py-2 text-center flex justify-center space-x-3">
        <button onClick={() => Edit(subject)} className="bg-transparent border-0">
          <AiOutlineEdit size={20} className="text-yellow-500 hover:text-blue-700" title="Edit" />
        </button>
        <button
          onClick={() => deleteSubject(subject.id, subject.subjectTitle)}
          className="bg-transparent border-0"
        >
          <AiOutlineDelete size={20} className="text-red-700 hover:text-red-900 mr-4" title="Delete" />
        </button>
            {/* أيقونة العرض */}
            <button  onClick={() => handleButtonClick(handleButtonClick)}className="text-blue-500 ml-4">
                      <AiFillEye size={20} />
                    </button>
        
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      ) : (
        <div className="p-4 text-center text-neutral-600 dark:text-neutral-400">
          {t("subjectCardDashboard.nosubjects")}
        </div>
      )}
    </div>
  );
}
