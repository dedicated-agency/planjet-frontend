import { t } from "i18next";
import { IUser } from "../../components/Comment";
import { AvatarUser } from "../../components/mini/AvatarUser";

const Participant = ({
  openParticipant,
  setOpenParticipant,
  setSelectedUsers,
  users,
  setParticipants,
  selectedUsers
}: any) => {
  return (
    <>
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
