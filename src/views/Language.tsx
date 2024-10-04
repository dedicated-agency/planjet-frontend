import { useContext, useState } from "react";
import { StateContext } from "../context/StateContext";
import { Symbol } from "../assets/icons/Symbol";
import WebApp from "@twa-dev/sdk";

import languages from "../local/languages.json";

const Language = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  const { lang, setContextState } = useContext(StateContext);
  const [selectedLanguage, setSelectedLanguage] = useState(lang);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setContextState({ lang: language });
  };

  const locales: any = languages;

  return (
    <div className='px-3 my-2'>
      <div className='h-[40px] w-full px-[16px] py-[11px] flex justify-between'>
        <p
          className='text-[13px] text-customGrayDark'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {locales[lang].notification_language}
        </p>
        <p
          className='text-[13px] text-customBlue'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {locales[lang].default}
        </p>
      </div>
      <div>
        <div className='bg-white rounded-xl py-2'>
          {/* English */}
          <label className='flex justify-between px-4 py-2 items-center'>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              English
            </p>
            <input
              type='radio'
              name='language'
              value='en'
              className='hidden peer'
              checked={selectedLanguage === "en"}
              onChange={() => handleLanguageChange("en")}
            />
            <Symbol
              className={`text-gray-500 ${
                selectedLanguage === "en" ? "flex" : "hidden"
              }`}
            />
          </label>
          {/* Русский */}
          <label className='flex justify-between px-4 py-2 items-center'>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              Русский
            </p>
            <input
              type='radio'
              name='language'
              value='ru'
              className='hidden peer'
              checked={selectedLanguage === "ru"}
              onChange={() => handleLanguageChange("ru")}
            />
            <Symbol
              className={`text-gray-500 ${
                selectedLanguage === "ru" ? "flex" : "hidden"
              }`}
            />
          </label>
          {/* O’zbek */}
          <label className='flex justify-between px-4 py-2 items-center'>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              Uzbek
            </p>
            <input
              type='radio'
              name='language'
              value='uz'
              className='hidden peer'
              checked={selectedLanguage === "uz"}
              onChange={() => handleLanguageChange("uz")}
            />
            <Symbol
              className={`text-gray-500 ${
                selectedLanguage === "uz" ? "flex" : "hidden"
              }`}
            />
          </label>
        </div>
        <p
          className='text-[13px] font-normal text-customGrayDark px-3 mt-2'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {locales[lang].select_notification_language}
        </p>
      </div>
    </div>
  );
};

export default Language;
