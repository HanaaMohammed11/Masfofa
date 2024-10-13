import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AiFillEye } from "react-icons/ai";

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
      <div style={profileContainerStyle}>
        <img
          alt={`${user.employeeName} image`}
          src={user.profileImage || "https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"}
          style={imageStyle}
        />
      </div>
      <span className="ml-3">{user.employeeName}</span>
    </td>

      <td className="px-6 py-4">{user.jobTitle}</td>
      <td className="px-6 py-4">{user.phoneNumber}</td>
      <td className="px-6 py-4">
        <button className="text-blue-500">       <AiFillEye size={20} /></button>
      </td>
    </tr>
  );
}
const profileContainerStyle = {

  width: '60px',  
  height: '60px', 
  position: 'relative',
  borderRadius: '50%',
  border: '5px solid transparent', // إطار شفاف
  background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #000000 40%, #404040 60%, #C0C0C0 100%)',
  animation: 'rotate-border 5s linear infinite',
};

const imageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '50%', // لضمان كون الصورة دائرية
  display: 'block',
};