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
import SideBar from "../../Dashboard/SideBar";

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
  console.log(user);

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
        console.log(matchedEmployees);
      } catch (error) {
        console.error("Error fetching proxy employees: ", error);
      }finally{
        setLoading(false);
      }
    };

    fetchProxyEmployees();
  }, [db, user.employeeId]);

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

  useEffect(() => {
    console.log(empSubjects);
  }, [empSubjects]);

  const handleCardClick = (proxyEmployee) => {
    navigate("/userProxy", {
      state: { user: proxyEmployee, mainUser: user.id },
    });
  };

  return (
    <div>
      <Topbanner />
  
      <div
        className="min-h-screen bg-gray-100 justify-center flex items-center"
        dir={direction}
      >
         {loading ? ( 
          <Loader />
        ) : ( 
        <Card className="w-[900px] h-auto my-12">
          <div className="flex flex-col items-center pb-10">
            <img
              alt="User Avatar"
              src={
                user.profileImage ||
                "https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"
              }
              className="mb-3 rounded-full shadow-lg w-60 h-60"
            />
            <div className="mt-4 w-full">
              <table className="min-w-full  border-collapse">
                <tbody className="text-gray-700">
                  <tr>
                    <td className="px-4 py-2 font-bold">
                      {" "}
                      {t("userInfo.employeeName")}
                    </td>

                    <td className="px-4 py-2">{user.employeeName}</td>
                  </tr>
                  <tr className="bg-gray-100">
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
                  <tr className="bg-gray-100">
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
                  <tr className="bg-gray-100">
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
                  <tr className="bg-gray-100">
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
                  <tr>
                    <td className="px-4 py-2 font-bold">
                      {t("userInfo.currentOffice")}
                    </td>

                    <td className="px-4 py-2 break-words">
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
                          className={index % 2 === 0 ? "bg-gray-100" : ""}
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
                          className={index % 2 === 0 ? "bg-gray-100" : ""}
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
                  <td className="px-4 py-8 pt-10 font-bold">
                    <h1 className="text-xl">
                      {t("userInfo.permissionsTitle")}
                    </h1>
                  </td>
                  <td></td>

                  {empSubjects.length > 0 ? (
                    empSubjects.map((subject) => (
                      <tr
                        key={subject.id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          navigate("/subjectInfo", { state: { subject } });
                        }}
                      >
                        <td className="px-4 py-2 font-bold ">
                          {t("userInfo.subjectTitle")}
                        </td>
                        <td className="px-4 py-2 break-words">
                          {subject.subjectTitle}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-center">
                        {t("userInfo.noRelatedSubjects")}
                      </td>
                    </tr>
                  )}
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




