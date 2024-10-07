/* eslint-disable no-unused-vars */
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import db from "../../config/firebase";
import emp from "../../../src/assets/emp.jpeg";
import Planet from "../../../src/assets/planet.png";
import articals from "../../../src/assets/articals.jpeg";
import matriex from "../../../src/assets/matriex.jpeg";
import dash from "../../assets/dash.jpeg";
export default function Cards() {
  const { t } = useTranslation("global");
  const [user, setUser] = useState("");
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
    <div className="flex justify-center items-center mb-16 mt-5">
      <div className="flex gap-8 items-center sm:p-4 flex-wrap justify-center">
        {/* Card 1 */}
        <Card
          href="/users"
          className="p-9 w-80 text-center h-52 relative transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          style={{
            border: "9px solid rgba(128, 128, 128, 0.9)",
          }}
        >
          {/* Spinning Image */}
          <img
            src={Planet}
            alt="Spinning Planet"
            className="absolute inset-0 w-full h-full object-contain opacity-50"
            style={{ animation: "spin 10s linear infinite" }}
          />
          {/* Content */}
          <h1
            className="text-4xl font-bold tracking-tight text-black dark:text-white relative z-10"
            style={{ fontFamily: "cursive" }}
          >
            {t("text.Employees")}
          </h1>
        </Card>

        {/* Card 2 */}
        <Card
          href="/sujects"
          className="p-9 w-80 text-center h-52 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        >
          <img
            src={Planet}
            alt="Spinning Planet"
            className="absolute inset-0 w-full h-full object-contain opacity-50"
            style={{ animation: "spin 10s linear infinite" }}
          />
          {/* Content */}
          <h1
            className="text-4xl font-bold tracking-tight text-black dark:text-white relative z-10"
            style={{ fontFamily: "cursive" }}
          >
            {t("text.Articles")}
          </h1>
        </Card>

        {/* Card 3 */}
        <Card
          href="/Matrix"
          className="p-9 w-80 text-center h-52 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        >
          <img
            src={Planet}
            alt="Spinning Planet"
            className="absolute inset-0 w-full h-full object-contain opacity-50"
            style={{ animation: "spin 10s linear infinite" }}
          />
          {/* Content */}
          <h1
            className="text-4xl font-bold tracking-tight text-black dark:text-white relative z-10"
            style={{ fontFamily: "cursive" }}
          >
            {t("text.Matrices")}
          </h1>
        </Card>

        {/* Card 4 */}
        {user.accountType === "admin" && (
          <Card
            href="/dashboard"
            className="p-9 w-80 text-center h-52 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            <img
              src={Planet}
              alt="Spinning Planet"
              className="absolute inset-0 w-full h-full object-contain opacity-50"
              style={{ animation: "spin 10s linear infinite" }}
            />
            {/* Content */}
            <h1
              className="text-4xl font-bold tracking-tight text-black dark:text-white relative z-10"
              style={{ fontFamily: "cursive" }}
            >
              {t("text.DashBoard")}
            </h1>
          </Card>
        )}
      </div>
    </div>
  );
}

/////// old Card if we needed
{
  /* <Card
            href="/dashboard"
            className="p-9 w-80 text-center h-52 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              border: "9px solid rgba(128, 128, 128, 0.9)",
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${dash})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <h1
              className="text-4xl font-bold tracking-tight text-white dark:text-white"
              style={{ fontFamily: "cursive" }}
            >
              {t("text.DashBoard")}
            </h1>
          </Card> */
}
