/* eslint-disable no-unused-vars */
import { Button, Card } from "flowbite-react";
import { div } from "framer-motion/client";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "../../../../config/firebase";
import React, { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function SubjctCard() {
  const navigation = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const deleteSubject = async (subjectId, subjectTitle) => {
    // Log the subjectId and subjectTitle to ensure they are passed correctly
    console.log("Subject ID: ", subjectId);
    console.log("Subject Title: ", subjectTitle);

    if (!subjectTitle) {
      console.error("Error: subjectTitle is undefined or empty.");
      return;
    }

    const subjectRef = doc(db, "subjects", subjectId);

    try {
      await deleteDoc(subjectRef);
      console.log(
        "Subject document successfully deleted from 'subjects' collection!"
      );

      const matrixCollectionRef = collection(db, "matrix");
      const matrixQuery = query(
        matrixCollectionRef,
        where("subjects", "array-contains", subjectTitle)
      );
      const matrixSnapshot = await getDocs(matrixQuery);

      if (matrixSnapshot.empty) {
        console.log("No matrix documents found containing the subjectTitle.");
        return;
      }

      console.log(
        "Number of matrix documents found to update: ",
        matrixSnapshot.size
      );

      matrixSnapshot.forEach(async (matrixDoc) => {
        const matrixDocRef = doc(db, "matrix", matrixDoc.id);
        const currentSubjects = matrixDoc.data().subjects || [];

        console.log(
          `Matrix document ${matrixDoc.id} current subjects: `,
          currentSubjects
        );

        if (!currentSubjects.includes(subjectTitle)) {
          console.log(
            `Subject title "${subjectTitle}" not found in matrix document ${matrixDoc.id}`
          );
          return;
        }

        const updatedSubjects = currentSubjects.filter(
          (title) => title !== subjectTitle
        );

        console.log(
          `Matrix document ${matrixDoc.id} updated subjects: `,
          updatedSubjects
        );

        try {
          await updateDoc(matrixDocRef, { subjects: updatedSubjects });
          console.log(`Successfully updated matrix document ${matrixDoc.id}`);
        } catch (updateError) {
          console.error(
            `Error updating matrix document ${matrixDoc.id}: `,
            updateError
          );
        }
      });
    } catch (error) {
      console.error(
        "Error deleting subject or updating matrix documents: ",
        error
      );
    }
  };

  const Edit = (subjectItem) => {
    navigation("/editsubject", { state: { subject: subjectItem } });
  };
  useEffect(() => {
    const usersCollectionRef = collection(db, "subjects");

    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      const subjects = [];
      snapshot.forEach((doc) => {
        subjects.push({ id: doc.id, ...doc.data() });
      });
      setSubjects(subjects);
      // setFilteredMatrix(Matrixs);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="flex-col  pt-9 ">
      {subjects.length > 0 ? (
        subjects.map((subject, index) => (
          <Card key={index} className=" w-full  mb-9">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {subject.subjectTitle} ({subject.subjectField})
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {t("subjectCardDashboard.subjectNum")}: {subject.subjectNum}
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  Edit(subject);
                }}
                className="inline-flex items-center rounded-lg bg-slate-500 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              >
                {t("subjectCardDashboard.update")}
              </Button>

              <Button
                onClick={() => deleteSubject(subject.id, subject.subjectTitle)} 
                className="inline-flex items-center rounded-lg bg-red-700 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              >
                {t("subjectCardDashboard.delete")}
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
