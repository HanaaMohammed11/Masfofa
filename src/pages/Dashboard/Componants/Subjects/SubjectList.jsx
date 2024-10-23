/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import SubjectForm from "./subjectForm";
import SubjctCard from "./SubjectCard";
import { useTranslation } from "react-i18next";
import "../../../Dashboard/btns.css";
import MatrixInfo from "../../../Users/Matrixs/MatrixInfo";
import UserInfo from "../../../Users/Employee/UserInfo";
import SubjectInfo from "../../../Users/Subjects/SubjectInfo";
import AdminUserInfo from "../users/userInfo";

export default function SubjectList() {
  const [showSubForm, setShowSubForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMatrix, setSelectedMatrix] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const handleSubjectClick = (subject) => {
    setSelectedMatrix(null);
    setSelectedEmp(null);
    setSelectedSubject(subject);
  };
  const handleMatrixClick = (matrix) => {
    setSelectedEmp(null);
    setSelectedSubject(null);
    setSelectedMatrix(matrix);
  };
  const handleEmpClick = (emp) => {
    setSelectedSubject(null);
    setSelectedMatrix(null);
    setSelectedEmp(emp);
  };

  const handleClick = () => {
    setShowSubForm(!showSubForm);
  };
  const handleFormClose = () => {
    setShowSubForm(false);
  };
  return (
    <div className="">
      <div className="">
        {/* Header Section */}

        <div
          className={`flex flex-col justify-center  w-full  items-center gap-4 md:gap-9 z-10 sticky lg:fixed md:fixed sm:sticky xs:sticky `}
        >
          <div
            className="btn-button text-center btn-curve btn-gold flex items-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300"
            onClick={handleClick}
          >
            <span className="whitespace-nowrap flex items-center space-x-2 btn-text">
              <span className="whitespace-nowrap flex items-center space-x-2 btn-text">
                {t("subjectEditForm.addSubject")}
              </span>
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
        {/* Content Section */}
        <div className="flex flex-wrap justify-center mb-96">
          {showSubForm ? (
            <SubjectForm onClose={handleFormClose} />
          ) : !selectedSubject && !selectedMatrix && !selectedEmp ? (
            <SubjctCard
              onSubjectClick={handleSubjectClick}
              onEmpClick={handleEmpClick}
              searchTerm={searchTerm}
            />
          ) : !selectedSubject && !selectedEmp && selectedMatrix ? (
            <div className="mt-32 flex justify-center items-center w-full"> 
            <MatrixInfo
              matrix={selectedMatrix}
              onEmpClick={handleEmpClick}
              onSubjectClick={handleSubjectClick}
              onBack={() => setSelectedMatrix(null)}
            />
               </div>
          ) : !selectedSubject && selectedEmp && !selectedMatrix ? (
            <AdminUserInfo
              user={selectedEmp}
              onBack={() => setSelectedEmp(null)}
              onSubjectClick={handleSubjectClick}
              onEmpClick={handleEmpClick}
            />
          ) : (
            <div className="mt-32 flex justify-center items-center w-full"> 

            <SubjectInfo
              subject={selectedSubject}
              onEmpClick={handleEmpClick}
              onMatrixClick={handleMatrixClick}
              onBack={() => setSelectedSubject(null)}
            />
              </div>
          )}
     
        </div>
      </div>
    </div>
  );
}
