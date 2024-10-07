/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SideBar from "./SideBar";
import MatrixForm from "./Componants/Matrix/MatrixForm";
import MatrixList from "./Componants/Matrix/MatrixList";
import EditTheme from "./Componants/EditTheme";
import AdminUserCard from "./Componants/users/AdminUserCard";
import AdminUsers from "./Componants/users/AdminUsers";
import SubjectList from "./Componants/Subjects/SubjectList";
import AddAccounts from "./Componants/Addaccunts";
import Topbanner from "../Home/componants/banner/Topbanner";
import Bottombanner from "../Home/componants/banner/Bottombanner";

function AdminDashboard() {
    const { t ,i18n} = useTranslation("global");
    const [activeItem, setActiveItem] = useState(t("sidebar.dashboard"));  
    const direction = i18n.language === "ar" ? "rtl" : "ltr";

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    const renderComponent = () => {
        const components = {
            [t("sidebar.dashboard")]: <MatrixList />,
            [t("sidebar.editAppearance")]: <EditTheme />,
            [t("sidebar.employees")]: <AdminUsers />,
            [t("sidebar.permissions")]: <SubjectList />,
            [t("sidebar.addUser")]: <AddAccounts />
        };

        return components[activeItem] || null; 
    };

    return (
        <div>
            <Topbanner/>
        <div className="flex flex-row-reverse min-h-screen bg-gray-100" dir={direction}>
          
               <div className="flex-grow">
                {renderComponent()}
            </div>
            <div className="w-64">
                <SideBar activeItem={activeItem} onItemClick={handleItemClick} />
            </div>

         
        </div>
        <Bottombanner/>
        </div>
    );
}

export default AdminDashboard;
