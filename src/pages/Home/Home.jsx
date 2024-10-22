import React, { useState } from "react";
import Topbanner from "./../Home/componants/banner/Topbanner";
import Bottombanner from "./../Home/componants/banner/Bottombanner";
import Cards from "./Card";
import MatrixLists from "../Users/Matrixs/MatrixLists";
import { useTranslation } from "react-i18next";
import SubjectsLists from "../Users/Subjects/SubjectList";
import AdminDashboard from "../Dashboard/AdminDashboard";
import Users from "../Users/Employee/Users";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Home() {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [selectedContent, setSelectedContent] = useState("matrices");
  const isRTL = i18n.language === "ar"; 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (selectedContent) {
      case "employees":
        return <Users />;
      case "articles":
        return <SubjectsLists />;
      case "matrices":
        return <MatrixLists />;
      case "dashboard":
        return <AdminDashboard />; 
      default:
        return <div>Select a category from the sidebar</div>;
    }
  };

  return (
<div className="relative flex h-screen bg-[#F5F5F5] w-full" dir={direction}>
  {/* Hamburger Icon - visible only on small screens */}
  <div className="sm:hidden absolute p-4 z-50">
    <button onClick={toggleSidebar}>
      {isSidebarOpen ? (
        <FaTimes size={24} className="text-red-700" />
      ) : (
        <FaBars size={24} className="text-gray-700" />
      )}
    </button>
  </div>

  {/* Sidebar */}
  <div
    className={`${
      isSidebarOpen ? "" : ""
    } h-full flex-shrink-0 fixed top-0 w-64 z-50 bg-white shadow-lg lg:block md:hidden sm:hidden hidden`}
  >
    <Cards setSelectedContent={setSelectedContent} />
  </div>

  {/* Main Content Area */}
  <div className={`w-full flex flex-col ${isRTL ? "mr-[14.3%]" : "ml-[14.3%]"}`}>
    {/* Top Banner with 86% width */}
    <div className="w-[86%] ">
      <Topbanner />
    </div>

    {/* Main content */}
    <div className="">{renderContent()}</div>

    {/* Bottom Banner with 86% width */}
    <div className="mt-auto w-[8%] ">
      <Bottombanner  />
    </div>
  </div>
</div>

  );
}
