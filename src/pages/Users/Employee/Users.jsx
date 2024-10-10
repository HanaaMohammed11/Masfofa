import React, { useEffect, useState } from "react";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import UserCard from "./UserCard";
import { useTranslation } from "react-i18next";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../../../config/firebase";
import Loader from "../../Login/loder";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState([]);
  const { t, i18n } = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const usersCollectionRef = collection(db, "employees");

    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      setUsersData(users);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredUsers = usersData.filter((user) =>
    user.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="relative flex justify-center items-center text-center">
        <Topbanner />
      </div>

      {/* شريط البحث */}
      <div className="search flex justify-center mt-9">
        <input
          type="text"
          placeholder={t("search.searchEmployees")}
          className="xs:w-72 sm:w-96 rounded-full"
          dir={direction}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap justify-center items-center mt-10 min-h-[300px]">
        {loading ? ( 
          <Loader />
        ) : (
          filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-44">
              {t("EmpCard.noEmp")}
            </p>
          )
        )}
      </div>

      <div className="mt-auto">
        <Bottombanner />
      </div>
    </div>
  );
}
