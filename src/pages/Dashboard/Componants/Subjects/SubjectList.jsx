/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import SubjectForm from "./subjectForm";
import { SubjctCard } from "./SubjectCard";

export default function SubjectList() {
  const [showMatrixForm, setShowMatrixForm] = useState(false);

  const handleClick = () => {
    setShowMatrixForm(!showMatrixForm);
  };
  return (
    <div className=" p-9">
      <div className="flex justify-between w-full">
        <IoMdAdd
          className="bg-[#f5bc42] text-white text-6xl p-5 rounded-full"
          onClick={handleClick}
        />
        <input
          type="text"
          name=""
          id=""
          className="text-right rounded-full  "
          placeholder="بحث عن مادة"
        />
      </div>

      {showMatrixForm ? <SubjectForm /> : <SubjctCard />}
    </div>
  );
}
