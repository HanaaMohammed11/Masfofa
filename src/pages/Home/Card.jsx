import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage"; 
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import db, { storage } from "../../config/firebase";
import "./Card.css";
import logo from "../../assets/logo-4 1.png"
export default function Cards({ setSelectedContent }) {
  const { t } = useTranslation("global");
  const [user, setUser] = useState("");
  const [bannerUrl, setBannerUrl] = useState(""); 

  useEffect(() => {
    const fetchUserAndBanner = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("ID", "==", localStorage.getItem("id"))
        );
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs.map((doc) => doc.data());
        
        if (userData.length > 0) {
          setUser(userData[0]);

          const bannerDocRef = doc(db, "banners", "homeElements");
          const bannerDoc = await getDoc(bannerDocRef);
          
          if (bannerDoc.exists()) {
            const bannerData = bannerDoc.data();
            if (bannerData.imageUrl) {
              const imageRef = ref(storage, bannerData.imageUrl);
              const url = await getDownloadURL(imageRef);
              setBannerUrl(url); 
            }
          } else {
            console.log("No banner document found");
          }
        } else {
          console.log("No matching user found");
        }
      } catch (error) {
        console.error("Error fetching user or banner data: ", error);
      }
    };

    fetchUserAndBanner();
  }, []);

  return (
    <div className="flex flex-col  min-h-screen  bg-white">
      <div className="flex flex-col  items-center sm:p-4 flex-wrap justify-center">
        <img src={logo} alt="" />
             {/* Sidebar Item 3 */}
             <div className="p-4 text-center relative bg-transparent w-64 card-container card-3">
          <button
            className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase"
            onClick={() => setSelectedContent("matrices")}
          >
            <h1 className="aux-text">{t("text.Matrices")}</h1>
          </button>
        </div>


        {/* Sidebar Item 2 */}
        <div className="p-4 text-center relative bg-transparent w-64 card-container card-2">
          <button
            className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase"
            onClick={() => setSelectedContent("articles")}
          >
            <h1 className="aux-text">{t("text.Articles")}</h1>
          </button>
        </div>

   
        {/* Sidebar Item 1 */}
        <div className="p-4 text-center relative bg-transparent  card-container card-1">
          <button
            className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase"
            onClick={() => setSelectedContent("employees")}
          >
            <h1 className="aux-text">{t("text.Employees")}</h1>
          </button>
        </div>
        {/* Admin-only Sidebar Item */}
        {(user.accountType === "admin" || user.accountType === "superAdmin") && (
          <div className="p-4 text-center relative bg-transparent w-64 card-container card-4">
            <button
              className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase"
              onClick={() => setSelectedContent("dashboard")}
            >
              <h1 className="aux-text">{t("text.DashBoard")}</h1>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
