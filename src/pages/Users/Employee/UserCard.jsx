import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function UserTable({ users }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const handleDetailsClick = (user) => {
    navigate('/userinfo', { state: { user } });
  };

  if (!users || users.length === 0) {
    return (
      <p className="text-center text-gray-500">
        {t("EmpCard.noEmp")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto w-full mx-9 my-10 shadow-2xl">
      <table className="w-full text-center text-gray-500 dark:text-gray-400" dir={direction}>
        <thead className="text-center text-lg bg-white">
          <tr>
            <th scope="col" className="px-6 py-3">{t("job.employeeId")}</th>
     
            <th scope="col" className="px-6 py-3">{t("job.jobTitle")}</th>
            <th scope="col" className="px-6 py-3">{t("job.phoneNumber")}</th>
            <th scope="col" className="px-6 py-3">{t("EmpCard.details")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.employeeId}
              className={`${index % 2 === 0 ? 'bg-[#DEBA9A]' : 'bg-white'} border-b dark:bg-gray-800 dark:border-gray-700`}
            >
              <td className="px-6 py-4 text-gray-900 dark:text-white flex items-center justify-center">
              <img
                  src={user.profileImageUrl}  
                  alt={user.name}
                  className="w-10 h-10 rounded-full "
                />
                {user.employeeName}
              </td>
      
              <td className="px-6 py-4">
                {user.jobTitle}
              </td>
              <td className="px-6 py-4">
                {user.phoneNumber}
              </td>
              <td className="px-6 py-4">
                <button onClick={() => handleDetailsClick(user)}>
                  {t("EmpCard.details")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
