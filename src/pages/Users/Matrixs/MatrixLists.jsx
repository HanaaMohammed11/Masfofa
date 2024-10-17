/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import MatrixTable from "./MatrixCard";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import db from "../../../config/firebase";
import { useTranslation } from "react-i18next";
import Loader from "../../Login/loader";

export default function MatrixLists() {
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [filteredMatrices, setFilteredMatrices] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [user, setUser] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setMatrix(matrix);
      setFilteredMatrices(matrix);
      setLoading(false); // Set loading to false when data is fetched
    });

    return () => unsubscribe();
  }, []); // Keep this as is

  useEffect(() => {
    if (user.length > 0) {
      let qmatrix;
      if (user.ownerAdmin) {
        qmatrix = query(
          collection(db, "matrix"),
          where("ownerAdmin", "==", user[0]?.ownerAdmin)
        );
      } else {
        qmatrix = query(
          collection(db, "matrix"),
          where("ownerAdmin", "==", user[0]?.ID)
        );
      }
      const unsubscribe = onSnapshot(qmatrix, (snapshot) => {
        const matrixData = [];
        snapshot.forEach((doc) => {
          matrixData.push({ id: doc.id, ...doc.data() });
        });
        setMatrix(matrixData);
        setFilteredMatrices(matrixData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const searchSubjectContent = async (searchQuery) => {
    try {
      // Fetch all subjects
      const subjectQuery = query(collection(db, "subjects"));
      const subjectSnapshot = await getDocs(subjectQuery);

      const subjectTitles = [];
      const lowerCaseSearchQuery = searchQuery.toLowerCase();

      subjectSnapshot.forEach((doc) => {
        const subjectData = doc.data();
        // Compare subjectContent in a case-insensitive manner
        if (
          subjectData.subjectContent
            .toLowerCase()
            .includes(lowerCaseSearchQuery)
        ) {
          subjectTitles.push(subjectData.subjectTitle);
        }
      });

      console.log("Subjects fetched:", subjectTitles); // Log the fetched subjects
      return subjectTitles;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return [];
    }
  };

  useEffect(() => {
    if (user.length > 0) {
      let qEmps;
      if (user.ownerAdmin) {
        qEmps = query(
          collection(db, "employees"),
          where("ownerAdmin", "==", user[0]?.ownerAdmin)
        );
      } else {
        qEmps = query(
          collection(db, "employees"),
          where("ownerAdmin", "==", user[0]?.ID)
        );
      }
      const unsubscribe = onSnapshot(qEmps, (snapshot) => {
        const employeeList = [];
        snapshot.forEach((doc) => {
          employeeList.push({ id: doc.id, ...doc.data() });
        });
        setEmployees(employeeList);
      });
      const employeesCollectionRef = collection(db, "employees");

      // const unsubscribe = onSnapshot(employeesCollectionRef, (snapshot) => {
      //   const employeeList = [];
      //   snapshot.forEach((doc) => {
      //     employeeList.push({ id: doc.id, ...doc.data() });
      //   });
      //   setEmployees(employeeList);
      // });

      return () => unsubscribe();
    }
  }, [user]);

  const handleSearch = async () => {
    let results = []; 
  
    if (tempSearchQuery) {
      if (searchBy === "MainEmployees") {
        const matchedEmployees = employees.filter((emp) =>
          emp.employeeName.toLowerCase().includes(tempSearchQuery.toLowerCase())
        );
  
        if (matchedEmployees.length > 0) {
          results = matrix.filter((matrixItem) => {
            const mainEmployees = matrixItem.MainEmployees || [];
            return (
              Array.isArray(mainEmployees) &&
              matchedEmployees.some((emp) =>
                mainEmployees.includes(emp.employeeId)
              )
            );
          });
        }
      } else if (searchBy === "jobTitle") {
        const matchedEmployeesByJobTitle = employees.filter((emp) =>
          emp.jobTitle.toLowerCase().includes(tempSearchQuery.toLowerCase())
        );
  
        if (matchedEmployeesByJobTitle.length > 0) {
          results = matrix.filter((matrixItem) => {
            const mainEmployees = matrixItem.MainEmployees || [];
            return (
              Array.isArray(mainEmployees) &&
              matchedEmployeesByJobTitle.some((emp) =>
                mainEmployees.includes(emp.employeeId)
              )
            );
          });
        }
      } else if (searchBy === "subjectContent") {
        try {
          const subjectTitles = await searchSubjectContent(tempSearchQuery);
  
          if (subjectTitles.length > 0) {
            results = matrix.filter((matrixItem) => {
              const matrixSubjects = matrixItem.subjects || [];
              return matrixSubjects.some((subjectTitle) =>
                subjectTitles.includes(subjectTitle)
              );
            });
          }
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      } else if (searchBy) {
        results = matrix.filter((matrixItem) => {
          const value = matrixItem[searchBy];
  
          if (Array.isArray(value)) {
            return value.some((item) =>
              item.toLowerCase().includes(tempSearchQuery.toLowerCase())
            );
          } else if (typeof value === "string") {
            return value.toLowerCase().includes(tempSearchQuery.toLowerCase());
          }
          return false;
        });
      }
    }
  
    setFilteredMatrices(results); 
    console.log(results);
  };
  


  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchBy("");
    setFilteredMatrices(matrix);
  };

  return (
    <div
      className="flex flex-col  "
      style={{ paddingTop: "270px", paddingBottom: "44px" }}
    >
      <div className="relative flex justify-center items-center text-center">
        <Topbanner />
      </div>

      {/* Input search section */}
      <div className="search flex xs:flex-col md:flex-row xs:items-center xs:gap-y-4 md:gap-y-0 justify-center mt-9">
        {/* Select what to search by */}
        <select
          value={searchBy}
          onChange={handleSearchByChange}
          className="w-40 p-2 rounded-md text-gray-700"
        >
          <option value="" disabled>
            {t("matrix.selectSearchCriterion")}
            {t("matrix.selectSearchCriterion")}
          </option>
          <option value="title">{t("matrix.searchByMatrix")}</option>
          <option value="companyName">{t("matrix.searchByCompany")}</option>
          <option value="subjects">{t("matrix.searchBySubjects")}</option>
          <option value="MainEmployees">{t("matrix.searchByEmployee")}</option>
          <option value="jobTitle">{t("matrix.searchByJobTitle")}</option>
          <option value="subjectContent">
            {t("matrix.searchBySubjectContent")}
          </option>
        </select>

        <input
          type="text"
          placeholder={t("matrix.searchButton")}
          className="xs:w-72 sm:w-96 rounded-full ml-4"
          dir={direction}
          value={tempSearchQuery}
          onChange={(e) => setTempSearchQuery(e.target.value)}
          disabled={!searchBy}
        />
        <button
          onClick={() => {
            setSearchQuery(tempSearchQuery);
            handleSearch();
          }}
          className="ml-2 px-4 py-2 rounded-full bg-[#CDA03D] text-white"
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
    

      {loading ? (
        <div className="flex justify-center items-center m-44">
          <Loader />
        </div>
      ) : (
        <div className="flex-grow">
          {user.accountType === "employee" ? (
            searchQuery && filteredMatrices.length > 0 ? (
              // عرض نتائج البحث فقط إذا كانت هناك نتائج
              <MatrixTable matrices={filteredMatrices} />
            ) : searchQuery ? (
              // عرض رسالة إذا لم يتم العثور على نتائج
              <div className="flex justify-center items-center m-44">
                <p>{t("matrixCardDashboard.noMatrix")}</p>
              </div>
            ) : (
              // عرض رسالة إذا لم يتم إدخال أي استعلام بحث
              <div className="flex justify-center items-center m-44">
                <p>{t("matrixCardDashboard.noMatrix")}</p>
              </div>
            )
          ) : (
            // عرض جميع الجداول للمستخدمين غير الموظفين
            <MatrixTable matrices={filteredMatrices} />
          )}
        </div>
      )}

      <div className="mt-auto">
        <Bottombanner />
      </div>
    </div>
  );
}
