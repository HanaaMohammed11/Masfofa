/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import AdminUserCard from "./AdminUserCard";
import UserForm from "./AddUserForm";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../../../Dashboard/btns.css"

export default function AdminUsers() {
  const { t, i18n } = useTranslation("global");
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigate();


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
    <div className="p-9 w-full">
      <div className="w-full">
      <div
  className="add-btn add-g add-c add-uppercase add-text"
  onClick={handleClick}
>
          {t("userform.adduser")}
        </div>
        <div className='earch flex justify-center '>
          <input
            type="text"
            placeholder={t("search.searchEmployees")}
            className="xs:w-72 sm:w-96 rounded-full text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
    <div className="p-9  ">
      <div className="flex justify-between w-full xs:flex-col md:flex-row xs:items-center">
   
        <div className='search flex justify-center mt-9'>
       
        </div>
      </div>

      <div className="flex flex-wrap justify-center w-full">
        {showuserForm ? (
          <UserForm />
        ) : (
          <>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => <AdminUserCard key={user.id} user={user} />)
            ) : (
              <p className="text-center text-gray-500">{t("EmpCard.noEmp")}</p>
            )}
          </>
        )}
      </div>
      </div>    </div>    </div>
  );
}
