// img
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

interface IFunction {
  setPage?: (page: number) => void;
}

import languages from "../../local/languages.json";
import { useContext, useEffect } from "react";
import { StateContext } from "../../context/StateContext";
import WebApp from "@twa-dev/sdk";

const HowToCreate = ({ setPage }: IFunction) => {
  useEffect(() => {
    WebApp.setHeaderColor("#007AFF");
  }, []);
  const { lang } = useContext(StateContext);
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
            {locale[lang].create_task_with_commands}
          </p>
          <div className='flex flex-col gap-3 mt-[25px]'>
            <div className='shadow-custom border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[16px] p-[16px] rounded-[20px]'>
              <div>
                <div
                  className='w-[44px] h-[44px] text-white bg-customWhite shadow-custom flex items-center justify-center font-medium text-[20px] rounded-[12px]'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  1
                </div>
              </div>
              <p
                className='font-medium text-[17px] text-white leading-[20px]'
                style={{ fontFamily: "SF Pro Display" }}
              >
                {locale[lang].write_task_in_chat}
              </p>
            </div>
            <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[16px] p-[16px] rounded-[20px]'>
              <div>
                <div
                  className='w-[44px] h-[44px] text-white bg-customWhite shadow-custom flex items-center justify-center font-medium text-[20px] rounded-[12px]'
                  style={{ fontFamily: "SF Pro Display " }}
                >
                  2
                </div>
              </div>
              <p
                className='font-medium text-[17px] text-white leading-[23px]'
                style={{ fontFamily: "SF Pro Display " }}
              >
                {locale[lang].reply_with_command}{" "}
                <span className='bg-customBlue py-[3px] px-[6px] rounded-[8px] font-normal text-[17px]'>
                  /add
                </span>
              </p>
            </div>
            <div className='border-l-[2.5px] border-customWhite bg-customWhite flex items-center gap-[16px] p-[16px] rounded-[20px]'>
              <div>
                <div
                  className='w-[44px] h-[44px] text-white bg-customWhite shadow-custom flex items-center justify-center font-medium text-[20px] rounded-[12px]'
                  style={{ fontFamily: "SF Pro Display " }}
                >
                  3
                </div>
              </div>
              <p
                className='font-medium text-[17px] text-white leading-[20px]'
                style={{ fontFamily: "SF Pro Display " }}
              >
                {locale[lang].go_to_mini_app_for_changes}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='fixed left-0 right-0 bottom-0 flex flex-col justify-center px-8 h-[100px] pb-[42px]'>
        {setPage ? (
          <div
            className='h-[52px] flex items-center justify-center rounded-[16px] shadow-custom font-medium text-[17px] bg-white'
            style={{ fontFamily: "SF Pro Display " }}
            onClick={() => setPage(3)}
          >
            <p className='text-gradient-blue'>{locale[lang].next}</p>
          </div>
        ) : (
          <Link
            to={"/tasks/create/1"}
            className='h-[52px] flex items-center justify-center rounded-[16px] shadow-custom font-medium text-[17px] bg-white'
            style={{ fontFamily: "SF Pro Display " }}
          >
            {locale[lang].understood}
          </Link>
        )}
      </div>
      <div className='h-[80px]'></div>
    </div>
  );
};

export default HowToCreate;
