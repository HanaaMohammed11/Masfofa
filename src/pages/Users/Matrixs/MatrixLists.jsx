import React, { useEffect, useState } from "react";
import { MatrixCard } from "./MatrixCard";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../../../config/firebase";
import { useTranslation } from "react-i18next";

export default function MatrixLists() {

  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState(""); 
  const [filteredMatrices, setFilteredMatrices] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [employees, setEmployees] = useState([]); 

  useEffect(() => {
    const usersCollectionRef = collection(db, "matrix");

    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      const matrix = [];
      snapshot.forEach((doc) => {
        matrix.push({ id: doc.id, ...doc.data() });
      });
      setMatrix(matrix);
      setFilteredMatrices(matrix);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const employeesCollectionRef = collection(db, "employees");

    const unsubscribe = onSnapshot(employeesCollectionRef, (snapshot) => {
      const employeeList = [];
      snapshot.forEach((doc) => {
        employeeList.push({ id: doc.id, ...doc.data() }); 
      });
      setEmployees(employeeList);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = () => {
    if (searchBy === "MainEmployees" && searchQuery) {
      const matchedEmployees = employees.filter((emp) =>
        emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchedEmployees.length > 0) {
        const results = matrix.filter((matrixItem) => {
          const mainEmployees = matrixItem.MainEmployees || [];
          return (
            Array.isArray(mainEmployees) &&
            matchedEmployees.some((emp) =>
              mainEmployees.includes(emp.employeeId)
            )
          );
        });

        setFilteredMatrices(results);
      } else {
        setFilteredMatrices([]);
      }
    } else if (searchBy === "jobTitle" && searchQuery) {
      const matchedEmployeesByJobTitle = employees.filter((emp) =>
        emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchedEmployeesByJobTitle.length > 0) {
        const results = matrix.filter((matrixItem) => {
          const mainEmployees = matrixItem.MainEmployees || []; 
          return (
            Array.isArray(mainEmployees) &&
            matchedEmployeesByJobTitle.some((emp) =>
              mainEmployees.includes(emp.employeeId)
            )
          );
        });

        setFilteredMatrices(results);
      } else {
        setFilteredMatrices([]);
      }
    } else if (searchBy && searchQuery) {
      const results = matrix.filter((matrixItem) => {
        const value = matrixItem[searchBy];

        if (Array.isArray(value)) {
          return value.some((item) =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else if (typeof value === "string") {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });

      setFilteredMatrices(results);
    }
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
    <div className="flex flex-col min-h-screen bg-gray-100">
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
          </option>
          <option value="title">{t("matrix.searchByMatrix")}</option>
          <option value="companyName">{t("matrix.searchByCompany")}</option>
          <option value="subjects">{t("matrix.searchBySubjects")}</option>
          <option value="MainEmployees">{t("matrix.searchByEmployee")}</option>
          <option value="jobTitle">{t("matrix.searchByJobTitle")}</option>
        </select>

        <input
          type="text"
          placeholder=    {t("matrix.searchButton")} 
          className="xs:w-72 sm:w-96 rounded-full ml-4"
          dir={direction}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={!searchBy} 
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 rounded-full bg-blue-500 text-white"
        >
          {t("matrix.searchButton")} 
        </button>
        <button
          onClick={handleClearFilters} 
          className="ml-2 px-4 py-2 rounded-full bg-red-500 text-white"
        >
          {t("matrix.clearFilters")} 
        </button>
      </div>

      <div className="mt-2 text-center">
        {searchBy && (
          <div className="inline-block bg-gray-200 p-2 rounded-md">
            <strong>{t("matrix.searchByLabel")}</strong> {searchBy}
          </div>
        )}
      </div>

      <div className="flex-grow">
        <MatrixCard matrices={filteredMatrices} />
      </div>

      <div className="mt-auto">
        <Bottombanner />
      </div>
    </div>
  );
}
