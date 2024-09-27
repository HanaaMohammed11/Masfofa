import React from "react";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { FaAlignRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function MatrixEditForm() {
  const navigation = useNavigate();

  const handleSave = () => {
    navigation("/home"); 
  };
  return (
    <div className="flex h-full bg-slate-100" style={{ fontFamily: "cursive" }}>
 
    

    
      <div className="ml-64 p-8 w-full max-w-5xl">
        <h1 className=" text-right text-3xl font-semibold text-gray-800   bg-[#B5B5B6] p-5 rounded-t-xl  " style={{ fontFamily: "cursive" }}>
          تعديل المصفوفة   
       
        </h1>

        {/* قسم تفاصيل المصفوفة */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-right grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* الجهة المنشئة */}
            <div className="col-span-1">
              <Label htmlFor="issuer" value="الجهة المُنشئة" />
              <TextInput id="issuer" type="text" sizing="sm" className="mt-2" />
            </div>

            {/* اسم المصفوفة */}
            <div className="col-span-1">
              <Label htmlFor="matrix-name" value="اسم المصفوفة" />
              <TextInput id="matrix-name" type="text" sizing="sm" className="mt-2" />
            </div>

            {/* تاريخ التعديل */}
            <div className="col-span-1">
              <Label htmlFor="modification-date" value="تاريخ التعديل" />
              <TextInput id="modification-date" type="date" className="mt-2" />
            </div>

            {/* تاريخ الإصدار */}
            <div className="col-span-1">
              <Label htmlFor="release-date" value="تاريخ الإصدار" />
              <TextInput id="release-date" type="date" className="mt-2" />
            </div>

            {/* ملاحظات */}
            <div className="col-span-2">
              <Label htmlFor="notes" value="ملاحظات" />
              <TextInput id="notes" type="text" sizing="lg" className="mt-2" />
            </div>
          </div>
        </div>

        {/* قسم التعريفات */}
        <h2 className="text-right text-2xl font-semibold text-gray-800   bg-[#B5B5B6] p-5 rounded-t-xl mt-9" style={{ fontFamily: "cursive" }}>
          التعريفات
        </h2>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-right grid grid-cols-1 gap-6">
            {/* المصطلح */}
            <div className="col-span-2">
              <Label htmlFor="term" value="المصطلح" />
              <TextInput id="term" type="text" sizing="sm" className="mt-2" />
            </div>

            {/* التفسير */}
            <div className="col-span-2">
              <Label htmlFor="interpretation" value="التفسير" />
              <Textarea id="interpretation" required rows={4} className="mt-2" />
            </div>
          </div>

          {/* زر حفظ */}
          <div className="mt-8 text-right">
            <Button type="submit" className="bg-[#1A8895]  hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-500 transform hover:scale-105 w-32" onClick={handleSave}>
              حفظ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
