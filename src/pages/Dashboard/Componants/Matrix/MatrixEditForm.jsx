/* eslint-disable no-unused-vars */
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import save from "../../../../../src/assets/save.png"
import Topbanner from "../../../Home/componants/banner/Topbanner";
import Bottombanner from "../../../Home/componants/banner/Bottombanner";
import "../../../Home/Card.css";
import { IoArrowBack } from "react-icons/io5";
export default function MatrixEditForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const matrix = location.state?.matrix;
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [matrixData, setMatrixData] = useState({
    title: matrix.title || "",
    companyName: matrix.companyName || "",
    updateDate: matrix.updateDate || "",
    releaseDate: matrix.releaseDate || "",
    intro: matrix.intro || "",
    notes: matrix.notes || "",
    definitions: matrix.definitions || [{ term: "", interpretation: "" }],
  });
  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setMatrixData({ ...matrixData, [id]: value });
  };

  const handleDefinitionChange = (index, field, value) => {
    const updatedDefinitions = matrixData.definitions.map((def, i) =>
      i === index ? { ...def, [field]: value } : def
    );
    setMatrixData({ ...matrixData, definitions: updatedDefinitions });
  };

  const handleAddDefinition = () => {
    setMatrixData({
      ...matrixData,
      definitions: [
        ...matrixData.definitions,
        { term: "", interpretation: "" },
      ],
    });
  };

  const handleSave = async () => {
    const matrixRef = doc(db, "matrix", matrix.id);

    try {
      await updateDoc(matrixRef, matrixData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating matrix:", error);
    }
  };

  return (
    <div>
      <Topbanner/>
    <div
      className="   "
      dir={direction}
      
    >
        <button className="text-center bg-[#CDA03D] py-2 px-9 shadow-xl m-9 rounded-full text-white flex  text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300" onClick={handleBack} dir={direction} style={{marginTop:"400px"}}>
        <IoArrowBack className="mt-1 mr-3" />  {t("text.back")}
            </button>
      <div className="mx-auto p-8 w-full max-w-5xl" style={{paddingBottom:"400px"}} >
        <h1 dir={direction} className=" text-3xl font-semibold text-gray-800 bg-[#CDA03D] p-5 rounded-t-xl">
          {t("matrixEditForm.updateMatrix")}
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-6" dir={direction}>
            <div className="xs:col-span-2 md:col-span-1">
              <Label htmlFor="issuer" value={t("matrixEditForm.companyName")} />
              <TextInput
                id="companyName"
                type="text"
                value={matrixData.companyName}
                onChange={handleInputChange}
              />
            </div>
            <div className="xs:col-span-2 md:col-span-1">
              <Label htmlFor="title" value={t("matrixEditForm.matrixName")} />
              <TextInput
                id="title"
                type="text"
                value={matrixData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="xs:col-span-2 md:col-span-1">
              <Label
                htmlFor="modificationDate"
                value={t("matrixEditForm.updateDate")}
              />
              <TextInput
                id="updateDate"
                type="date"
                value={matrixData.updateDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="xs:col-span-2 md:col-span-1">
              <Label
                htmlFor="releaseDate"
                value={t("matrixEditForm.releaseDate")}
              />
              <TextInput
                id="releaseDate"
                type="date"
                value={matrixData.releaseDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2">
              <Label
                htmlFor="introduction"
                value={t("matrixEditForm.Introduction")}
              />
              <                Textarea

                id="intro"
                rows={4}
                type="text"
                value={matrixData.intro}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="notes" value={t("matrixEditForm.notes")} />
              <                Textarea
                id="notes"
                rows={4}
                type="text"
                value={matrixData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Definitions Section */}
          <h2 dir={direction} className=" text-2xl md:text-2xl font-semibold text-gray-800 bg-[#CDA03D] p-4 md:p-5 rounded-t-xl mt-6 md:mt-9">
            {t("matrixEditForm.definitions")}
          </h2>

          <div className="bg-white p-4 md:p-8 rounded-lg shadow-md">
            {matrixData.definitions.map((definition, index) => (
              <div
                key={index}
                className=" grid grid-cols-1 gap-4 mb-4 w-full" dir={direction}
              >
                <div className="col-span-2 w-full">
                  <Label
                    htmlFor={`term-${index}`}
                    value={t("matrixEditForm.term")}
                  />
                  <TextInput
                    id={`term-${index}`}
                    type="text"
                    value={definition.term}
                    onChange={(e) =>
                      handleDefinitionChange(index, "term", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2 w-full">
                  <Label
                    htmlFor={`interpretation-${index}`}
                    value={t("matrixEditForm.interpretation")}
                  />
                  <Textarea
                    id={`interpretation-${index}`}
                    rows={4}
                    value={definition.interpretation}
                    onChange={(e) =>
                      handleDefinitionChange(
                        index,
                        "interpretation",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}

            <div className="mt-4 text-right">
              <Button onClick={handleAddDefinition} className="bg-gray-700">
                {t("matrixEditForm.addNewDef")}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8  flex justify-center" dir={direction}>
          <div
            onClick={handleSave}
            className={`aux-button aux-curve aux-gold flex items-center justify-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 `}        
          >
            <span className="flex items-center space-x-4 aux-text">{t("matrixEditForm.save")}</span>
         
          </div>
        </div>
      </div>
    </div>
    <Bottombanner/>
    </div>
  );
}
