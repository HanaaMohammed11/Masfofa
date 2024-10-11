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

export default function UserInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user;
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
      }finally{
        setLoading(false);
      }
    };

    fetchProxyEmployees();
  }, [db, user.employeeId]);

  const handleCardClick = (proxyEmployee) => {
    navigate("/userProxy", {
      state: { user: proxyEmployee, mainUser: user.id },
    });}

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
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Topbanner />
      <div dir={direction}>  <button className="text-center bg-[#CDA03D] py-2 px-9 shadow-xl m-9 rounded-full text-white flex  text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300" onClick={handleBack} dir={direction}>
        <IoArrowBack className="mt-1 mr-3" />  {t("text.back")}
            </button></div>
      <div
        className="min-h-screen flex justify-center items-start "
        dir={direction}
      >
         {loading ? ( 
          <Loader />
        ) : ( 
          <div className="flex flex-col md:flex-row  md:w-[90%] lg:w-[70%]  sm:w-[50%] w-full p-4">
            {/* Left Side: User Info */}
            <Card className="w-full h-auto my-12 p-6">
              <div className="flex flex-col items-center pb-10">
                <img
                  alt="User Avatar"
                  src={
                    user.profileImage ||
                    "https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"
                  }
                  className="mb-3 rounded-full shadow-lg w-44 h-44"
                />
                <div className="mt-4 ">
                  <table className=" border-collapse">
                    <tbody className="text-gray-700">
                    <tr>
                    <td className="px-4 py-2 font-bold">
                   
                      {t("userInfo.employeeName")}
                    </td>

                    <td className="px-4 py-2">{user.employeeName}</td>
                  </tr>

                  <tr className="bg-[#DEBA9A]">
                    <td className="px-4 py-2 font-bold">
                      {" "}
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
                  <tr className="">
                    <td className="px-4 py-2 font-bold">
                      {t("userInfo.email")}
                    </td>

                    <td className="px-4 py-2">{user.employeeEmail}</td>
                  </tr>
                  <tr className="bg-[#DEBA9A]">
                    <td className="px-4 py-2 font-bold">
                      {t("userInfo.currentOffice")}
                    </td>

                    <td className="px-4 py-2 break-words ">
                      {user.currentOffice}
                    </td>
                  </tr>
                  <tr>
                    <td className=" py-8 pt-10 font-bold">
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
                          onClick={() => handleCardClick(proxyEmployee)}
                        >
                          <td className="px-4 py-2 font-bold">
                            {" "}
                            {t("userInfo.proxyEmployeeName")}
                          </td>

                          <td className="px-4 py-2">
                            {proxyEmployee.proxyEmployeeName}
                          </td>
                        </tr>
                        <tr
                          className={index % 2 === 0 ? "bg-[#DEBA9A]" : ""}
                          onClick={() => handleCardClick(proxyEmployee)}
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
            <div className="w-full md:w-[40%] mt-6 md:mt-14 md:ml-9 lg:mr-9 sm:mr-0 mr-0">
              <Card className="p-4">
                <h2 className="text-xl font-bold mb-4">{t("userInfo.permissionsTitle")}</h2>
                {empSubjects.length > 0 ? (
                  empSubjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="cursor-pointer hover:bg-gray-100 p-2 border-b"
                      onClick={() => navigate("/subjectInfo", { state: { subject } })}
                    >
                      {subject.subjectTitle}
                    </div>
                  ))
                ) : (
                  <div className="text-center">{t("userInfo.noRelatedSubjects")}</div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
 
      <Bottombanner />
    </div>
  );
}
