import React, { useEffect, useState } from "react";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import UserCard from "./UserCard";
import { useTranslation } from "react-i18next";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../../../config/firebase";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); 
  const [usersData, setUsersData] = useState([]);
  const {t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

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
  }, []);

  const filteredUsers = usersData.filter((user) =>
    user.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100" >
      <div className="relative flex justify-center items-center text-center">
        <Topbanner />
        <h1 className="absolute top-16 text-6xl font-semibold text-gray-700" style={{ fontFamily: "cursive" }}>
          {t("employees.title")}
        </h1>
      </div>

      {/* Search bar */}
      <div className='search flex justify-center mt-9'>
        <input
          type="text"
          placeholder={t("search.searchEmployees")}
          className="xs:w-72 sm:w-96 rounded-full "
          dir={direction}
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* User Cards section */}
      <div className="flex flex-wrap justify-center">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))) : (
          <p className="text-center text-gray-500 mt-44">{t("EmpCard.noEmp")}</p>
        )}
        
      </div>

      <div className='mt-auto'>
        <Bottombanner />
      </div>
    </div>
  );
}
