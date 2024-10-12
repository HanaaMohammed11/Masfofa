import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminUserCard({ user, index }) {
  const navigate = useNavigate();
  const { t } = useTranslation("global");

  const handleCardClick = () => {
    navigate(`/AdminUserInfo`, { state: { user } });
  };

  // Set alternating row colors
  const rowColor = index % 2 === 0 ? 'bg-[#DEBA9A]' : 'bg-white';

  return (
    <tr className={`${rowColor} cursor-pointer`} onClick={handleCardClick}>
      <td className="px-6 py-4 flex items-center justify-center">
        <img
          alt={`${user.employeeName} image`}
          src={user.profileImage || "https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"}
          className="w-10 h-10 rounded-full shadow-lg"
        />
        <span className="ml-3">{user.employeeName}</span>
      </td>
      <td className="px-6 py-4">{user.jobTitle}</td>
      <td className="px-6 py-4">{user.phoneNumber}</td>
      <td className="px-6 py-4">
        <button className="text-blue-500">{t("EmpCard.details")}</button>
      </td>
    </tr>
  );
}
