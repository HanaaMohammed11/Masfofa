import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "flowbite-react";

import { getFirestore, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";

export default function UerProxy() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user;
  const mainUserId = location.state.mainUser;


  console.log(mainUserId);



  const [proxyEmployees, setProxyEmployees] = useState(user.proxyEmployees || []);

  


  

  return (
    <div>
      <Topbanner />
      <div className="min-h-screen bg-gray-100 justify-center flex items-center">
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
                    <td className="px-4 py-2">
                      {user.employeeName || user.proxyEmployeeName}
                    </td>
                    <td className="px-4 py-2 font-bold">: اسم الموظف</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="px-4 py-2">
                      {user.employeeId || user.proxyEmployeeId}
                    </td>
                    <td className="px-4 py-2 font-bold">: الرقم الوظيفي</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">
                      {user.hiringDate || user.proxyHireDate}
                    </td>
                    <td className="px-4 py-2 font-bold">: تاريخ التعيين</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="px-4 py-2">
                      {user.jobGrade || user.proxyJobGrade}
                    </td>
                    <td className="px-4 py-2 font-bold">: الدرجة الوظيفية</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">
                      {user.department || user.proxyDepartment}
                    </td>
                    <td className="px-4 py-2 font-bold">: الإدارة/القسم</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="px-4 py-2">
                      {user.officeNumber || user.proxyOfficeNumber}
                    </td>
                    <td className="px-4 py-2 font-bold">: رقم المكتب</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">
                      {user.jobTitle || user.proxyJobTitle}
                    </td>
                    <td className="px-4 py-2 font-bold">: المسمى الوظيفي</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="px-4 py-2">
                      {user.phoneNumber || user.proxyPhoneNumber}
                    </td>
                    <td className="px-4 py-2 font-bold">: رقم الهاتف</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">
                      {user.currentOffice || user.proxyCurrentOffice}
                    </td>
                    <td className="px-4 py-2 font-bold">: المبنى/المكتب</td>
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