/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../../config/firebase";
import { useTranslation } from "react-i18next";
import Loader from "../../Login/loder";

export default function MatrixInfo() {
  const { t, i18n } = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const location = useLocation();
  const navigate = useNavigate();
  const [relatedsubjects, setRelatedsubjectss] = useState([]);
  const matrix = location.state.item;

  useEffect(() => {
    const usersCollectionRef = collection(db, "subjects");

    if (matrix.subjects) {
      const q = query(
        usersCollectionRef,
        where("subjectTitle", "in", matrix.subjects)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const subjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (subjects.length > 0) {
          setLoading(false);
        }
      });
  
      return () => unsubscribe();
    } else {
      setLoading(false); 
    }
  }, [matrix]);

  return (
    <div >
      <Topbanner />
      <div className="min-h-screen bg-gray-100 justify-center flex items-center" dir={direction}>
         {loading ? ( 
          <Loader />
        ) : ( 

        <Card className="w-[900px] h-auto my-9">
          <div className="flex justify-end px-4 pt-4 "></div>
          <div className="flex flex-col items-center pb-10 ">
            {/* الجدول */}
            <div className="mt-4 w-full ">
              <table className="min-w-full  border-collapse">
                <tbody className="text-gray-700">
                  <tr>
                   
                    <td className="px-4 py-2 font-bold">{t("matrixinfo.name")}</td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                      {matrix.title}
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                 
                    <td className="px-4 py-2 font-bold">{t("matrixinfo.releaseDate")}</td>
                    <td className="px-4 py-2 break-words w-1/2 overflmatrixow-hidden">
                      {matrix.releaseDate}
                    </td>
                  </tr>
                  <tr>
                 
                  <td className="px-4 py-2 font-bold">{t("matrixinfo.updateDate")}</td>

                  <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                      {matrix.updateDate}
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                  
                    <td className="px-4 py-2 font-bold">{t("matrixinfo.publisher")}</td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                      {matrix.companyName}
                    </td>
                  </tr>
                  <tr>
                  
                    <td className="px-4 py-2 font-bold"> {t("matrixinfo.introduction")}</td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                      {matrix.intro}
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-bold"> {t("matrixinfo.definitions")}</td>

                  <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                      {/* {t("matrixinfo.definitionsHeader")} */}
                    </td>

                  
                  </tr>
                  {matrix.definitions.map((elem, index) => (
                    <tr key={index}>
                     
                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {elem.term}
                      </td>
                      
                    </tr>
                  ))}
                  <tr>
                  <td className="px-4 py-2 font-bold">{t("matrixinfo.permissions")}</td>

                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden"></td>
                  </tr>
                  {relatedsubjects.length > 0 ? (
                    relatedsubjects.map((subject) => (
                      <tr
                        className="border cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          navigate("/subjectInfo", { state: { subject } });
                        }}
                        key={subject.id}
                      >
                         <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                          {t("matrixinfo.subjectTitle")}
                        </td>
                        <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                          {subject.subjectTitle}
                        </td>
                       
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-center">
                        {t("matrixinfo.noRelatedSubjects")}
                      </td>
                    </tr>
                  )}

                  <tr className="bg-gray-100">
                    
                    <td className="px-4 py-2 font-bold">{t("matrixinfo.notes")}</td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                      {matrix.notes}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        )}
      </div>
      <Bottombanner />
    </div>
  );
}
