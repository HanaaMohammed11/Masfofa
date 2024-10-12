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

      const unsubscribe = onSnapshot(qEmps, (snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setUsersData(users);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching users: ", error);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchUsers();
  }, [showUserForm]);

  const filteredUsers = usersData.filter(user => {
    const userName = user.employeeName?.toLowerCase() || "";
    const userEmail = user.email?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return userName.includes(term) || userEmail.includes(term);
  });

  return (
    <div className="p-9 w-full min-h-screen">
      <div className="flex flex-col w-full xs:items-center">
        <div className="add-btn add-g add-c add-uppercase add-text" onClick={() => setShowUserForm(!showUserForm)}>
          {t("userform.adduser")}
        </div>

        <div className="search flex flex-col justify-center">
          <input
            type="text"
            placeholder={t("search.searchEmployees")}
            className="xs:w-72 sm:w-96 rounded-full text-right mt-7"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center w-full">
          {showUserForm ? (
            <UserForm />
          ) : loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto w-full mx-9 my-10 shadow-2xl">
              <table className="w-full text-center text-gray-500 dark:text-gray-400">
                <thead className="text-center text-lg bg-white">
                  <tr>
                    <th scope="col" className="px-6 py-3">{t("userInfo.employeeName")}</th>
                    <th scope="col" className="px-6 py-3">{t("job.jobTitle")}</th>
                    <th scope="col" className="px-6 py-3">{t("job.phoneNumber")}</th>
                    <th scope="col" className="px-6 py-3">{t("EmpCard.details")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <AdminUserCard key={user.employeeId} user={user} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">{t("EmpCard.noEmp")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
