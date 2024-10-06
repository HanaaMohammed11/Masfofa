import React, { useState } from 'react';
import Topbanner from '../../Home/componants/banner/Topbanner';
import Bottombanner from '../../Home/componants/banner/Bottombanner';
import { SubCard } from './SubCard';
import { useTranslation } from 'react-i18next';

export default function SubjectsLists() {
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [searchTerm, setSearchTerm] = useState(''); 

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <div className="relative flex justify-center items-center text-center">
        <Topbanner />
        <h1 className="absolute top-16 text-6xl font-semibold text-gray-700" style={{ fontFamily: "cursive" }}>
          {t('articels.title')}
        </h1>
      </div>

      <div className='search flex justify-center mt-9'>
        <input
          type="text"
          placeholder={t('articels.searchPlaceholder')} 
          className="xs:w-72 sm:w-96 rounded-full"
          dir={direction}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className='flex-grow'>
        <SubCard searchTerm={searchTerm} /> 
      </div>

      <div className='mt-auto'>
        <Bottombanner />
      </div>
    </div>
  );
}
