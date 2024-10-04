import { useContext } from "react";
import { StateContext } from "../context/StateContext";
import languages from "../local/languages.json";
import ArrowRight from "../assets/icons/ArrowRight";
import { Link } from "react-router-dom";
import WebApp from "@twa-dev/sdk";

const Settings = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  const { lang } = useContext(StateContext);

  const locales: any = languages;
  return (
    <div className='px-3 mt-2'>
      <div className="h-[40px] w-full px-[16px] py-[11px]">
        <p
          className='text-[13px] text-customGrayDark'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {locales[lang].app_settings}
        </p>
      </div>
      <div className='bg-white rounded-[12px] overflow-hidden'>
        <Link
          to={"/language"}
          className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white'
        >
          <p
            className='text-[17px] font-normal text-black'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {locales[lang].notification_language}
          </p>
          <ArrowRight />
        </Link>
        {/* <Link to={"/timezone"} className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white rounded-[12px]'>
          <p
            className='text-[17px] font-normal text-black'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {locales[lang].time_zone}
          </p>
          <ArrowRight />
        </Link> */}
      </div>
    </div>
  );
};

export default Settings;
