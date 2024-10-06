import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "flowbite-react";
import Topbanner from "./../../../Home/componants/banner/Topbanner";
import Bottombanner from "./../../../Home/componants/banner/Bottombanner";
import { getFirestore, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

export default function Proxyemployeeinfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user;
  const mainUserId = location.state.mainUser;


  console.log(mainUserId);

  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";


  const [proxyEmployees, setProxyEmployees] = useState(user.proxyEmployees || []);

  const handleDeleteProxyEmployee = async (proxyEmployeeId) => {
    try {
      const db = getFirestore();

      if (!proxyEmployeeId) {
        console.error("proxyEmployeeId غير موجود!");
        return;
      }

      const proxyEmployeeDocRef = doc(db, "proxyEmployees", proxyEmployeeId);


      await deleteDoc(proxyEmployeeDocRef);
      console.log(`م حذف وثيقة الموظف البديل بنجاح من مجموعة proxyEmployees`);

      const employeeDocRef = doc(db, "employees", mainUserId);
      const employeeDocSnap = await getDoc(employeeDocRef);

      if (employeeDocSnap.exists()) {
        const employeeData = employeeDocSnap.data();
        const proxyEmployeesIds = employeeData.proxyEmployeeIds || [];

        const updatedProxyEmployeesIds = proxyEmployeesIds.filter(
          (id) => id !== proxyEmployeeId
        );

        await updateDoc(employeeDocRef, {
          proxyEmployeeIds: updatedProxyEmployeesIds,
        });

        console.log("تم تحديث قائمة الموظفين البدلاء بنجاح في مجموعة employees");

        setProxyEmployees(updatedProxyEmployeesIds);
        navigate("/");

      } else {
        console.log("لا يوجد مستند للموظف في مجموعة employees");
      }
    } catch (error) {
      console.error("خطأ أثناء حذف الموظف البديل:", error);
    }
  };


  const handleEdit = () => {
    navigate("/editproxy", { state: { user: { ...user, id: user.id } } });
  };
  

  return (
    <div>
      <Topbanner />
      <div className="min-h-screen bg-gray-100 justify-center flex items-center" dir={direction}>
        <Card className="w-[900px] h-auto my-12">
          <div className="flex flex-col items-center pb-10">
            <img
              alt="User Avatar"
              src={user.profileImage || user.proxyProfileImage ||"https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"}
              className="mb-3 rounded-full shadow-lg  w-60 h-60"
            />
            <div className="mt-4 w-full">
              <table className="min-w-full text-right border-collapse">
                <tbody className="text-gray-700">
                  <tr>
                  <td className="px-4 py-2 font-bold"> {t('userInfo.employeeName')}</td>

                    <td className="px-4 py-2">
                      {user.employeeName || user.proxyEmployeeName}
                    </td>
                
                  </tr>
                  <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-bold"> {t('userInfo.employeeId')}</td>
                    <td className="px-4 py-2">
                      {user.employeeId || user.proxyEmployeeId}
                    </td>
                  </tr>
                  <tr>
                  <td className="px-4 py-2 font-bold">{t('userInfo.hireDate')}</td>

                    <td className="px-4 py-2">
                      {user.hiringDate || user.proxyHireDate}
                    </td>
                    </tr>
                  <tr className="bg-gray-100">
                   
                    <td className="px-4 py-2 font-bold">{t('userInfo.jobGrade')}</td>    <td className="px-4 py-2">
                      {user.jobGrade || user.proxyJobGrade}
                    </td>               </tr>
                  <tr>
                  <td className="px-4 py-2 font-bold">{t('userInfo.department')}</td>

                    <td className="px-4 py-2">
                      {user.department || user.proxyDepartment}
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-bold">{t('userInfo.officeNumber')}</td>

                    <td className="px-4 py-2">
                      {user.officeNumber || user.proxyOfficeNumber}
                    </td>
                  </tr>
                  <tr>
                  <td className="px-4 py-2 font-bold ">{t('userInfo.jobTitle')}</td>
                    <td className="px-4 py-2">
                      {user.jobTitle || user.proxyJobTitle}
                    </td>
                 
                  </tr>
                  <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-bold">{t('userInfo.phoneNumber')}</td>

                    <td className="px-4 py-2">
                      {user.phoneNumber || user.proxyPhoneNumber}
                    </td>
              
                  </tr>
                  <tr>
                  <td className="px-4 py-2 font-bold">{t('userInfo.currentOffice')}</td>
                    <td className="px-4 py-2">
                      {user.currentOffice || user.proxyCurrentOffice}
                    </td>
                  </tr>
                  <tr className="">
                  <td className="px-4 py-2 font-bold">{t('userInfo.email')}</td>

                    <td className="px-4 py-2">{user.employeeEmail||user.proxyEmail}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex gap-9">
              <Button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                    {t("userInfo.edituser")}
              </Button>
              <Button
                onClick={() => handleDeleteProxyEmployee(user.id)}
                className="bg-red-600 hover:bg-red-700"
              >
               {t("userInfo.delete")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Bottombanner />
    </div>
  );
}