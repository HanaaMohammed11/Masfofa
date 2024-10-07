/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaTh, FaBook, FaUsers } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { FaUserPlus } from "react-icons/fa6";
import btnBckg from "../../assets/btn.png";

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
        className={`lg:hidden fixed top-4 ${
          isRtl ? "left-4" : "right-4"
        } z-50 bg-[#f5bc42] p-2 rounded-md text-white`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FiMenu size={24} />
      </button>

      <div
        className={`Sidebar w-64 h-full bg-[#696969] text-white fixed transform transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : isRtl
            ? "-translate-x-full"
            : "translate-x-full"
        } ${isRtl ? "right-0" : "left-0"} lg:translate-x-0 lg:block hidden`}
      >
        <div className="pt-10">
          {items.map(({ name, icon }) => (
            <div
              style={{
                backgroundSize: "cover",
                height: 100, // Make sure the image covers the entire button
                backgroundPosition: "center", // Center the image
                backgroundRepeat: "no-repeat", // Ensure the image doesn’t repeat
                backgroundImage: `url(${btnBckg})`,
                alignItems: "center", // Align the content vertically
                justifyContent: "center", // Align the content horizontally
                color: "white", // Set the text color
                cursor: "pointer", // Make it clickable
                padding: "10px 20px", // Add more padding for a better click area
                borderRadius: "8px", // Give a subtle rounded edge to the button
                marginBottom: "10px", // Space between buttons
                transition: "all 0.3s ease", // Smooth transition for hover effects
              }}
              key={name}
              className={`flex items-center justify-between text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 ${
                activeItem === name ? "bg-gray-100 text-[#525353]" : ""
              }`}
              onClick={() => {
                onItemClick(name);
                toggleSidebar();
              }}
              aria-label={`Navigate to ${name}`}
            >
              <span className="flex items-center space-x-4">
                {icon} <span className="whitespace-nowrap">{name}</span>{" "}
                {/* Prevent text from breaking */}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SideBar;
