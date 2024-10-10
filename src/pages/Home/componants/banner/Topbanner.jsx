import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import db, { auth } from "../../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Planet from "../planet/Planet";
import { collection, getDocs, query, where } from "firebase/firestore";

import { TranslateContext } from "../../../../TranslateContext/TransContext";
import { useTranslation } from "react-i18next";
import logoutbtn from "../../../../assets/logout.png";
import { TbLogout2 } from "react-icons/tb";
import saudiArabia from "../../../../assets/Flag_of_Saudi_Arabia.png";
import USA from "../../../../assets/Flag_of_the_United_States.png";
import NavBar from "../../../../Nav/NavBar";
import { Navbar, Button } from "flowbite-react";

export default function Topbanner() {
  const navigate = useNavigate();
  const [topBannerUrl, setTopBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const { handleChangeLanguage } = useContext(TranslateContext);
  const [user, setUser] = useState("");

  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("lang") || "ar"
  );
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
  console.log(user);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const topBannerDoc = await getDoc(doc(db, "banners", "topBanner"));
        const logoDoc = await getDoc(doc(db, "banners", "logo"));

        if (topBannerDoc.exists()) {
          setTopBannerUrl(topBannerDoc.data().imageUrl);
        }

        if (logoDoc.exists()) {
          setLogoUrl(logoDoc.data().imageUrl);
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الصور:", error);
      }
    };

    fetchImages();
  }, []);

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    handleChangeLanguage(lang);
    localStorage.setItem("lang", lang);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("id");
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full ">
      <Navbar
        fluid={true}
        rounded={true}
        className="bg-gray-500 text-white mb-1"
      >
        <Navbar.Toggle />
        <div className="flex">
          {/* Logout Button */}
          <div
            className="ml-8 font-semibold text-xl flex items-center justify-center text-white  cursor-pointer hover:bg-gray-600 p-2 rounded-md"
            onClick={handleLogout}
            style={{
              marginRight: 30,
              marginBottom: "10px",
            }}
          >
            <TbLogout2 size={30} />
          </div>

          {/* Language Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="p-2 rounded-md bg-slate-400 border-yellow-400 border-2 text-white flex items-center hover:bg-slate-500"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <img
                src={selectedLanguage === "en" ? USA : saudiArabia}
                alt={selectedLanguage === "en" ? "English" : "Arabic"}
                className="w-6 h-6 mr-2"
              />
            </button>
            {isOpen && (
              <div className="absolute bg-white shadow-lg rounded-md mt-2 w-full z-10">
                <div
                  onClick={() => handleLanguageSelect("en")}
                  className="p-2 flex items-center cursor-pointer hover:bg-gray-100"
                >
                  <img src={USA} alt="USA Flag" className="w-6 h-6 mr-2" />
                </div>
                <div
                  onClick={() => handleLanguageSelect("ar")}
                  className="p-2 flex items-center cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={saudiArabia}
                    alt="Saudi Arabia Flag"
                    className="w-6 h-6 mr-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navbar Items */}
        <Navbar.Collapse>
          {user.accountType === "admin" && (
            <div
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer text-xl p-2 bg-black border-yellow-400 border-2 hover:bg-gray-600 rounded-md transition-all duration-300"
            >
              {t("text.DashBoard")}
            </div>
          )}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer text-xl p-2 bg-black border-yellow-400 border-2 hover:bg-gray-600 rounded-md transition-all duration-300"
          >
            {t("text.home")}
          </div>
          <div
            onClick={() => navigate("/Matrix")}
            className="cursor-pointer text-xl p-2 bg-black border-yellow-400 border-2 hover:bg-gray-600 rounded-md transition-all duration-300"
          >
            {t("text.Matrices")}
          </div>
          <div
            onClick={() => navigate("/sujects")}
            className="cursor-pointer text-xl p-2 bg-black border-yellow-400 border-2 hover:bg-gray-600 rounded-md transition-all duration-300"
          >
            {t("text.Articles")}
          </div>
          <div
            onClick={() => navigate("/users")}
            className="cursor-pointer text-xl p-2 bg-black border-yellow-400 border-2 hover:bg-gray-600 rounded-md transition-all duration-300"
          >
            {t("text.Employees")}
          </div>
        </Navbar.Collapse>
      </Navbar>

      {/* Banner section */}
      <div
        className="Topbaner w-full h-56 bg-cover bg-center flex justify-end items-center"
        style={{ backgroundImage: `url(${topBannerUrl})` }}
      >
        {/* Logo */}
        <div className="w-60 pr-5 pt-9 mb-12 logo">
          <Link to="/" className="ml-4">
            <img src={logoUrl} alt="Logo" />
          </Link>
        </div>
      </div>
    </div>
  );
}
