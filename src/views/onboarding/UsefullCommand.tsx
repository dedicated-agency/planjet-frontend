// img
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import languages from "../../local/languages.json";
import { useUserContext } from "../../context/UserContext";
const UsefullCommand = () => {
  useEffect(() => {
    WebApp.setHeaderColor("#007AFF");
  }, []);
  const { user } = useUserContext();
  const lang = user.lang;
  const locale: any = languages;
  return (
    <div className='bg-custom-gradient-blue p-8 h-full xsm:h-auto xxsm:h-full'>
      <div>
        <div className='h-[130px] flex items-center justify-center'>
          <img src={logo} alt='' />
        </div>
        <div className='h-max mt-2'>
          <p
            className='text-[32px] font-medium text-white leading-[38px]'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {locale[lang].useful_commands_for_chats}
          </p>
          <div className='flex flex-col gap-3 mt-[25px]'>
            <div className='shadow-custom border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[12px] p-[16px] rounded-[20px]'>
              <span
                className='bg-customBlue py-[3px] px-[6px] rounded-[8px] font-normal text-[17px] text-white'
                style={{ fontFamily: "SF Pro Display" }}
              >
                /add
              </span>
              <p
                className='font-medium text-[17px] text-white leading-[20px]'
                style={{ fontFamily: "SF Pro Display" }}
              >
                {locale[lang].create_task}
              </p>
            </div>
            <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[12px] p-[16px] rounded-[20px]'>
              <span
                className='bg-customBlue py-[3px] px-[6px] rounded-[8px] font-normal text-[17px] text-white'
                style={{ fontFamily: "SF Pro Display" }}
              >
                /tasks
              </span>
              <p
                className='font-medium text-[17px] text-white leading-[20px]'
                style={{ fontFamily: "SF Pro Display" }}
              >
                {locale[lang].show_project_list}
              </p>
            </div>
            <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[12px] p-[16px] rounded-[20px]'>
              <span
                className='bg-customBlue py-[3px] px-[6px] rounded-[8px] font-normal text-[17px] text-white'
                style={{ fontFamily: "SF Pro Display" }}
              >
                /manager
              </span>
              <p
                className='font-medium text-[17px] text-white leading-[20px]'
                style={{ fontFamily: "SF Pro Display " }}
              >
                {locale[lang].open_app}
              </p>
            </div>
            <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[12px] p-[16px] rounded-[20px]'>
              <span
                className='bg-customBlue py-[3px] px-[6px] rounded-[8px] font-normal text-[17px] text-white'
                style={{ fontFamily: "SF Pro Display " }}
              >
                /done
              </span>
              <p
                className='font-medium text-[17px] text-white leading-[20px]'
                style={{ fontFamily: "SF Pro Display" }}
              >
                {locale[lang].translate_to_status_ready}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='bg- fixed left-0 right-0 bottom-0 flex flex-col justify-center px-8 h-[100px] pb-[42px]'>
        <Link
          to={"/"}
          className='h-[52px] flex items-center justify-center rounded-[16px] shadow-custom font-medium text-[17px] bg-white '
          style={{ fontFamily: "SF Pro Display" }}
        >
          <p className='text-gradient-blue'>{locale[lang].understood}</p>
        </Link>
      </div>
      <div className='h-[80px]'></div>
    </div>
  );
};

export default UsefullCommand;
