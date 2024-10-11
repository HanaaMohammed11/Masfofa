import React, { useEffect, useState } from "react";
import AdminUserCard from "./AdminUserCard";
import UserForm from "./AddUserForm";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../../../Dashboard/btns.css";
import Loader from "../../../Login/loader"; 

export default function AdminUsers() {
  const { t, i18n } = useTranslation("global");
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigate();

  const [showUserForm, setShowUserForm] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true); // Adding loading state

  useEffect(() => {
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
      setLoading(false); // Stop loading when data is fetched
    });

    return () => unsubscribe();
  }, [showUserForm]);

  const handleClick = () => {
    setShowUserForm(!showUserForm);
  };

  // Filtering users based on search term
  const filteredUsers = usersData.filter((user) => {
    const userName = user.employeeName ? user.employeeName.toLowerCase() : "";
    const userEmail = user.email ? user.email.toLowerCase() : "";

    return (
      userName.includes(searchTerm.toLowerCase()) ||
      userEmail.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-9 w-full h-screen">
      <div className="flex flex-col w-full xs:items-center">
        <div
          className="add-btn add-g add-c add-uppercase add-text"
          onClick={handleClick}
        >
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
            filteredUsers.map((user) => <AdminUserCard key={user.id} user={user} />)
          ) : (
            <p className="text-center text-gray-500">
              {t("EmpCard.noEmp")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
