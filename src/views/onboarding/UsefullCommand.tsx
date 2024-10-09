// img
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { t } from "i18next";
const UsefullCommand = () => {
  useEffect(() => {
    WebApp.setHeaderColor("#007AFF");
  }, []);
  return (
    <div className='bg-custom-gradient-blue p-8  h-[100vh]'>
      <div>
        <div className='h-[130px] flex items-center justify-center'>
          <img src={logo} alt='' />
        </div>
        <div className='h-max mt-2'>
          <p
            className='text-2xl text-center font-medium text-white leading-[38px]'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {t("useful_commands_for_chats")}
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
                {t("create_task")}
              </p>
            </div>
            {/* <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[12px] p-[16px] rounded-[20px]'>
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
                {t("show_project_list")}
              </p>
            </div> */}

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
                {t("translate_to_status_ready")}
              </p>
            </div>
            <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[12px] p-[16px] rounded-[20px]'>
              <span
                className='bg-customBlue py-[3px] px-[6px] rounded-[8px] font-normal text-[17px] text-white'
                style={{ fontFamily: "SF Pro Display" }}
              >
                /dashboard
              </span>
              <p
                className='font-medium text-[17px] text-white leading-[20px]'
                style={{ fontFamily: "SF Pro Display " }}
              >
                {t("open_app")}
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
          <p className='text-gradient-blue'>{t("understood")}</p>
        </Link>
      </div>
      <div className='h-[80px]'></div>
    </div>
  );
};

export default UsefullCommand;
