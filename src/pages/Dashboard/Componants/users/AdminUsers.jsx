/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import AdminUserCard from "./AdminUserCard";
import UserForm from "./AddUserForm";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import Loader from "../../../Login/loader";
import SubjectInfo from "../../../Users/Subjects/SubjectInfo";
import UserInfo from "./userInfo";
import AdminUserInfo from "./userInfo";
import Proxyemployeeinfo from "./proxyemployeeinfo";
import EditUserForm from "./EditeUserForm";

export default function AdminUsers() {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showProxy, setShowProxy] = useState(null);

  const handleEmpClick = (user) => {
    setSelectedSubject(null);
    setSelectedEmp(user);
  };
  const handleSubjectClick = (subject) => {
    setSelectedEmp(null);
    setSelectedSubject(subject);
  };
  const handleProxyEmpClick = (user) => {
    setShowProxy(user);
  };
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
  const handleFormClose = () => {
    setShowUserForm(false);
  };
  const isRtl = i18n.language === "ar";
  return (
    <div className="">
      <div
        className={`flex flex-col lg:justify-center  lg:w-full  md:items-center md:justify-center  md:w-full  gap-4 md:gap-9 z-10 sticky lg:fixed md:fixed sm:sticky xs:sticky `}
      >
        <div
            className={` ${isRtl?"lg:mr-[500px]":"lg:ml-[500px] "} btn-button  text-center btn-curve btn-gold flex items-center text-lg font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300`}
            onClick={() => setShowUserForm(!showUserForm)}
        >
          <span className="whitespace-nowrap flex items-center space-x-2 btn-text">
            {t("userform.adduser")}
          </span>
        </div>

        {/* Search Input */}
      </div>
      <div className="search flex  w-full  items-center z-10 sticky lg:fixed md:fixed sm:sticky xs:sticky mt-20">
        <input
          type="text"
          className="rounded-full text-right h-9 px-4"
          placeholder={t("matrixForm.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap justify-center w-full">
        {showUserForm ? (
          <UserForm onClose={handleFormClose} />
        ) : loading ? (
          <div className="flex justify-center items-center mt-48">
            <Loader />
          </div>
        ) : !selectedEmp && !selectedSubject ? (
          filteredUsers.length > 0 ? (
            // <UserTable users={filteredUsers} onEmpClick={handleEmpClick} />
            filteredUsers.length > 0 ? (
              <div className="overflow-x-auto w-full mx-9 mt-32  mb-96 shadow-2xl">
                <table className="w-full text-center " dir={direction}>
                  <thead className="text-center text-xl font-semibold bg-white">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 text-xl font-semibold py-3"
                      >
                        {t("userInfo.employeeName")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 text-xl font-semibold py-3"
                      >
                        {t("job.jobTitle")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 text-xl font-semibold py-3"
                      >
                        {t("job.phoneNumber")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 text-xl font-semibold py-3"
                      >
                        {t("EmpCard.details")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-xl font-semibold">
                    {filteredUsers.map((user, index) => (
                      <AdminUserCard
                        onEmpClick={handleEmpClick}
                        key={user.employeeId}
                        user={user}
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-44">
                {t("EmpCard.noEmp")}
              </p>
            )
          ) : (
            <p className="text-center text-gray-500 m-44">
              {t("EmpCard.noEmp")}
            </p>
          )
        )    : selectedEmp && !showProxy ? (
          <AdminUserInfo
            onSubjectClick={handleSubjectClick}
            user={selectedEmp}
            onBack={() => setSelectedEmp(null)}
            onShowProxy={handleProxyEmpClick}
          />
        ) : showProxy ? (
          <Proxyemployeeinfo user={showProxy} onBack={() => setShowProxy(null)} />
        ):<EditUserForm  />}
      </div>
    </div>
  );
}
