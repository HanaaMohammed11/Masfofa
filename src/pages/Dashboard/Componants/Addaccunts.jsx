/* eslint-disable no-unused-vars */
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";
import { deleteDoc, doc } from "firebase/firestore"; // Import deleteDoc and doc from firestore
import { deleteUser } from "firebase/auth";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import db from "../../../config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

emailjs.init("vRSobHxRYCwqKML2w");

export default function AddAccounts() {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to handle search input
  const usersCollection = collection(db, "users");
  const auth = getAuth();
  const [user, setUser] = useState([]);
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "employee",
  };
  const handleDelete = async (employeeId, userId) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "users", employeeId));
  
      // Delete from Firebase Authentication
      const user = auth.currentUser; // Get the current user
      if (user && user.uid === userId) {
        await deleteUser(user); // Delete the user if they match the userId
      }
  
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("حدث خطأ أثناء حذف المستخدم.");
    }
  };
  
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("الاسم الأول مطلوب"),
    lastName: Yup.string().required("الاسم الأخير مطلوب"),
    email: Yup.string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .min(6, "يجب أن يكون الرمز السري 6 أحرف على الأقل")
      .required("الرمز السري مطلوب"),
  });

  const handleRegister = async (values, { setSubmitting }) => {
    const { email, password, firstName, lastName, accountType } = values;

    try {
      setError("");
      setSubmitting(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const docRef = await addDoc(usersCollection, {
        ownerAdmin: localStorage.getItem("id"),
        firstname: firstName,
        lastname: lastName,
        email: email,
        ID: user.uid,
        accountType: accountType,
        password: password,
      });

      await emailjs.send("service_1go7kvh", "template_wcch0ap", {
        to_Email: email,
        from_name: "CorGov",
        reply_to: email,
        User_Email: email,
        User_passwors: password,
      });

      console.log("تم إرسال البريد الإلكتروني بنجاح!");
    } catch (error) {
      console.error("Error during registration:", error);
      setError("حدث خطأ أثناء تسجيل المستخدم.");
    } finally {
      setSubmitting(false);
      setOpenModal(false);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("accountType", "==", "employee")
        );
        const querySnapshot = await getDocs(q);
        const employeeList = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeList);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

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
  }, []);

  // Filter the employees based on the search query
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex">
        <div className="sm:mx-0">
          <button
            className="add-btn add-g add-c add-uppercase add-text mt-10 flex justify-center items-center"
            onClick={() => setOpenModal(true)}
          >
            {t("addaccount.createAccount")}
          </button>

          {/* Search Bar */}
          <div className="my-4">
            <TextInput
              type="text"
              placeholder={t("addaccount.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full px-4 py-2  rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <Modal
            show={openModal}
            size="md"
            popup
            onClose={() => setOpenModal(false)}
            dir={direction}
          >
            <Modal.Header title={t("addaccount.createAccount")} />
            <Modal.Body>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleRegister}
              >
                {({ isSubmitting }) => (
                  <Form>
                    {/* Form fields here */}
                    <div className="w-full">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                          ? t("addaccount.registering")
                          : t("addaccount.register")}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>

          {/* Employees Table */}
          <div
            className="overflow-x-auto flex flex-col items-center"
            dir={direction}
          >
            <div
              dir={direction}
              className="overflow-x-auto w-full mx-auto p-4 rounded-lg shadow-lg mt-10"
            >
              <table
                dir="rtl"
                className="table-auto min-w-full bg-[#D3A17A] text-sm md:text-base"
              >
                <thead dir={direction}>
                  <tr dir={direction} className="bg-[#D3A17A] text-white">
                    <th className="px-4 py-2">{t("addaccount.firstName")}</th>
                    <th className="px-4 py-2">{t("addaccount.email")}</th>
                    <th className="px-4 py-2">{t("addaccount.password")}</th>
                    <th className="px-4 py-2">{t("addaccount.accType")}</th>
                    <th className="px-4 py-2">{t("subjectInfo.action")}</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
  {filteredEmployees.length > 0 ? (
    filteredEmployees.map((employee) => (
      <tr key={employee.ID} className="border-t hover:bg-gray-100">
        <td className="px-4 py-2">
          {employee.firstname} {employee.lastname}
        </td>
        <td className="px-4 py-2">{employee.email}</td>
        <td className="px-4 py-2">{employee.password}</td>
        <td className="px-4 py-2">{employee.accountType}</td>
        <td className="px-4 py-2 flex justify-center space-x-2">
          <AiFillDelete
            className="text-red-500 cursor-pointer"
            onClick={() => handleDelete(employee.docId, employee.ID)}
          />
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="px-4 py-10 text-center">
        {t("addaccount.noUsers")}
      </td>
    </tr>
  )}
</tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
