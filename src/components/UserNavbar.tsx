import { useContext, useEffect } from "react";
import Iicon from "../assets/icons/Iicon";
import { StateContext } from "../context/StateContext";
import { AvatarUser } from "./mini/AvatarUser";
import { Link } from "react-router-dom";
import imageCacheChacker from "../common/imagesCacher";

const UserNavbar = () => {
  const { user, availableUserImages, setContextState } = useContext(StateContext);

  useEffect(() => {
    getInitial();
  }, [user]);

  const getInitial = async () => {
    user.image = await imageCacheChacker(user.id, availableUserImages, setContextState);
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
            image={user.image}
            id={user.id}
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
