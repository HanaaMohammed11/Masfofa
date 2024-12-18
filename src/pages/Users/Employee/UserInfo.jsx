/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "flowbite-react";
import {
  getFirestore,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import { useTranslation } from "react-i18next";
import Loader from "../../Login/loader";
import { IoArrowBack } from "react-icons/io5";

export default function UserInfo({ user, onBack, onSubjectClick ,onShowProxy}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [proxyEmployees, setProxyEmployees] = useState([]);
  const [empSubjects, setEmpSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const fetchProxyEmployees = async () => {
      try {
        const matchedEmployees = [];

        for (const id of user.proxyEmployeeIds) {
          const docRef = doc(db, "proxyEmployees", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            matchedEmployees.push({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.log(`Document with ID: ${id} not found`);
          }
        }

        setProxyEmployees(matchedEmployees);
      } catch (error) {
        console.error("Error fetching proxy employees: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProxyEmployees();
  }, [db, user.employeeId]);

  const handleCardClick = (proxyEmployee) => {
    navigate("/userProxy", {
      state: { user: proxyEmployee, mainUser: user.id },
    });
  };

  useEffect(() => {
    const fetchSubjectByEmployeeID = async () => {
      const subjectRef = collection(db, "subjects");
      const q = query(subjectRef, where("emp1.id", "==", user.id));
      const subjectSnapshot = await getDocs(q);
      const subjects = subjectSnapshot.docs.map((doc) => doc.data());
      setEmpSubjects(subjects);
    };
    fetchSubjectByEmployeeID();
  }, [user.id]);

  return (
    <>
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
        className="  mt-[40px] justify-center flex items-center mb-44"
        dir={direction}
      >
        {loading ? (
          <div className="m-96">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col r md:flex-row lg:w-[1100px] p-4 overflow-hidden">
            {/* Left Side: User Info */}
            <Card className="w-full  p-6">
              <div className="flex flex-col items-center pb-10">
                <div style={profileContainerStyle}>
                  <img
                    alt={`${user.employeeName} image`}
                    src={
                      user.profileImage ||
                      "https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"
                    }
                    style={imageStyle}
                  />
                </div>
                <div className="mt-4 overflow-x-auto w-full">
                  <table className="border-collapse w-full">
                    <tbody className="text-gray-700">
                      <tr>
                        <td className="px-4 py-2 font-bold">
                          {t("userInfo.employeeName")}
                        </td>
                        <td className="px-4 py-2">{user.employeeName}</td>
                      </tr>
                      <tr className="bg-[#DEBA9A]">
                        <td className="px-4 py-2 font-bold">
                          {t("userInfo.employeeId")}
                        </td>
                        <td className="px-4 py-2">{user.employeeId}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold">
                          {t("userInfo.hireDate")}
                        </td>
                        <td className="px-4 py-2">{user.hireDate}</td>
                      </tr>
                      <tr className="bg-[#DEBA9A]">
                        <td className="px-4 py-2 font-bold">
                          {t("userInfo.jobGrade")}
                        </td>
                        <td className="px-4 py-2">{user.jobGrade}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold">
                          {t("userInfo.department")}
                        </td>
                        <td className="px-4 py-2">{user.department}</td>
                      </tr>
                      <tr className="bg-[#DEBA9A]">
                        <td className="px-4 py-2 font-bold">
                          {t("userInfo.officeNumber")}
                        </td>
                        <td className="px-4 py-2">{user.officeNumber}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold">
                          {t("userInfo.jobTitle")}
                        </td>
                        <td className="px-4 py-2">{user.jobTitle}</td>
                      </tr>
                      <tr className="bg-[#DEBA9A]">
                        <td className="px-4 py-2 font-bold">
                          {t("userInfo.phoneNumber")}
                        </td>
                        <td className="px-4 py-2">{user.phoneNumber}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold">
                          {t("userInfo.email")}
                        </td>
                        <td className="px-4 py-2">{user.employeeEmail}</td>
                      </tr>
                      <tr className="bg-[#DEBA9A]">
                        <td className="px-4 py-2 font-bold">
                          {t("userInfo.currentOffice")}
                        </td>
                        <td className="px-4 py-2 break-words">
                          {user.currentOffice}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-8 pt-10 font-bold">
                          <h1 className="text-xl">
                            {t("userInfo.proxyEmployeeTitle")}
                          </h1>
                        </td>
                        <td></td>
                      </tr>
                      {/* عرض الموظفين البدلاء */}
                      {proxyEmployees.length > 0 ? (
                        proxyEmployees.map((proxyEmployee, index) => (
                          <React.Fragment key={index}>
                            <tr
                              className={index % 2 === 0 ? "bg-[#DEBA9A]" : ""}
                              onClick={() => onShowProxy(proxyEmployee)}
                            >
                              <td className="px-4 py-2 font-bold">
                                {t("userInfo.proxyEmployeeName")}
                              </td>
                              <td className="px-4 py-2">
                                {proxyEmployee.proxyEmployeeName}
                              </td>
                            </tr>
                            <tr
                              className={index % 2 === 0 ? "bg-[#DEBA9A]" : ""}
                              onClick={() => onShowProxy(proxyEmployee)}
                            >
                              <td className="px-4 py-2 font-bold">
                                {t("userInfo.proxyPhoneNumber")}
                              </td>
                              <td className="px-4 py-2">
                                {proxyEmployee.proxyPhoneNumber}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td className="px-4 py-2" colSpan="2">
                            {t("userInfo.noProxyEmployees")}
                          </td>
                        </tr>
                      )}
                      <td></td>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* Right Side: Permissions Sidebar */}
            <div className="w-full md:w-[40%]  md:ml-9 lg:mr-9 sm:mr-0">
              <Card className="p-4">
                <h2 className="text-xl font-bold mb-4">
                  {t("userInfo.permissionsTitle")}
                </h2>
                {empSubjects.length > 0 ? (
                  empSubjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="cursor-pointer hover:bg-gray-100 p-2 border-b"
                      onClick={
                        () => onSubjectClick(subject)
                        // navigate("/subjectInfo", { state: { subject } })
                      }
                    >
                      {subject.subjectTitle}
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    {t("userInfo.noRelatedSubjects")}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
const profileContainerStyle = {
  margin: "auto",
  width: "10vw",
  height: "10vw",
  maxWidth: "250px",
  maxHeight: "250px",
  minWidth: "50px",
  minHeight: "50px",
  position: "relative",
  borderRadius: "50%",
  border: "15px solid transparent",
  background:
    "linear-gradient(white, white) padding-box, linear-gradient(45deg, #FFD700 10%, #DAA520 10%, #C0C0C0 100%) border-box", // الخلفية الذهبية
};

const imageStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  display: "block",
};

const style = `

  }
`;
document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);
