import { useContext, useState } from "react";
import { Symbol } from "../assets/icons/Symbol";
import { StateContext } from "../context/StateContext";
import languages from "../local/languages.json";
import { BiSearch } from "react-icons/bi";
import WebApp from "@twa-dev/sdk";

const TimeZone = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  const { lang } = useContext(StateContext);
  const locales: any = languages;

  const [isSelect, setIsSelect] = useState({
    Tash: true,
    Ash: false,
    Lon: false,
  });

  // Handle time zone selection
  const handleTimeZoneChange = (timezone: string) => {
    setIsSelect(() => ({
      Tash: timezone === "Tash" ? true : false,
      Ash: timezone === "Ash" ? true : false,
      Lon: timezone === "Lon" ? true : false,
    }));
  };

  return (
    <div className='px-3 my-2'>
      <div className='w-full h-[36px] bg-customGray2 rounded-[10px] flex items-center px-[8px]'>
        <div>
          <BiSearch />
        </div>
        <input
          type='text'
          placeholder={locales[lang].search}
          className='outline-none border-none pl-[4px]'
          style={{ flex: 1, background: "transparent" }}
        />
      </div>
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
          {/* Tashkent */}
          <label className='flex justify-between px-4 py-2 items-center'>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              Tashkent
            </p>
            <input
              type='radio'
              name='timezone'
              value='Tash'
              className='hidden peer'
              checked={isSelect.Tash}
              onChange={() => handleTimeZoneChange("Tash")}
            />
            <div className='flex gap-[8px]'>
              <p
                className='text-[17px] font-normal text-black'
                style={{ fontFamily: "SF Pro Display" }}
              >
                +5:00
              </p>
              <Symbol
                className={`text-gray-500 ${isSelect.Tash ? "flex" : "hidden"}`}
              />
            </div>
          </label>
          {/* Ashgabat */}
          <label className='flex justify-between px-4 py-2 items-center'>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              Ashgabat
            </p>
            <input
              type='radio'
              name='timezone'
              value='Ash'
              className='hidden peer'
              checked={isSelect.Ash}
              onChange={() => handleTimeZoneChange("Ash")}
            />
            <div className='flex gap-[8px]'>
              <p
                className='text-[17px] font-normal text-black'
                style={{ fontFamily: "SF Pro Display" }}
              >
                +5:00
              </p>
              <Symbol
                className={`text-gray-500 ${isSelect.Ash ? "flex" : "hidden"}`}
              />
            </div>
          </label>
          {/* London */}
          <label className='flex justify-between px-4 py-2 items-center'>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              London
            </p>
            <input
              type='radio'
              name='timezone'
              value='Lon'
              className='hidden peer'
              checked={isSelect.Lon}
              onChange={() => handleTimeZoneChange("Lon")}
            />
            <div className='flex gap-[8px]'>
              <p
                className='text-[17px] font-normal text-black'
                style={{ fontFamily: "SF Pro Display" }}
              >
                +5:00
              </p>
              <Symbol
                className={`text-gray-500 ${isSelect.Lon ? "flex" : "hidden"}`}
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default TimeZone;