/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import AdminUserCard from "./AdminUserCard";
import UserForm from "./AddUserForm";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";

export default function AdminUsers() {
  const { t, i18n } = useTranslation("global");
  const [searchTerm, setSearchTerm] = useState('');
  const [showuserForm, setShowuserForm] = useState(false);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const usersCollectionRef = collection(db, "employees");

    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      setUsersData(users);
    });

    return () => unsubscribe();
  }, [showuserForm]);

  const handleClick = () => {
    setShowuserForm(!showuserForm);
  };

  // تصفية المستخدمين بناءً على مصطلح البحث
  const filteredUsers = usersData.filter(user => {
    const userName = user.employeeName ? user.employeeName.toLowerCase() : '';
    const userEmail = user.email ? user.email.toLowerCase() : '';
    
    return (
      userName.includes(searchTerm.toLowerCase()) || 
      userEmail.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-9">
      <div className="flex justify-between w-full">
        <div
          className="text-lg font-bold mx-5 text-white"
          style={{
            backgroundImage: `url("./src/assets/WhatsApp_Image_2024-10-01_at_8.39.17_AM-removebg-preview.png")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "79px",
            width: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={handleClick}
        >
          {t("userform.adduser")}
        </div>
        <div className='search flex justify-center'>
          <input
            type="text"
            placeholder={t("search.searchEmployees")}
            className="w-96 rounded-full h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap">
        {showuserForm ? (
          <UserForm />
        ) : (
          <>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => <AdminUserCard key={user.id} user={user} />)
            ) : (
              <p className="text-center text-gray-500">{t("search.noResults")}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
