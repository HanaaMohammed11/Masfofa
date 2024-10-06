import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import db, { auth } from "../../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Planet from "../planet/Planet";
import { TranslateContext } from "../../../../TranslateContext/TransContext";
import { useTranslation } from "react-i18next";

export default function Topbanner() {
  const [topBannerUrl, setTopBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const { handleChangeLanguage } = useContext(TranslateContext);
  const { t } = useTranslation("global");

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
            backgroundImage: "url(./src/assets/logout.png)",
            marginRight: 30,
            width: "90px",
            height: "90px",
            marginBottom: "10px",
          }}
        >
          {t("logout.Logout")}
        </div>

        <div className="w-80 pr-9 pt-9 logo flex">
          {/* Language Switcher Dropdown */}
          <div className="pt-4">
            <select
              onChange={(e) => handleChangeLanguage(e.target.value)}
              className="p-2 rounded-md bg-slate-400"
              defaultValue={localStorage.getItem("lang") || "ar"}
            >
              <option value="en">English</option>
              <option value="ar">اللغة العربية</option>
            </select>
          </div>
          <Link to="/">
            <img src={logoUrl} alt="Logo" />
          </Link>
        </div>
      </div>
      {/* <Planet /> */}
    </div>
  );
}
