/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaTh, FaBook, FaUsers } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { FaUserPlus } from "react-icons/fa6";
import "../Home/Card.css";

function SideBar({ activeItem, onItemClick }) {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [isOpen, setIsOpen] = useState(false);
  const isRtl = i18n.language === "ar";

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const items = [
    { name: t("sidebar.dashboard"), icon: <FaTh className="text-[#f5bc42]" /> },
    {
      name: t("sidebar.permissions"),
      icon: <FaBook className="text-[#f5bc42]" />,
    },
    {
      name: t("sidebar.employees"),
      icon: <FaUsers className="text-[#f5bc42]" />,
    },
    {
      name: t("sidebar.editAppearance"),
      icon: <IoSettingsSharp className="text-[#f5bc42]" />,
    },
    {
      name: t("sidebar.addUser"),
      icon: <FaUserPlus className="text-[#f5bc42]" />,
    },
  ];

  return (
    <>
      <button
        className={`lg:hidden t z-50 bg-[#f5bc42] p-2 rounded-md text-white`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FiMenu size={24} />
      </button>

      {/* Dropdown menu under the button */}
      {isOpen && (
        <div className={`lg:hidden bg-[#969594] p-4 mt-14`}>
          {items.map(({ name, icon }) => (
            <div
              key={name}
              className="flex items-center justify-start text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 p-2 rounded"
              onClick={() => {
                onItemClick(name);
                toggleSidebar();
              }}
              aria-label={`Navigate to ${name}`}
            >
              <span className="flex items-center space-x-4">
          
                <span className="whitespace-nowrap">{name}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        className={`Sidebar w-64 h-full text-white fixed transform transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : isRtl
            ? "-translate-x-full"
            : "translate-x-full"
        } ${isRtl ? "right-9" : "left-9"} lg:translate-x-0 lg:block hidden`}
      >
        <div className="pt-10">
          {items.map(({ name, icon }) => (
            <div
              key={name}
              className={`aux-button aux-curve aux-gold flex items-center justify-between text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 ${
                activeItem === name ? "bg-opacity-90" : ""
              }`} 
              onClick={() => {
                onItemClick(name);
                toggleSidebar();
              }}
              aria-label={`Navigate to ${name}`}
            >
              <span className="flex items-center space-x-4 aux-text">
              
                <span className="whitespace-nowrap">{name}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SideBar;
