import React, { useEffect, useState } from 'react';
import db from '../../../../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Bottombanner() {
  const [BottomBannerUrl, setBottomBannerUrl] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'banners', 'bottomBanner'), (doc) => {
      if (doc.exists()) {
        setBottomBannerUrl(doc.data().imageUrl);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      className="BottomBaner w-[86%] h-32 rounded-xl  bg-cover bg-center"
      style={{
        backgroundImage: `url(${BottomBannerUrl})`,
        position: "fixed",
        bottom: 0,
        zIndex: 1000
      }}
    />
  );
}
