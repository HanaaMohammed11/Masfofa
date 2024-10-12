/* eslint-disable no-unused-vars */
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";
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

// Other imports remain the same

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

  // Provide a default value for accountType
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType:
      user.length > 0
        ? user[0].accountType === "superAdmin"
          ? "admin"
          : "employee"
        : "employee", // Default to "employee"
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
              className="block w-full px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                    <div className="space-y-6" dir={direction}>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        {t("addaccount.createAccount")}
                      </h3>

                      {error && <div className="text-red-500">{error}</div>}

                      <div>
                        <div className="mb-2 block">
                          <Label
                            htmlFor="firstName"
                            value={t("addaccount.firstName")}
                          />
                        </div>
                        <Field
                          name="firstName"
                          type="text"
                          as={TextInput}
                          id="firstName"
                          placeholder={t("addaccount.firstName")}
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label
                            htmlFor="lastName"
                            value={t("addaccount.lastName")}
                          />
                        </div>
                        <Field
                          name="lastName"
                          type="text"
                          as={TextInput}
                          id="lastName"
                          placeholder={t("addaccount.lastName")}
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label
                            htmlFor="email"
                            value={t("addaccount.email")}
                          />
                        </div>
                        <Field
                          name="email"
                          type="email"
                          as={TextInput}
                          id="email"
                          placeholder="name@company.com"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label
                            htmlFor="password"
                            value={t("addaccount.password")}
                          />
                        </div>
                        <Field
                          name="password"
                          type="password"
                          as={TextInput}
                          id="password"
                          placeholder="••••••••"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label
                            htmlFor="accountType"
                            value={t("addaccount.accType")}
                          />
                        </div>
                        <Field
                          as="select"
                          name="accountType"
                          id="accountType"
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                          {user.length > 0 &&
                            user[0].accountType === "superAdmin" && (
                              <option value="admin">
                                {t("addaccount.superAdmin")}
                              </option>
                            )}
                          <option value="admin">{t("addaccount.admin")}</option>
                          <option value="employee">
                            {t("addaccount.emp")}
                          </option>
                        </Field>
                        <ErrorMessage
                          name="accountType"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="w-full">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting
                            ? t("addaccount.loading")
                            : t("addaccount.create")}
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        </div>

        {/* Employee List */}
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t("addaccount.name")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("addaccount.email")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("addaccount.action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.docId}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {employee.firstname} {employee.lastname}
                  </td>
                  <td className="px-6 py-4">{employee.email}</td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
