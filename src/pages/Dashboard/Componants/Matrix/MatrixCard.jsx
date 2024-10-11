/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "./use-outside-click";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import Loader from "../../../Login/loader";

export default function MatrixCard({ searchQuery, handleShowInfo }) {
  const [active, setActive] = useState(null);
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const ref = useRef(null);
  const id = useId();
  const navigation = useNavigate();

  const deleteMatrix = async (matrixId) => {
    const matrixRef = doc(db, "matrix", matrixId);
    try {
      await deleteDoc(matrixRef);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const show = (matrixItem) => {
    // navigation("/AdminMtrixInfo", { state: { matrix: matrixItem } });
    handleShowInfo(matrixItem);
  };

  const Edit = (matrixItem) => {
    navigation("/MatrixEditForm", { state: { matrix: matrixItem } });
  };

  useEffect(() => {
    const q = query(
      collection(db, "matrix"),
      where("ownerAdmin", "==", localStorage.getItem("id"))
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const Matrixs = [];
      snapshot.forEach((doc) => {
        Matrixs.push({ id: doc.id, ...doc.data() });
      });
      setMatrix(Matrixs);
      setLoading(false); // Set loading to false once data is fetched
    });
    return () => unsubscribe();
  }, []); // Fixed the dependency array here.

  useOutsideClick(ref, () => setActive(null));

  const filteredMatrix = matrix.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen">
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] ">
            <motion.button
              className="absolute top-2 right-2"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              ref={ref}
              className="w-full max-w-[500px] bg-white p-4 rounded-lg shadow-md"
            >
              <div className="p-4 text-center ">
                <h3 className="text-lg font-bold p-9">{active.title}</h3>
                <p className="text-gray-600">{active.description}</p>
                <button
                  onClick={() => Edit(active)}
                  className="mt-2 ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  {t("matrixCardDashboard.update")}
                </button>
                <button
                  onClick={() => deleteMatrix(active.id)}
                  className="mt-2 ml-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  {t("matrixCardDashboard.delete")}
                </button>
                <button
                  onClick={() => show(active)}
                  className="mt-2 ml-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  {t("matrix.details")}
                </button>
                <div className="mt-2">
                  {typeof active.content === "function"
                    ? active.content()
                    : active.content}
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="flex justify-center items-center ">
        {loading ? (
          <div className=" flex justify-center items-center m-44">
            <Loader />
          </div>
        ) : filteredMatrix.length > 0 ? (
          filteredMatrix.map((card) => (
            <motion.div
              key={`card-${card.title}-${id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden "
              onClick={() => setActive(card)}
            >
              <div className="w-60 h-44 text-center p-12">
                <h3 className="text-lg font-bold">{card.title}</h3>
                <p className="text-gray-600">{card.companyName}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center">{t("matrixCardDashboard.noMatrix")}</div>
        )}
      </div>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};
