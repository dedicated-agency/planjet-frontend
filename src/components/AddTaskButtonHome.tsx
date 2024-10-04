import { Link } from "react-router-dom";
import Plus from "../assets/icons/Plus";
import { useContext, useState } from "react";
import CopyIcon from "../assets/icons/CopyIcon";
import FileIcon from "../assets/icons/FileIcon";
import { StateContext } from "../context/StateContext";
import languages from "../local/languages.json";

export const AddTaskButtonHome = () => {
  const { lang } = useContext(StateContext);
  const locales: any = languages;
  const [openParticipant, setOpenParticipant] = useState(false);
  return (
    <>
      <div
        // to={"/tasks/create/" + id}
        onClick={() => setOpenParticipant(true)}
        className='w-[64px] h-[64px] rounded-full bg-custom-gradient-blue flex items-center justify-center fixed z-50 bottom-[30px] right-[20px] border-[2px] border-customWhite3 shadow-customMultiple'
      >
        <div className="w-[28px] h-[28px] bg-white flex items-center justify-center rounded-full text-blue-700 border-[1px] border-customWhite3'">
          <Plus />
        </div>
      </div>
      {openParticipant && (
        <div
          className='bg-black opacity-45 z-20 fixed top-0 left-0 w-full h-full'
          onClick={() => {
            setOpenParticipant(false);
          }}
        ></div>
      )}
      <div
        className={`${
          openParticipant ? "bottom-[24px]" : "bottom-[-100%]"
        } overflow-y-scroll max-h-[70%] z-[100] fixed left-[16px] right-[16px] transition-all scrollbar-hidden rounded-[25px] bg-white p-[16px] pb-[24px] flex flex-col gap-[16px]`}
      >
        <Link
          to={"/tasks/create/0"}
          className='flex gap-[12px] items-center px-[16px]'
        >
          <CopyIcon />
          <div className='flex flex-col calc'>
            <span
              className='text-[17px] font-normal text-black leading-6'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {locales[lang].new_task}
            </span>
            <span
              className='text-[15px] font-[400] text-[#000000] leading-4 opacity-[50%]'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {locales[lang].create_task_in_selected_project}
            </span>
          </div>
        </Link>
        <Link
          to={"/onboardingcrate"}
          className='flex gap-[12px] items-center px-[16px]'
        >
          <FileIcon />
          <div className='flex flex-col calc'>
            <span
              className='text-[17px] font-normal text-black leading-6'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {locales[lang].add_project}
            </span>
            <span
              className='text-[15px] font-[400] text-[#000000] leading-4 opacity-[50%]'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {locales[lang].add_bot_to_project_chat}
            </span>
          </div>
        </Link>
      </div>
    </>
  );
};
