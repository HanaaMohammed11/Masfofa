import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "flowbite-react";
import Topbanner from "./../../../Home/componants/banner/Topbanner";
import Bottombanner from "./../../../Home/componants/banner/Bottombanner";
import { getFirestore, doc, deleteDoc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import SideBar from "../../SideBar";
import MatrixList from "../Matrix/MatrixList";
import EditTheme from "../EditTheme";
import AdminUsers from "./AdminUsers";
import SubjectList from "../Subjects/SubjectList";
import AddAccounts from "../Addaccunts";

export default function AdminUserInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user;
  const [proxyEmployees, setProxyEmployees] = useState([]);

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
            console.log(`Document with ID: ${id} not found.`);
          }
        }

        setProxyEmployees(matchedEmployees);

        console.log(matchedEmployees); 
      } catch (error) {
        console.error("Error fetching proxy employees: ", error);
      }
    };

    fetchProxyEmployees();
  }, [db, user.employeeId]);

  const handleEdit = () => {
    navigate("/edituser", { state: { user } });
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "employees", user.id));
      console.log(`Deleted user with ID: ${user.employeeId}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert("فشل حذف المستخدم. حاول مرة أخرى.");
    }
  };

  const handleCardClick = (proxyEmployee) => {
    navigate("/proxyemployeeinfo", { state: { user: proxyEmployee, mainUser: user.id } });
  };
  const [activeItem, setActiveItem] = useState(t("sidebar.dashboard"));  


  const handleItemClick = (item) => {
      setActiveItem(item);
  };

  const renderComponent = () => {
      // const components = {
      //     [t("sidebar.dashboard")]: <MatrixList />,
      //     [t("sidebar.editAppearance")]: <EditTheme />,
      //     [t("sidebar.employees")]: <AdminUsers />,
      //     [t("sidebar.permissions")]: <SubjectList />,
      //     [t("sidebar.addUser")]: <AddAccounts />
      // };

      // return components[activeItem] || null; 
  };

  return (
    <div>
      <Topbanner />
      <div className="flex-grow">
                {renderComponent()}
            </div>
            <div className="w-64">
                <SideBar activeItem={activeItem} onItemClick={handleItemClick} />
            </div>
      <div className="min-h-screen bg-gray-100 justify-center flex items-center"      dir={direction}>
     
        <Card className="w-[900px] h-auto my-12">
          <div className="flex flex-col items-center pb-10">
            <img
              alt="User Avatar"
              src={user.profileImage ||"https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"}
              className="mb-3 rounded-full shadow-lg w-60 h-60"
            />
            <div className="mt-4 w-full">
              <table className="min-w-full border-collapse">
                <tbody className="text-gray-700">
                  <tr>
                  <td className="px-4 py-2 font-bold">
  
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
                  <tr>
                  <td className="px-4 py-2 font-bold">
                      {t("userInfo.currentOffice")}
                    </td>
                    <td className="px-4 py-2 break-words">{user.currentOffice}</td>
                
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="px-4 py-2 font-bold">
                      {t("userInfo.email")}
                    </td>

                    <td className="px-4 py-2">{user.employeeEmail}</td>
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
                          <td className="px-4 py-2">{proxyEmployee.proxyEmployeeName}</td>
                       
                        </tr>
                        <tr
                          className={index % 2 === 0 ? "bg-gray-100" : ""}
                          onClick={() => handleCardClick(proxyEmployee)}
                        >
                           <td className="px-4 py-2 font-bold">
                            {t("userInfo.proxyPhoneNumber")}
                          </td>
                          <td className="px-4 py-2">{proxyEmployee.proxyPhoneNumber}</td>
                      
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
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex gap-9">
              <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              {t("userInfo.edituser")}
              </Button>
              <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
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