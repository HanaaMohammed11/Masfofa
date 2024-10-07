/* eslint-disable no-unused-vars */
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // استيراد useNavigate
import db from "../../config/firebase";
import Planet from "../../../src/assets/plant-removebg-preview.png";
import "./Card.css";

export default function Cards() {
  const { t } = useTranslation("global");
  const [user, setUser] = useState("");
  const navigate = useNavigate(); // تهيئة useNavigate

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("ID", "==", localStorage.getItem("id"))
        );
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs.map((doc) => doc.data());
        if (userData.length > 0) {
          setUser(userData[0]);
        } else {
          console.log("No matching user found");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-96 mt-44 mb-44">
  <div className="flex gap-4 items-center sm:p-4 flex-wrap justify-center"> 
    {/* Card 1 */}
    <div className="p-4 text-center relative bg-transparent w-80"> 
      <img
        src={Planet}
        alt="Spinning Planet"
        className="inset-0 w-full h-full object-contain"
        style={{ animation: "spin 10s linear infinite" }}
      />
      <button
        className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase"
        onClick={() => navigate("/users")}
      >
        <h1 className="aux-text" >
          {t("text.Employees")}
        </h1>
      </button>
    </div>

    {/* Card 2 */}
    <div className="p-4 text-center relative bg-transparent w-80"> 
      <img
        src={Planet}
        alt="Spinning Planet"
        className="inset-0 w-full h-full object-contain"
        style={{ animation: "spin 10s linear infinite" }}
      />
      <button
        className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase"
        onClick={() => navigate("/sujects")}
      >
        <h1 className="aux-text" >
          {t("text.Articles")}
        </h1>
      </button>
    </div>

    {/* Card 3 */}
    <div className="p-4 text-center relative bg-transparent w-80"> {/* تقليل العرض */}
      <img
        src={Planet}
        alt="Spinning Planet"
        className="inset-0 w-full h-full object-contain"
        style={{ animation: "spin 10s linear infinite" }}
      />
      <button
        className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase"
        onClick={() => navigate("/Matrix")}
      >
        <h1 className="aux-text" >
          {t("text.Matrices")}
        </h1>
      </button>
    </div>

    {/* Card 4 */}
    {user.accountType === "admin" && (
      <div className="p-4 text-center relative bg-transparent w-80"> 
        <img
          src={Planet}
          alt="Spinning Planet"
          className="inset-0 w-full h-full object-contain"
          style={{ animation: "spin 10s linear infinite" }}
        />
        <button
          className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase"
          onClick={() => navigate("/dashboard")}
        >
          <h1 className="aux-text" >
            {t("text.DashBoard")}
          </h1>
        </button>
      </div>
    )}
  </div>
</div>

  );
}
