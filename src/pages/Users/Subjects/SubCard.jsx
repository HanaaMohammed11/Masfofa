import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Button, Card, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import db from "../../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { use } from "i18next";
import Loader from "../../Login/loader";

export function SubCard({ searchTerm }) {
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [matrixItems, setMatrixItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const qUser = query(
      collection(db, "users"),
      where("ID", "==", localStorage.getItem("id"))
    );
    const unsubscribe = onSnapshot(qUser, (snapshot) => {
      const userData = [];
      snapshot.forEach((doc) => {
        userData.push({ docId: doc.id, ...doc.data() });
      });
      setUser(userData);
    });

    return () => unsubscribe();
  }, []); // Keep this as is
  console.log(user[0]);
  useEffect(() => {
    const getSubjects = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(
        query(
          collection(db, "subjects"),
          where("ownerAdmin", "==", user[0]?.ownerAdmin)
        )
      );
      const subjectsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMatrixItems(subjectsList);
      setLoading(false);
    };

    getSubjects();
  }, [user]);

  const handleButtonClick = (subject) => {
    navigate("/subjectInfo", { state: { subject } });
  };

  const filteredSubjects = matrixItems.filter((item) =>
    item.subjectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center m-44">
        <Loader  />
      </div>
    );
  }

  if (filteredSubjects.length === 0) {
    return (
      <div
        className={`flex justify-center  mt-44 items-center h-full ${direction}`}
      >
        <p className="text-xl text-gray-500">{t("articels.noResults")}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap justify-center gap-9 p-9 ${direction}`}>
      {filteredSubjects.map((item) => (
        <Card
          key={item.id}
          className="max-w-sm text-center w-full h-80 transition-transform duration-300 transform hover:-translate-y-2 hover:scale-105"
        >
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {item.subjectTitle}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {item.relatedMatrix.companyName}
            </span>
            <span> - {item.subjectNum}</span>
          </p>
          <div className="flex justify-center">
            <Button
              className="bg-[#64748B] w-32 mt-8"
              onClick={() => handleButtonClick(item)}
            >
              {t("articels.details")}
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
