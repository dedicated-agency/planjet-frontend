import { useEffect, useState } from "react";
import { AvatarUser } from "../components/mini/AvatarUser";
import ArrowRight from "../assets/icons/ArrowRight";
import { Link } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import imageCacheChacker from "../common/imagesCacher";
import { t } from "i18next";
import { useUserContext } from "../context/UserContext";

const Profile = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  const {user} = useUserContext();
  const [currentUser, setCurrentUser] = useState<any>(user);

  useEffect(() => {
    getInitial();
  }, [user]);

  const getInitial = async () => {
    if (user && user.first_name) {
      setCurrentUser({
        image: await imageCacheChacker(String(user.telegram_id)),
        first_name: user.first_name.charAt(0).toUpperCase(),
      });
    }
  };


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
            id={user.telegram_id}
          />
        </div>
        <p
          className='font-medium text-[20px] text-customBlackLight leading-[24px] font-sfpro'
        >
          {user && user.first_name}
        </p>
        <p
          className='font-normal text-[14px] text-customBlack1 font-sfpro'
        >
          @{user && user.username}
        </p>
      </div>
      <div className='flex flex-col gap-[12px]'>
        <Link to={"/language"} className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white rounded-[12px]'>
          <p
            className='text-[17px] font-normal text-black font-sfpro'
          >
            {t('settings')}
          </p>
          <ArrowRight />
        </Link>
        <div className='bg-white rounded-[12px] overflow-hidden'>
          <div className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white '>
            <p
              className='text-[17px] font-normal text-black font-sfpro'
            >
              {t('documentation')}
            </p>
            <ArrowRight />
          </div>
          <div className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white rounded-[12px]'>
            <p
              className='text-[17px] font-normal text-black font-sfpro'
            >
              {t('support')}
            </p>
            <ArrowRight />
          </div>
        </div>
        <div className='bg-white rounded-[12px] overflow-hidden'>
          <div className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white '>
            <p
              className='text-[17px] font-normal text-black font-sfpro'
            >
              {t('user_agreement')}
            </p>
            <ArrowRight />
          </div>
          <div className='w-full h-[48px] flex items-center justify-between px-[16px] bg-white rounded-[12px]'>
            <p
              className='text-[17px] font-normal text-black font-sfpro'
            >
              {t('privacy_policy')}
            </p>
            <ArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
