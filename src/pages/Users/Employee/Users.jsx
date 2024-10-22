import React, { useEffect, useState } from "react";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import { useTranslation } from "react-i18next";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import db from "../../../config/firebase";
import Loader from "../../Login/loader";
import { useNavigate } from "react-router-dom";
import UserTable from "./UserCard";
import UserInfo from "./UserInfo";

export default function Users() {
  const navigate = useNavigate();
  const [tempSearchTerm, setTempSearchTerm] = useState(""); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchType, setSearchType] = useState(""); 
  const [usersData, setUsersData] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null); 
  const handleClearFilters = () => {
    setSearchTerm("");
    setSearchType("");
    setTempSearchTerm("")
  };
  const { t, i18n } = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const handleEmpClick = (user) => {
    setSelectedEmp(user);
  };
  useEffect(() => {
    const qUser = query(
      collection(db, "users"),
      where("ID", "==", localStorage.getItem("id"))
    );
    const unsubscribe = onSnapshot(qUser, (snapshot) => {
      const userData = [];
      snapshot.forEach((doc) => {
        userData.push({ docId: doc.id, ...doc.data() });
      });
      setUser(userData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getSubjects = async () => {
      if (user.length > 0) {
        setLoading(true);
        const ownerAdminId = user[0].ownerAdmin || user[0].ID;
        const querySnapshot = await getDocs(
          query(
            collection(db, "employees"),
            where("ownerAdmin", "==", ownerAdminId)
          )
        );
        const subjectsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsersData(subjectsList);
        setLoading(false);
      }
    };

    getSubjects();
  }, [user]);

  const filteredUsers = usersData.filter((user) => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase().replace(/\s+/g, ' ');
  
    if (!trimmedSearchTerm) return true;
  
    switch (searchType) {
      case "employeeName":
        return (
          user.employeeName &&
          user.employeeName.toLowerCase().includes(trimmedSearchTerm)
        );
      case "jobTitle":
        return (
          user.jobTitle &&
          user.jobTitle.toLowerCase().includes(trimmedSearchTerm)
        );
    
     
      default:
        return true;
    }
  });
  
  const handleSearch = () => {
    setSearchTerm(tempSearchTerm);
  };

  return (
    <div
      className="flex flex-col"
      style={{ paddingTop: "120px", paddingBottom: "440px" }}
    >
   

      <div className="search flex justify-center mt-9">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="ml-2 mr-2  p-2 rounded-md"
        >
                    <option value="" disabled>{t("search.searchEmp")}</option>
          <option value="employeeName">{t("userInfo.employeeName")}</option>
          <option value="jobTitle">{t("job.jobTitle")} :</option>

   
        </select>

        {/* حقل الإدخال للبحث */}
        <input
          type="text"
          placeholder={t("search.searchEmployees")}
          className="xs:w-72 sm:w-96 rounded-full"
          dir={direction}
          value={tempSearchTerm}
          onChange={(e) => setTempSearchTerm(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="ml-2 mr-2 px-4 py-2 rounded-full bg-[#CDA03D] text-white"
        >
          {t("matrix.searchButton")}
        </button>
        <button
          onClick={handleClearFilters}
          className="ml-2 px-4 py-2 rounded-full bg-[#CDA03D] text-white"
        >
          {t("matrix.clearFilters")}
        </button>
      </div>

      {/* User Cards section */}

      {loading ? (
  <div className="flex justify-center items-center mt-44">
    <Loader />
  </div>
) : (
  <div className="flex-grow">
    {!selectedEmp ? ( 
      filteredUsers.length > 0 ? (
        <UserTable users={filteredUsers} onEmpClick={handleEmpClick} />
      ) : (
        <p className="text-center text-gray-500 mt-44 ">
          {t("EmpCard.noEmp")}
        </p>
      )
    ) : (
      <UserInfo user={selectedEmp} onBack={() => setSelectedEmp(null)} />
    )}
  </div>
)}

    </div>
  );
}
