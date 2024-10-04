import { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/StateContext";
import { AvatarUser } from "../components/mini/AvatarUser";

import languages from "../local/languages.json";
import ArrowRight from "../assets/icons/ArrowRight";
import { Link } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import imageCacheChacker from "../common/imagesCacher";

const Profile = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  const { user, lang,  availableUserImages, setContextState } = useContext(StateContext);
  const [currentUser, setCurrentUser] = useState<any>(user);

  useEffect(() => {
    getInitial();
  }, [currentUser]);

  const getInitial = async () => {
    if (user && user.first_name) {
      setCurrentUser({
        image: await imageCacheChacker(user.id, availableUserImages, setContextState),
        first_name: user.first_name.charAt(0).toUpperCase(),
      });
    }
  };

  const locales: any = languages;

  return (
    <div className='px-3 mt-2 flex flex-col gap-[32px]'>
      <div className='w-full h-[103px] flex flex-col items-center justify-center py-[4px]'>
        <div>
          <AvatarUser
            mr={true}
            width={48}
            height={48}
            alt={currentUser.first_name}
            image={currentUser.image}
            id={user.id}
          />
        </div>
        <p
          className='font-medium text-[20px] text-customBlackLight leading-[24px]'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {user && user.first_name}
        </p>
        <p
          className='font-normal text-[14px] text-customBlack1'
          style={{ fontFamily: "SF Pro Display" }}
        >
          @{user && user.username}
        </p>
      </div>
      <div className='flex flex-col gap-[12px]'>
        <Link to={"/settings"} className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white rounded-[12px]'>
          <p
            className='text-[17px] font-normal text-black'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {locales[lang].settings}
          </p>
          <ArrowRight />
        </Link>
        <div className='bg-white rounded-[12px] overflow-hidden'>
          <div className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white '>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {locales[lang].documentation}
            </p>
            <ArrowRight />
          </div>
          <div className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white rounded-[12px]'>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {locales[lang].support}
            </p>
            <ArrowRight />
          </div>
        </div>
        <div className='bg-white rounded-[12px] overflow-hidden'>
          <div className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white '>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {locales[lang].user_agreement}
            </p>
            <ArrowRight />
          </div>
          <div className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white rounded-[12px]'>
            <p
              className='text-[17px] font-normal text-black'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {locales[lang].privacy_policy}
            </p>
            <ArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
