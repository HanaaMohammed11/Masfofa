/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Button, Card } from "flowbite-react";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import { useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import db from "../../../config/firebase";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { IoArrowBack } from "react-icons/io5";
import { nav } from "framer-motion/client";
export default function SubjectInfo({
  subject,
  onBack,
  onMatrixClick,
  onEmpClick,
}) {
  const { t, i18n } = useTranslation("global");
  const pdfRef = useRef();
  const isRtl = i18n.language === "ar";

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdfWidth = imgWidth / 1;
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      const doc = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "px",
        format: [imgWidth, imgHeight],
      });

      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      doc.save("table.pdf");
    });
  };
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const location = useLocation();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [matrices, setMatrices] = useState([]);
  console.log(subject.relatedMatrix);
  useEffect(() => {
    const qUser = query(collection(db, "matrix"), where("title", "!=", 0));
    const unsubscribe = onSnapshot(qUser, (snapshot) => {
      const matrix = [];
      snapshot.forEach((doc) => {
        matrix.push({ docId: doc.id, ...doc.data() });
      });
      setMatrices(matrix);
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!subject) {
          console.error("No subject data found in location state");
          return;
        }

        const employeesSnapshot = await getDocs(collection(db, "employees"));
        const employeesList = employeesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEmployees(employeesList);

        setSubject(subject);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [subject]);

  const emp1 = employees.find((emp) => emp.employeeId === subject.emp1Id);
  const emp2 = employees.find((emp) => emp.employeeId === subject.emp2Id);

  return (
    <div>
      <div className={`flex ${isRtl ? "items-left" : "items-right"}`}>
        <button
          className={`text-center fixed bg-[#CDA03D] py-2 px-3 shadow-xl rounded-full text-white flex text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 
    ${isRtl ? "mr-14" : "ml-14"}`}
          onClick={onBack}
        >
          <IoArrowBack className="" />
        </button>
      </div>

      <div
        className=" mt-[40px] justify-center flex items-center mb-44"
        style={{}}
      >
        <Card className="lg:w-[1200px] ">
          <div className=" w-full" dir={direction}>
            <Button onClick={downloadPDF} className="bg-[#d4af37] rounded-full">
              {t("text.download")}
            </Button>
          </div>
          <div className="flex justify-end px-4 pt-4"></div>
          <div className="flex flex-col items-center pb-10">
            {/* الجدول */}
            <div className=" w-full" ref={pdfRef}>
              <table
                className="min-w-full  border-collapse table-fixed"
                dir={direction}
              >
                <tbody className="text-gray-700">
                  <tr>
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.subjectNum")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {subject.subjectNum}
                    </td>
                  </tr>
                  <tr className="bg-[#fce8ca]">
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.subjectTitle")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {subject.subjectTitle}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.subjectContent")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                      {subject.subjectContent}
                    </td>
                  </tr>
                  <tr
                    className="cursor-pointer hover:bg-[#fce8ca]"
                    onClick={() => {
                      const matrix = matrices.find(
                        (item) => item.title === subject.relatedMatrix.title
                      );
                      onMatrixClick(matrix);
                      // navigate("/MatrixInfo", {
                      //   state: { matrix },
                      // });
                    }}
                  >
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.relatedMatrix")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden ">
                      {subject.relatedMatrix.title}
                    </td>
                  </tr>
                  <tr className="bg-[#fce8ca]">
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectInfo.authorizedEmployee")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {subject.emp1.employeeName} - {subject.emp1.jobTitle}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectInfo.sharedEmployees")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {emp2?.employeeName} - {emp2?.role}
                    </td>
                  </tr>
                  {subject.sharedEmployees.length > 0 ? (
                    subject.sharedEmployees.map((emp) => {
                      const user = employees.find(
                        (empl) => empl.employeeId === emp.empId
                      );
                      console.log("Found user:", user);
                      return (
                        <tr
                          className="cursor-pointer hover:bg-[#fce8ca]"
                          onClick={() => {
                            if (user) {
                              onEmpClick(user);
                              // navigate("/userinfo", { state: { user } });
                            } else {
                              console.log(
                                "No user found for empId:",
                                emp.empId
                              );
                            }
                          }}
                          key={emp.empId}
                        >
                          {user && (
                            <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                              {emp.role}
                            </td>
                          )}
                          {user && (
                            <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                              {user.employeeName}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-center">
                        {t("subjectInfo.noRelatedSubjects")}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-[#fce8ca]">
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.negotiationLimit")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {subject.negotiationLimit}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectInfo.notes")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                      {subject.notes}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
