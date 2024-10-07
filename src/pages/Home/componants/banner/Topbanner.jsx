import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import db, { auth } from "../../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Planet from "../planet/Planet";
import { TranslateContext } from "../../../../TranslateContext/TransContext";
import { useTranslation } from "react-i18next";
import logoutbtn from "../../../../assets/logout.png";
import { TbLogout2 } from "react-icons/tb";
import saudiArabia from "../../../../assets/Flag_of_Saudi_Arabia.png";
import USA from "../../../../assets/Flag_of_the_United_States.png";

export default function Topbanner() {
  const [topBannerUrl, setTopBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const { handleChangeLanguage } = useContext(TranslateContext);
  const { t } = useTranslation("global");

  const [isOpen, setIsOpen] = useState(false); // state for dropdown visibility
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("lang") || "ar"
  );

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

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      localStorage.removeItem("id");
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  // Close dropdown if clicked outside
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
    <div
      className="Topbaner w-full h-48 bg-cover bg-center"
      style={{ backgroundImage: `url(${topBannerUrl})` }}
    >
      <div className="flex justify-between  w-full items-center">
        <div
          className="ml-8 font-semibold text-xl flex items-center justify-center text-white text-center"
          onClick={handleLogout}
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            marginTop: 20,
            cursor: "pointer",
            backgroundImage: `url(${logoutbtn})`,
            marginRight: 30,
            width: "90px",
            height: "90px",
            marginBottom: "10px",
          }}
        >
          <TbLogout2 size={30} />
        </div>

        <div className="w-80 pr-9 pt-9 logo flex items-center">
          {/* Custom Language Dropdown */}
          <div className="relative w-36" ref={dropdownRef}>
            <button
              className="p-2 rounded-md bg-slate-400 text-white flex items-center"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <img
                src={selectedLanguage === "en" ? USA : saudiArabia}
                alt={selectedLanguage === "en" ? "English" : "Arabic"}
                className="w-6 h-6 mr-2"
              />
              {/* {selectedLanguage === "en" ? "English" : "Arabic"} */}
            </button>
            {isOpen && (
              <div className="absolute bg-white shadow-lg rounded-md mt-2 w-full z-10">
                <div
                  onClick={() => handleLanguageSelect("en")}
                  className="p-2 flex items-center cursor-pointer hover:bg-gray-100"
                >
                  <img src={USA} alt="USA Flag" className="w-6 h-6 mr-2" />
                  {/* English */}
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
                  {/* Arabic */}
                </div>
              </div>
            )}
          </div>

          <Link to="/" className="ml-4">
            <img src={logoUrl} alt="Logo" />
          </Link>
        </div>
      </div>
    </div>
  );
}
