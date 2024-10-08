import { useEffect, useState } from "react";
import Iicon from "../assets/icons/Iicon";
import { AvatarUser } from "./mini/AvatarUser";
import { Link } from "react-router-dom";
import imageCacheChacker from "../common/imagesCacher";
import { useUserContext } from "../context/UserContext";

const UserNavbar = () => {
  const {user} = useUserContext();

  const [userImage, setImageUser] = useState('');

  useEffect(() => {
    getInitial();
  }, [user]);

  const getInitial = async () => {
    setImageUser(await imageCacheChacker(String(user.telegram_id)));
  };

  return (
    <div className='flex justify-between items-center h-[48px]'>
      <div className='flex items-center gap-[16px]'>
        <Link to={"/profile"} className='w-[40px] h-[40px] rounded-full overflow-hidden border-[3px] border-customGray1 flex items-center justify-center'>
          <AvatarUser
            mr={true}
            width={40}
            height={40}
            alt={user.first_name}
            image={userImage}
            id={user.telegram_id}
          />
        </Link>
        <p
          className='text-[17px] font-medium text-customBlackLight'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {user && user.first_name}
        </p>
      </div>
      <div className='flex gap-[16px] items-center'>
        <Link to={"/onboarding"}>
          <Iicon />
        </Link>
        {/* <div className='w-[73px] h-[28px] flex items-center justify-center bg-custom-gradient-blue rounded-[8px]'>
          <p
            className='text-[13px] text-white font-medium'
            style={{ fontFamily: "SF Pro Display" }}
          >
            Premium
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default UserNavbar;
