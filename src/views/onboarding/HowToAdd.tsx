import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { Link } from "react-router-dom";
import { t } from "i18next";
import Logo from "../../assets/icons/Logo";

interface IFunction {
  setPage?: (page: number) => void;
}

const HowToAdd = ({ setPage }: IFunction) => {
  useEffect(() => {
    WebApp.setHeaderColor("#007AFF");
  }, []);

  return (
    <div className='bg-custom-gradient-blue p-8 h-full'>
      <div>
        <div className='h-[120px] flex items-center justify-center'>
          <Logo />
        </div>
        <div className='h-max mt-2'>
          <p
            className='text-[32px] font-medium text-white leading-[38px]'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {t("how_to_add")}
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
                {t("add_bot_to_group")}
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
                {t("make_bot_admin")}
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
                {t("enable_necessary_permissions")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='fixed left-0 right-0 bottom-0 flex flex-col justify-center px-8 h-[100px] pb-[42px]'>
        {setPage ? (
          <div
            className='h-[52px] flex items-center justify-center rounded-[16px] font-medium text-[17px] bg-customWhite border-2 border-customWhite120 backdrop-blur-[50px] shadow-custom'
            onClick={() => setPage(2)}
            style={{ fontFamily: "SF Pro Display" }}
          >
            <p className='text-white'>{t("next")}</p>
          </div>
        ) : (
          <Link
            to={"/"}
            className='h-[52px] flex items-center justify-center rounded-[16px] font-medium text-[17px] bg-customWhite border-2 border-customWhite120 backdrop-blur-[50px] shadow-custom text-white'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {t("understood")}
          </Link>
        )}
      </div>
      <div className='h-[80px]'></div>
    </div>
  );
};

export default HowToAdd;
