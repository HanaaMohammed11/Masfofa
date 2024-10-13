import React, { useEffect, useState } from "react";
import AdminUserCard from "./AdminUserCard";
import UserForm from "./AddUserForm";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import Loader from "../../../Login/loader";

export default function AdminUsers() {
  const { t } = useTranslation("global");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const qEmps = query(
        collection(db, "employees"),
        where("ownerAdmin", "==", localStorage.getItem("id"))
      );

      const unsubscribe = onSnapshot(
        qEmps,
        (snapshot) => {
          const users = [];
          snapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
          });
          setUsersData(users);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching users: ", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    };

    fetchUsers();
  }, [showUserForm]);

  const filteredUsers = usersData.filter((user) => {
    const userName = user.employeeName?.toLowerCase() || "";
    const userEmail = user.email?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return userName.includes(term) || userEmail.includes(term);
  });

  return (
    <div className="" >
   

 
   <div className={`flex flex-col md:flex-row w-full justify-end items-center gap-4 md:gap-9 z-10 fixed `}>
          <div
    className="btn-button text-center btn-curve btn-gold flex items-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300"
            onClick={() => setShowUserForm(!showUserForm)}
            >
               <span className="whitespace-nowrap flex items-center space-x-2 btn-text">
  {t("userform.adduser")}
    </span>
            
    </div>

          {/* Search Input */}
    <div className="search flex justify-center items-center">
            <input
              type="text"
              className="rounded-full text-right h-9 px-4"  
              placeholder={t("matrixForm.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
       </div>
     
        <div className="flex flex-wrap justify-center w-full">
          {showUserForm ? (
            <UserForm />
          ) : loading ? (
            <div className="flex justify-center items-center mt-48">
              <Loader />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto w-full mx-9 mt-32 shadow-2xl">
              <table className="w-full text-center text-gray-500 dark:text-gray-400">
                <thead className="text-center text-lg bg-white">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      {t("userInfo.employeeName")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("job.jobTitle")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("job.phoneNumber")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("EmpCard.details")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <AdminUserCard
                      key={user.employeeId}
                      user={user}
                      index={index}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-44">{t("EmpCard.noEmp")}</p>
          )}
        </div>
      </div>
 
  );
}
