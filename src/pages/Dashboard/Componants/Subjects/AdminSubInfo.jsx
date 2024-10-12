import React, { useEffect, useState, useRef } from "react";
import { Button, Card } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function AdminSubjectInfo({ item }) {
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
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight],
      });

      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      doc.save("table.pdf");
    });
  };

  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const location = useLocation();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!item) {
          console.error("No subject data found in location state");
          return;
        }

        const employeesSnapshot = await getDocs(collection(db, "employees"));
        const employeesList = employeesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEmployees(employeesList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [item]);

  const emp1 = employees.find((emp) => emp.employeeId === item.emp1Id);
  const emp2 = employees.find((emp) => emp.employeeId === item.emp2Id);

  return (
    <div>
      <div className="min-h-screen bg-gray-100 justify-center flex items-center">
        <Card className="w-[1200px]" >
     
          <div className="flex justify-end px-4 pt-4"></div>
          <div className="flex flex-col items-center pb-10">
            <div className="mt-4 w-full" >
            <Button onClick={downloadPDF} className="bg-[#d4af37] rounded-full">     {t("text.download")}</Button>
        
              <table className="min-w-full border-collapse table-fixed" dir={direction} ref={pdfRef}>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.subjectNum")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {item.subjectNum}
                    </td>
                  </tr>
                  <tr className="bg-[#fce8ca]">
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.subjectTitle")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {item.subjectTitle}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.subjectContent")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                      {item.subjectContent}
                    </td>
                  </tr>
                  <tr className="bg-[#fce8ca]">
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectInfo.authorizedEmployee")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {item.emp1.employeeName} - {item.emp1.jobTitle}
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
                  {item.sharedEmployees.length > 0 ? (
                    item.sharedEmployees.map((emp) => {
                      const user = employees.find((empl) => empl.id === emp.empId);
                      return (
                        <tr
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            if (user) {
                              navigate("/userinfo", { state: { user } });
                            }
                          }}
                          key={emp.empId}
                        >
                          <td className="px-4 py-2 break-words w-1/2">
                            {emp.role}
                          </td>
                          <td className="px-4 py-2 break-words w-1/2">
                            {user ? user.employeeName : ""}
                          </td>
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
                      {item.negotiationLimit}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectInfo.notes")}
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
      </div>

    </div>
  );
}
