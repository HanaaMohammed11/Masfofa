/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Button, Card } from "flowbite-react";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../../config/firebase";
import { useTranslation } from "react-i18next";
import Loader from "../../Login/loader";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { IoArrowBack } from "react-icons/io5";
export default function MatrixInfo({ matrix, onBack, onSubjectClick }) {
  const pdfRef = useRef();

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
  const { t, i18n } = useTranslation("global");
  const [loading, setLoading] = useState(false);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const location = useLocation();
  const navigate = useNavigate();
  const [relatedsubjects, setRelatedsubjectss] = useState([]);
  // const matrix = location.state.item || location.state.matrix;
  console.log(matrix.subjects);

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
        setRelatedsubjectss(subjects);
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
    <div>
      <div className=" "></div>

      <div dir={direction}>
        <button
          className="text-center fixed bg-[#CDA03D] py-2 px-3 shadow-xl  rounded-full text-white flex  text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 ml-14 mr-14"
          onClick={onBack}
          dir={direction}
        >
          <IoArrowBack className="" />
        </button>
      </div>
      <div
        className="   justify-center flex items-center mt-[40px] pb-96 "
        dir={direction}
      >
        {loading ? (
          <div className="my-44">
            {" "}
            <Loader />
          </div>
        ) : (
          <Card className="lg:w-[900px] h-auto mb-44">
            <div className="flex justify-end px-4 pt-4 "></div>
            <div className="flex flex-col items-center ">
              <div className="mt-4 w-full">
                <Button
                  onClick={downloadPDF}
                  className="bg-[#d4af37] rounded-full"
                >
                  {" "}
                  {t("text.download")}
                </Button>
              </div>
              {/* الجدول */}
              <div className="mt-4 w-full " ref={pdfRef}>
                <table className="min-w-full  border-collapse">
                  <tbody className="text-gray-700">
                    <tr>
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.name")}
                      </td>
                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {matrix.title}
                      </td>
                    </tr>
                    <tr className="bg-[#fce8ca]">
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.releaseDate")}
                      </td>
                      <td className="px-4 py-2 break-words w-1/2 overflmatrixow-hidden">
                        {matrix.releaseDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.updateDate")}
                      </td>

                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {matrix.updateDate}
                      </td>
                    </tr>
                    <tr className="bg-[#fce8ca]">
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.publisher")}
                      </td>
                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {matrix.companyName}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold">
                        {" "}
                        {t("matrixinfo.introduction")}
                      </td>
                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {matrix.intro}
                      </td>
                    </tr>
                    <tr className="bg-[#fce8ca]">
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.definitions")}
                      </td>

                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {/* {t("matrixinfo.definitionsHeader")} */}
                      </td>
                    </tr>
                    {matrix.definitions.map((elem, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                          {elem.term}
                        </td>
                        <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                          {elem.interpretation}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.permissions")}
                      </td>

                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden"></td>
                    </tr>
                    {relatedsubjects.length > 0 ? (
                      relatedsubjects.map((subject) => (
                        <tr
                          className="border cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            onSubjectClick(subject);
                            // navigate("/subjectInfo", { state: { subject } });
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

                    <tr className="bg-[#fce8ca]">
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.notes")}
                      </td>
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
    </div>
  );
}
