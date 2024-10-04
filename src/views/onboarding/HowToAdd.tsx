// img
import { useContext, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import languages from "../../local/languages.json";
import { StateContext } from "../../context/StateContext";
import WebApp from "@twa-dev/sdk";
import { Link } from "react-router-dom";

interface IFunction {
  setPage?: (page: number) => void;
}

const HowToAdd = ({ setPage }: IFunction) => {
  useEffect(() => {
    WebApp.setHeaderColor("#007AFF");
  }, []);
  const { lang } = useContext(StateContext);

  const locales: any = languages;

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
            {locales[lang].how_to_add}
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
                {locales[lang].add_bot_to_group}
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
                className='font-medium text-[17px] text-white leading-[20px]'
                style={{ fontFamily: "SF Pro Display" }}
              >
                {locales[lang].make_bot_admin}
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
                {locales[lang].enable_necessary_permissions}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='fixed left-0 right-0 bottom-0 flex flex-col justify-center px-8 h-[100px] pb-[42px]'>
        {setPage ? (
          <div
            className='h-[52px] flex items-center justify-center rounded-[16px] shadow-custom font-medium text-[17px] bg-white'
            onClick={() => setPage(2)}
            style={{ fontFamily: "SF Pro Display" }}
          >
            <p className='text-gradient-blue'>{locales[lang].next}</p>
          </div>
        ) : (
          <Link
            to={"/"}
            className='h-[52px] flex items-center justify-center rounded-[16px] shadow-custom font-medium text-[17px] bg-white'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {locales[lang].understood}
          </Link>
        )}
      </div>
      <div className='h-[80px]'></div>
    </div>
  );
};

export default HowToAdd;
