/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Card } from "flowbite-react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import db from "../../../../config/firebase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function SubjctCard({ searchTerm }) {
  const navigation = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const { t, i18n } = useTranslation("global");

  const deleteSubject = async (subjectId, subjectTitle) => {
    const subjectRef = doc(db, "subjects", subjectId);
    try {
      await deleteDoc(subjectRef);
    } catch (error) {
      console.error("Error deleting subject: ", error);
    }
  };

  const handleButtonClick = (subjectItem) => {
    navigation("/AdminSubjectInfo", { state: { subjectItem } });
  };

  const Edit = (subjectItem) => {
    navigation("/editsubject", { state: { subject: subjectItem } });
  };

  useEffect(() => {
    // const usersCollectionRef = collection(db, "subjects");
    const q = query(
      collection(db, "subjects"),
      where("ownerAdmin", "==", localStorage.getItem("id"))
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subjects = [];
      snapshot.forEach((doc) => {
        subjects.push({ id: doc.id, ...doc.data() });
      });
      setSubjects(subjects);
    });

    return () => unsubscribe();
  }, []);

  // Filter subjects based on the search term
  const filteredSubjects = subjects.filter((subject) =>
    subject.subjectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-col pt-9 text-center">
      {filteredSubjects.length > 0 ? (
        filteredSubjects.map((subject, index) => (
          <Card key={index} className="w-full mb-9">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {subject.subjectTitle} ({subject.subjectField})
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {t("subjectCardDashboard.subjectNum")}: {subject.subjectNum}
            </p>
            <div className="flex space-x-3">
  <Button
    onClick={() => Edit(subject)}
    className=" ml-4"
  >
    {t("subjectCardDashboard.update")}
  </Button>
  <Button
    onClick={() => deleteSubject(subject.id, subject.subjectTitle)}
    className="bg-red-700 "
  >
    {t("subjectCardDashboard.delete")}
  </Button>
  <Button
    className="bg-[#64748B]"
    onClick={() => handleButtonClick(subject)} 
  >
    {t("articels.details")}
  </Button>
</div>

          </Card>
        ))
      ) : (
        <div className="p-4 text-center text-neutral-600 dark:text-neutral-400">
          {t("subjectCardDashboard.nosubjects")}
        </div>
      )}
    </div>
  );
}
