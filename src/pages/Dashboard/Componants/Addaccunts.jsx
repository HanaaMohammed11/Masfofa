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
import btn from "../../../../src/assets/btn.png";
import "../../Dashboard/btns.css";
import SideBar from "../SideBar";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import "../../Dashboard/btns.css";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { getFunctions, httpsCallable } from "firebase/functions";

emailjs.init("vRSobHxRYCwqKML2w");

export default function AddAccounts() {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const usersCollection = collection(db, "users");
  const auth = getAuth();
  const [user, setUser] = useState([]);
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "employee", // Default value
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOpen, setIsOpen] = useState(null);
  const functions = getFunctions();
  const updateUser = httpsCallable(functions, "updateUser");
  const handleEditClick = (employee) => {
    setNewEmail(employee.email);
    setNewPassword(employee.password); // This assumes you're storing passwords (which is generally not recommended, but since it's in your code, we'll use it)
    setEditModalOpen(true);
  };

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
  const handleUpdateAccount = async (e, emp) => {
    console.log(emp);

    try {
      const result = await updateUser({
        uid: emp.ID,
        email: newEmail,
        password: newPassword,
      });
      console.log(result.data.message);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating account:", error);
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
  }, []); // Keep this as is

  return (
    <div className=" bg-gray-100 flex flex-col items-center h-screen">
      <div className=" flex">
        <div className="sm:mx-0 ">
          <div
            className="add-btn add-g add-c add-uppercase add-text mt-10 mx-9 flex justify-center items-center"
            onClick={() => setOpenModal(true)}
          >
            {t("addaccount.createAccount")}
          </div>
          <div></div>

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
                          {user[0].accountType == "superAdmin" && (
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
                            ? t("addaccount.registering")
                            : t("addaccount.register")}
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>

          <div
            className=" overflow-x-auto flex flex-col items-center"
            dir={direction}
          >
            <div
              dir={direction}
              className="overflow-x-auto w-[100%] mx-auto  p-4 rounded-lg shadow-lg mt-10"
            >
              <table
                dir="rtl"
                className="table-auto overflow-x-auto w-full  bg-[#D3A17A]"
              >
                <thead dir={direction}>
                  <tr dir={direction} className="bg-[#D3A17A] text-white">
                    <th className="px-4 py-2 text-sm md:text-base">
                      {t("addaccount.firstName")}
                    </th>
                    <th className="px-4 py-2 text-sm md:text-base">
                      {t("addaccount.email")}
                    </th>
                    <th className="px-4 py-2 text-sm md:text-base">
                      {t("addaccount.password")}
                    </th>
                    <th className="px-4 py-2 text-sm md:text-base">
                      {t("addaccount.accType")}
                    </th>
                    <th className="px-4 py-2 text-sm md:text-base">
                      {t("subjectInfo.action")}
                    </th>
                  </tr>
                </thead>

                <tbody className="text-gray-700">
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <tr key={employee.id} className="border-t">
                        <td className="px-4 py-2 text-sm md:text-base">
                          {employee.firstname} {employee.lastname}
                        </td>
                        <td className="px-4 py-2 text-sm md:text-base">
                          {employee.email}
                        </td>
                        <td className="px-4 py-2 text-sm md:text-base">
                          {employee.password}
                        </td>
                        <td className="px-4 py-2 text-sm md:text-base">
                          {employee.accountType}
                        </td>

                        <td className="px-4 py-2 relative">
                          {/* أيقونة التعديل */}
                          {/* <button
                            className="text-yellow-500 mx-2"
                            onClick={() => {
                              handleEditClick(employee);
                            }}
                          >
                            <AiFillEdit size={20} />
                          </button> */}

                          {/* أيقونة الحذف */}
                          {/* <button className="text-red-500 mx-2">
                            <AiFillDelete size={20} />
                          </button> */}
                          <Modal
                            show={editModalOpen}
                            onClose={() => setEditModalOpen(false)}
                            dir={direction}
                          >
                            <Modal.Header>
                              {t("editAccount.title")}
                            </Modal.Header>
                            <Modal.Body>
                              <form onSubmit={handleUpdateAccount}>
                                <div className="mb-4">
                                  <Label
                                    htmlFor="editEmail"
                                    value={t("editAccount.email")}
                                  />
                                  <TextInput
                                    id="editEmail"
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) =>
                                      setNewEmail(e.target.value)
                                    }
                                    required
                                  />
                                </div>
                                <div className="mb-4">
                                  <Label
                                    htmlFor="editPassword"
                                    value={t("editAccount.password")}
                                  />
                                  <TextInput
                                    id="editPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                      setNewPassword(e.target.value)
                                    }
                                    required
                                  />
                                </div>
                                <Button
                                  onClick={() => {
                                    handleUpdateAccount(employee);
                                    // console.log(employee);
                                  }}
                                >
                                  {t("editAccount.update")}
                                </Button>
                              </form>
                            </Modal.Body>
                          </Modal>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-10 text-center">
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
