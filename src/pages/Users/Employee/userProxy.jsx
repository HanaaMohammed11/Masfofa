import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "flowbite-react";

import { getFirestore, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import { useTranslation } from "react-i18next";

export default function UerProxy() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user;
  const mainUserId = location.state.mainUser;
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  console.log(mainUserId);



  const [proxyEmployees, setProxyEmployees] = useState(user.proxyEmployees || []);

  


  

  return (
    <div>
      <Topbanner />
      <div className="min-h-screen justify-center flex items-center" dir={direction}> 
        <Card className="w-[900px] h-auto my-12">
          <div className="flex flex-col items-center pb-10">
            <img
              alt="User Avatar"
              src={user.profileImage || user.proxyProfileImage ||"https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"}
              className="mb-3 rounded-full shadow-lg  w-44 h-44"
            />
            <div className="mt-4 w-full">
              <table className="min-w-full border-collapse">
                <tbody className="text-gray-700">
                  <tr>
                  <td className="px-4 py-2 font-bold"> {t('userInfo.employeeName')}</td>

                    <td className="px-4 py-2">
                      {user.employeeName || user.proxyEmployeeName}
                    </td>
                  </tr>
                  <tr className="bg-[#DEBA9A]">
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
                  <tr className="bg-[#DEBA9A]">
                  <td className="px-4 py-2 font-bold">{t('userInfo.jobGrade')}</td>

                    <td className="px-4 py-2">
                      {user.jobGrade || user.proxyJobGrade}
                    </td>
                  </tr>
                  <tr>
                  <td className="px-4 py-2 font-bold">{t('userInfo.department')}</td>

                    <td className="px-4 py-2">
                      {user.department || user.proxyDepartment}
                    </td>
                  </tr>
                  <tr className="bg-[#DEBA9A]">
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
                  <tr className="bg-[#DEBA9A]">
                  <td className="px-4 py-2 font-bold">{t('userInfo.phoneNumber')}</td>

                    <td className="px-4 py-2">
                      {user.phoneNumber || user.proxyPhoneNumber}
                    </td>
            </tr>

            <tr className="">
                  <td className="px-4 py-2 font-bold">{t('userInfo.email')}</td>

                  <td className="px-4 py-2">{user.employeeEmail||user.proxyEmail}</td>
                  </tr>
                  <tr className="bg-[#DEBA9A]">
                  <td className="px-4 py-2 font-bold">{t('userInfo.currentOffice')}</td>

                    <td className="px-4 py-2">
                      {user.currentOffice || user.proxyCurrentOffice}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
         
          </div>
        </Card>
      </div>
      <Bottombanner />
    </div>
  );
}