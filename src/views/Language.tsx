import { Symbol } from "../assets/icons/Symbol";
import WebApp from "@twa-dev/sdk";
import { t } from "i18next";
import i18n from "../i18n";
import { useUserContext } from "../context/UserContext";
import axiosClient from "../common/axiosClient";

const Language = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  const {user, updateUserState} = useUserContext();
  const lang = user.lang

  const handleLanguageChange = async (language: string) => {
    updateUserState({user: {...user, lang: language}})
    i18n.changeLanguage(language);
    await axiosClient.post('/user/language', {
      lang: language
    });
  };

  return (
    <div className='px-3 my-2'>
      <div className='h-[40px] w-full px-[16px] py-[11px] flex justify-between'>
        <p
          className='text-[13px] text-customGrayDark'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {t('app_language')}
        </p>
        <p
          className='text-[13px] text-customBlue'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {t('default')}
        </p>
      </div>
      <div>
        <div className='bg-white rounded-xl py-2'>
          {/* English */}
          <label className='flex justify-between px-4 py-2 items-center' onClick={() => handleLanguageChange("en")}>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              English
            </p>
            <div
              className={`text-gray-500 ${
                lang === "en" ? "flex" : "hidden"
              }`}
            >
              <Symbol />
            </div>
          </label>
          {/* Русский */}
          <label className='flex justify-between px-4 py-2 items-center' 
            onClick={() => handleLanguageChange("ru")}
          >
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              Русский
            </p>
            <div
              className={`text-gray-500 ${
                lang === "ru" ? "flex" : "hidden"
              }`}
            >
              <Symbol />
            </div>
          </label>
          {/* O’zbek */}
          <label className='flex justify-between px-4 py-2 items-center' 
            onClick={() => handleLanguageChange("uz")}>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              Uzbek
            </p>
            <div
              className={`text-gray-500 ${
                lang === "uz" ? "flex" : "hidden"
              }`}
            >
              <Symbol />
            </div>
          </label>
        </div>
        <p
          className='text-[13px] font-normal text-customGrayDark px-3 mt-2'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {t('select_notification_language')}
        </p>
      </div>
    </div>
  );
};

export default Language;
