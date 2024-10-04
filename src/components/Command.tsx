import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import languages from "../local/languages.json";
import { useContext } from "react";
import { StateContext } from "../context/StateContext";

interface ICommand {
  handleOnboardingClose: (isOpen: boolean) => void;
}

const Command = ({ handleOnboardingClose }: ICommand) => {
  const { lang } = useContext(StateContext);
  const locales: any = languages;
  return (
    <div className='bg-white shadow-custom p-[16px] rounded-[16px] mb-3'>
      <div className='flex justify-between items-center'>
        <p
          className='font-medium text-[17px]'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {locales[lang].useful_commands}
        </p>
        <div
          className='w-[24px] h-[24px] bg-customGrayLight rounded-full flex items-center justify-center text-white'
          onClick={(_) => handleOnboardingClose(false)}
        >
          <IoClose />
        </div>
      </div>
      <p
        className='font-light text-[14px] text-customBlack mt-1'
        style={{ fontFamily: "SF Pro Display" }}
      >
        {locales[lang].bot_commands_for_simplified_work}
      </p>
      <Link
        to={"/onboarding"}
        className='w-[72px] h-[28px] bg-custom-gradient-blue flex justify-center items-center rounded-[8px] cursor-pointer mt-2 text-white text-[13px] font-medium'
        style={{ fontFamily: "SF Pro Display" }}
      >
        {locales[lang].study}
      </Link>
    </div>
  );
};

export default Command;
