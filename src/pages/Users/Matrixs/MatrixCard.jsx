/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { collection, onSnapshot } from "firebase/firestore";
import { Button, Card } from "flowbite-react";
import { useEffect, useState } from "react";
import db from "../../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function MatrixCard(props) {
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();
  if (props.matrices.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-44">
        {t("matrixCardDashboard.noMatrix")}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap justify-center gap-9 p-9">
      {props.matrices.map((item) => (
        <Card
          key={item.id}
          className="max-w-sm text-center w-full h-80 transition-transform duration-300 transform hover:-translate-y-2 hover:scale-105"
        >
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {item.title}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {item.companyName}
            </span>
            {/* <p>- {item.description}</p> */}
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => {
                navigate("/MatrixInfo", { state: { item } });
              }}
              className="bg-[#64748B] w-32 mt-8"
            >
              {t("matrix.details")}
              <svg
                className="-mr-1 ml-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
