import React, { useState, useEffect } from 'react';
import db from '../../../config/firebase';
import { storage } from '../../../config/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FileInput, Label } from "flowbite-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const EditTheme = () => {
  const { t, i18n } = useTranslation("global");
  const navigation = useNavigate();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [topBanner, setTopBanner] = useState(null);
  const [bottomBanner, setBottomBanner] = useState(null);
  const [homeElements, setHomeElements] = useState(null);
  const [logo, setLogo] = useState(null);
  const [homeElementsUrl, setHomeElementsUrl] = useState('');
  const [topBannerUrl, setTopBannerUrl] = useState('');
  const [bottomBannerUrl, setBottomBannerUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const [topBannerPreview, setTopBannerPreview] = useState('');
  const [bottomBannerPreview, setBottomBannerPreview] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [homeElementsPreview, setHomeElementsPreview] = useState('');

  useEffect(() => {
    const unsubscribeTopBanner = onSnapshot(doc(db, 'banners', 'topBanner'), (doc) => {
      if (doc.exists()) {
        setTopBannerUrl(doc.data().imageUrl);
      }
    });

    const unsubscribeBottomBanner = onSnapshot(doc(db, 'banners', 'bottomBanner'), (doc) => {
      if (doc.exists()) {
        setBottomBannerUrl(doc.data().imageUrl);
      }
    });

    const unsubscribeLogo = onSnapshot(doc(db, 'banners', 'logo'), (doc) => {
      if (doc.exists()) {
        setLogoUrl(doc.data().imageUrl);
      }
    });

    const unsubscribeHomeElements = onSnapshot(doc(db, 'banners', 'homeElements'), (doc) => {
      if (doc.exists()) {
        setHomeElementsUrl(doc.data().imageUrl);
      }
    });

    return () => {
      unsubscribeTopBanner();
      unsubscribeBottomBanner();
      unsubscribeLogo();
      unsubscribeHomeElements();
    };
  }, []);

  const handleDeleteImage = async (storagePath, setPreview, setFile, setUrl) => {
    try {
      await deleteOldImage(storagePath);
      setPreview('');
      setFile(null);
      setUrl('');
    } catch (error) {
      console.error('حدث خطأ أثناء حذف الصورة:', error);
    }
  };
  const deleteOldImage = async (oldUrl) => {
    if (oldUrl) {
      const imageRef = ref(storage, oldUrl);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error('حدث خطأ أثناء حذف الصورة القديمة:', error);
      }
    }
  };

  const handleImageUpload = async (file, storagePath, oldUrl) => {
    try {
      await deleteOldImage(oldUrl);
      const imageRef = ref(storage, storagePath);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      await setDoc(doc(db, 'banners', storagePath), { imageUrl });
    } catch (error) {
      console.error('حدث خطأ أثناء رفع الصورة:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (topBanner) await handleImageUpload(topBanner, 'topBanner', topBannerUrl);
      if (bottomBanner) await handleImageUpload(bottomBanner, 'bottomBanner', bottomBannerUrl);
      if (logo) await handleImageUpload(logo, 'logo', logoUrl);
      if (homeElements) await handleImageUpload(homeElements, 'homeElements', homeElementsUrl);
      navigation("/dashboard");
    } catch (error) {
      console.log('حدث خطأ أثناء الحفظ، يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className='flex items-center m-auto mt-44'>
      <div className='gap-5 justify-center w-full xs:w-[90%] sm:w-[70%] lg:w-full'>
        <div className='flex flex-wrap justify-center gap-5 w-full'>

          {/* Top Banner */}
          <Label htmlFor="top-banner" className="flex h-64 w-full md:w-96 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg className="mb-4 h-4 w-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t("edittheme.upload")}</span>
              </p>
              <p className="text-xs text-gray-500">{t("edittheme.topBanner")}</p>
              {topBannerPreview ? (
                <img src={topBannerPreview} alt="Top Banner" className="mt-2 h-32 w-full object-cover" />
              ) : (
                topBannerUrl && <img src={topBannerUrl} alt="Top Banner" className="mt-2 h-32 w-full object-cover" />
              )}
            </div>
            <input
              id="top-banner"
              type="file"
              className="hidden"
              onChange={(e) => {
                setTopBanner(e.target.files[0]);
                setTopBannerPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
              <button onClick={() => handleDeleteImage('topBanner', setTopBannerPreview, setTopBanner, setTopBannerUrl)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">
                حذف الصورة
              </button>
          </Label>

          {/* Bottom Banner */}
          <Label htmlFor="bottom-banner" className="flex h-64 w-full md:w-96 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg className="mb-4 h-4 w-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t("edittheme.upload")}</span>
              </p>
              <p className="text-xs text-gray-500">{t("edittheme.bottomBanner")}</p>
              {bottomBannerPreview ? (
                <img src={bottomBannerPreview} alt="Bottom Banner" className="mt-2 h-32 w-full object-cover" />
              ) : (
                bottomBannerUrl && <img src={bottomBannerUrl} alt="Bottom Banner" className="mt-2 h-32 w-full object-cover" />
              )}
            </div>
            <input
              id="bottom-banner"
              type="file"
              className="hidden"
              onChange={(e) => {
                setBottomBanner(e.target.files[0]);
                setBottomBannerPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
               <button onClick={() => handleDeleteImage('bottomBanner', setBottomBannerPreview, setBottomBanner, setBottomBannerUrl)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">
                حذف الصورة
              </button>
          </Label>

          {/* Logo */}
          <Label htmlFor="logo" className="flex h-64 w-full md:w-96 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg className="mb-4 h-4 w-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t("edittheme.upload")}</span>
              </p>
              <p className="text-xs text-gray-500">{t("edittheme.logo")}</p>
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="mt-2 h-32 w-full object-cover" />
              ) : (
                logoUrl && <img src={logoUrl} alt="Logo" className="mt-2 h-32 w-full object-cover" />
              )}
            </div>
            <input
              id="logo"
              type="file"
              className="hidden"
              onChange={(e) => {
                setLogo(e.target.files[0]);
                setLogoPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
             <button onClick={() => handleDeleteImage('logo', setLogoPreview, setLogo, setLogoUrl)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">
              حذف الصورة
            </button>
          </Label>

          {/* Home Elements */}
          <Label htmlFor="home-elements" className="flex h-64 w-full md:w-96 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg className="mb-4 h-4 w-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t("edittheme.upload")}</span>
              </p>
              <p className="text-xs text-gray-500">{t("edittheme.homeElements")}</p>
              {homeElementsPreview ? (
                <img src={homeElementsPreview} alt="Home Elements" className="mt-2 h-32 w-full object-cover" />
              ) : (
                homeElementsUrl && <img src={homeElementsUrl} alt="Home Elements" className="mt-2 h-32 w-full object-cover" />
              )}
            </div>
            <input
              id="home-elements"
              type="file"
              className="hidden"
              onChange={(e) => {
                setHomeElements(e.target.files[0]);
                setHomeElementsPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
             <button onClick={() => handleDeleteImage('homeElements', setHomeElementsPreview, setHomeElements, setHomeElementsUrl)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">
              حذف الصورة
            </button>
          </Label>
        </div>

        {/* Save Button */}
        <div className='w-full text-center'>
          <button
            onClick={handleSave}
            className="mt-8 p-3 bg-blue-600 text-white rounded-md"
          >
            {t("edittheme.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTheme;
