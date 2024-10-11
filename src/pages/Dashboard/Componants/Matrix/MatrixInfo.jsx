/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Button, Card } from "flowbite-react";
import Topbanner from "../../../Home/componants/banner/Topbanner";
import Bottombanner from "../../../Home/componants/banner/Bottombanner";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import Loader from "../../../Login/loader";
import SideBar from "../../SideBar";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export default function AdminMatrixInfo({ item }) {
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
  const [loading, setLoading] = useState(true);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const location = useLocation();
  const navigate = useNavigate();
  const [relatedsubjects, setRelatedsubjectss] = useState([]);

  useEffect(() => {
    const usersCollectionRef = collection(db, "subjects");

    if (item.subjects) {
      console.log("inside if cond");

      const q = query(
        usersCollectionRef,
        where("subjectTitle", "in", item.subjects)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const subjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRelatedsubjectss(subjects);
        setLoading(false); // تأكد من إلغاء تحميل البيانات
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [item]);

  return (
    <div>
      <div
        className="min-h-screen bg-gray-100 justify-center flex items-center"
        dir={direction}
      >
        {loading ? (
          <Loader />
        ) : (
          <Card className="w-[900px] h-auto my-9">
            <div className="mt-4 w-full">
              <Button onClick={downloadPDF}>{t("text.download")}</Button>
            </div>
            <div className="flex justify-end px-4 pt-4 "></div>
            <div className="flex flex-col items-center pb-10 " ref={pdfRef}>
              {/* الجدول */}
              <div className="mt-4 w-full ">
                <table className="min-w-full border-collapse">
                  <tbody className="text-gray-700">
                    <tr>
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.name")}
                      </td>
                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {item.title}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.releaseDate")}
                      </td>
                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {item.releaseDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.updateDate")}
                      </td>
                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {item.updateDate}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.publisher")}
                      </td>
                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {item.companyName}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.introduction")}
                      </td>
                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {item.intro}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.definitions")}
                      </td>
                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden"></td>
                    </tr>
                    {item.definitions.map((elem, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                          {elem.term}
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
                      <td className="px-4 py-2 font-bold">
                        {t("matrixinfo.notes")}
                      </td>
                      <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                        {item.notes}
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
