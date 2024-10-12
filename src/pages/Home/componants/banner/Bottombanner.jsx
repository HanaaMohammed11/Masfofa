import React, { useEffect, useState } from 'react';
import db from '../../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import  storage  from '../../../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setDoc } from 'firebase/firestore';
import Planet from '../planet/Planet';

export default function Bottombanner() {

  const [BottomBannerUrl, setBottomBannerUrl] = useState('');


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const bottomBannerDoc = await getDoc(doc(db, 'banners', 'bottomBanner'));

        if (bottomBannerDoc.exists()) {
          setBottomBannerUrl(bottomBannerDoc.data().imageUrl);
        }
     
       
      } catch (error) {
        console.error('حدث خطأ أثناء جلب الصور:', error);
      }
    };

    fetchImages();
  }, []);
  return (

    <div
    className="BottomBaner h-44 bg-cover bg-center"
    style={{
      backgroundImage: `url(${BottomBannerUrl})`,
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      zIndex: 1000 
    }}
  >
  </div>
  

  );
}
