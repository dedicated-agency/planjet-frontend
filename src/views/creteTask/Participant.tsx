import { t } from "i18next";
import { IUser } from "../../components/Comment";
import { AvatarUser } from "../../components/mini/AvatarUser";
import ArrowRight from "../../assets/icons/ArrowRight";
import User from "../../assets/icons/User";
import { useEffect, useState } from "react";
import getUsersData from "../../common/getUsersData";

interface IParticipant {
  setSelectedUsers: (users: IUser[]) => void;
  selectedUsers: IUser[];
  project: IParticipantProject;
  project_id: number;
}

interface IParticipantProject {
  group_id: number
}


const Participant = ({
  setSelectedUsers,
  selectedUsers,
  project,
  project_id
}: IParticipant) => {
  const [users, setUsers] = useState([]);
  const [openParticipant, setOpenParticipant] = useState(false);

  console.log(project);
  

  useEffect(() => {
    if (project) {
      getUsers();
    }
  }, [project, project_id]);

  const getUsers = async () => {
    const result = await getUsersData(`${project.group_id}`);
    // console.log({ result });
    // @ts-ignore
    setUsers(result);
  };

  const setParticipants = (user: IUser) => {
    const check = selectedUsers.some(
      (u: IUser) => u.telegram_id === user.telegram_id,
    );
    if (check) {
      setSelectedUsers(
        selectedUsers.filter((u: IUser) => u.telegram_id !== user.telegram_id),
      );
    } else {
      setSelectedUsers([user, ...selectedUsers]);
    }
  };
  return (
    <>
      <div className='h-[44px] flex justify-between items-center px-[16px]'>
        <div className='flex justify-between items-center gap-2'>
          <div className='text-gray-400'>
            <User />
          </div>
          <p
            className='text-black tex-[16px] font-normal capitalize font-sfpro'
          >
            {t("participant")}
          </p>
        </div>

        <div
          className='flex items-center gap-1 text-gray-400'
          onClick={() => setOpenParticipant(true)}
        >
          {selectedUsers.length > 0 ? (
            selectedUsers.map((user: IUser, index: number) => (
              <AvatarUser
                key={index}
                image={user.image ? user.image : ""}
                alt={user.name ? user.name : "No user"}
                id={user.telegram_id}
              />
            ))
          ) : (
            <p
              className='font-normal text-[16px] text-customBlack mr-[-10px] font-sfpro'
            >
              {t("appoint")}
            </p>
          )}
          <div className='ml-3'>
            <ArrowRight />
          </div>
        </div>
      </div>
      {openParticipant && (
        <div
          className='bg-black opacity-45 z-10 fixed top-0 w-full h-full'
          onClick={() => {
            setOpenParticipant(false);
            setSelectedUsers([]);
          }}
        ></div>
      )}
      <div
        className={`${
          openParticipant ? "bottom-3" : "bottom-[-100%]"
        } overflow-y-scroll max-h-[70%] z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 pb-16 left-3 right-3 flex flex-col gap-2 scrollbar-hidden`}
      >
        {users.map((user: IUser, index: number) => (
          <div
            key={index}
            onClick={() => {
              setParticipants(user);
            }}
            className={`${
              selectedUsers.some(
                (u: IUser) => u.telegram_id === user.telegram_id,
              )
                ? "bg-gray-100"
                : ""
            }  p-4 rounded-xl flex justify-between items-center`}
          >
            <div className='flex gap-4'>
              <AvatarUser
                image={user.image || ""}
                alt={user.name}
                id={user.telegram_id}
              />
              <div>{user.name}</div>
            </div>
            <div
              className={`${
                selectedUsers.some(
                  (u: IUser) => u.telegram_id === user.telegram_id,
                )
                  ? "border-blue-500"
                  : "border-gray-400"
              } flex justify-center items-center rounded border w-5 h-5`}
            >
              {selectedUsers.some(
                (u: IUser) => u.telegram_id === user.telegram_id,
              ) && <div className='bg-blue-500 w-3 h-3 rounded-sm'></div>}
            </div>
          </div>
        ))}
        <div>
          {openParticipant && (
            <div
              className=' fixed bottom-5 bg-blue-500 text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3'
              onClick={() => setOpenParticipant(false)}
            >
              {t("choose")}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Participant;
