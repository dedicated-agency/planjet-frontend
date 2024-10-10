import { useEffect, useReducer } from "react";

import { AvatarUser } from "./mini/AvatarUser";
import { Avatar } from "./mini/Avatar";
import { Link } from "react-router-dom";
import Archive from "../assets/icons/Archive";
import { Setting } from "../assets/icons/Setting";
import ArrowDown from "../assets/icons/ArrowDown";
import getUsersData from "../common/getUsersData";
import { t } from "i18next";
import { IUser } from "./Comment";
import { IState } from "./ProjectCarusel";

const initialState: IInitState = {
  users: [],
  selectedUsers: [],
  openParticipant: false,
  isAtBottom: false,
};

interface IInitState {
  users: IUser[];
  selectedUsers: IUser[];
  openParticipant: boolean;
  isAtBottom: boolean;
}

interface IStateProp {
  name: string;
  mytasks?: number;
  users: IUser[];
  isAtBottom: boolean,
}

interface IProps {
  state: IStateProp;
  setState: React.Dispatch<Partial<IState>>;
  id: number;
  group_id: number;
}

export const TopProjectBar = (props: IProps) => {
  const { state, setState, id, group_id } = props;
  const [barState, setBarState] = useReducer(
    (state: IInitState, setState: Partial<IInitState>) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  const setParticipants = (user: IUser) => {
    const check = barState.selectedUsers.some(
      (u: IUser) => u.telegram_id === user.telegram_id,
    );
    if (check) {
      setBarState({selectedUsers: barState.selectedUsers.filter((u: IUser) => u.telegram_id !== user.telegram_id)})
    } else {
      setBarState({selectedUsers: [user, ...barState.selectedUsers]});
    }
  };

  useEffect(() => {
    group_id && getUsers();

  }, [group_id]);

  const getUsers = async () => {
    const users = await getUsersData(group_id.toString())
    // @ts-ignore
    setBarState({users: users});
  };
  const updateParticipants = async () => {
    setState({
      selectedUsers: barState.selectedUsers
        .map((user: IUser) => user.telegram_id)
        .join(","),
    });
    setBarState({openParticipant: false});
  };


  return (
    <>
      <header style={{top: (state.isAtBottom) ? "34px": 0}} className='transition-all fixed z-20 h-[56px] bg-white w-full max-w-[700px] mx-auto flex justify-between items-center border-b px-[20px]'>
        <div className='flex items-center text-gray-700 gap-2 cursor-pointer'>
          <Avatar image={""} alt={state.name} radius={8} id={id} />
          <div>
            <p
              className='text-[17px] text-black leading-6'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {state.name}
            </p>
            {state.mytasks ? (
              ""
            ) : (
              <p
                className='text-[13px] text-customGrayDark leading-3'
                style={{ fontFamily: "SF Pro Display" }}
              >
                {state.users && state.users.length} {t('participant')}
              </p>
            )}
          </div>
        </div>
        <div className='flex gap-2 items-center h-full'>
          <div className={state.mytasks ? `hidden` : `relative`}>
            <div
              className='absolute z-10 top-[-16px] right-[83px] border rounded-[25px] min-w-[60px] flex gap-4 items-center p-1 cursor-pointer'
              onClick={() => {
                setState({ selector: false });
                setBarState({openParticipant: true});
              }}
            >
              <div className='flex '>
                {barState.selectedUsers.length === 0 ? (
                  <>
                    {barState.users.length > 3 ? (
                      <>
                        {barState.users.slice(0, 3).map((user: IUser, index: number) => (
                          <AvatarUser
                            key={index}
                            image={user.image ? user.image : ""}
                            alt={user.name}
                            id={user.telegram_id}
                          />
                        ))}
                        <div
                          className={` mr-[-12px] w-[24px] h-[24px] min-w-[24px] min-h-[24px] rounded-full border-[1.5px] border-customWhite2 bg-gray-100 flex justify-center items-center text-customBlack uppercase text-[13px]`}
                        >
                          <p className='relative top-[1px]'>
                            +{barState.users.length - 3 >= 9 ? 9 : barState.users.length - 3}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        {barState.users.map((user: IUser, index: number) => (
                          <AvatarUser
                            key={index}
                            image={user.image ? user.image : ""}
                            alt={user.name}
                            id={user.telegram_id}
                          />
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {barState.selectedUsers.length > 3 ? (
                      <>
                        {barState.selectedUsers
                          .slice(0, 3)
                          .map((user: IUser, index: number) => (
                            <AvatarUser
                              key={index}
                              image={user.image ? user.image : ""}
                              alt={user.name}
                              id={user.telegram_id}
                            />
                          ))}
                        <div
                          className={` mr-[-12px] w-[28px] h-[28px] min-w-[24px] min-h-[24px] rounded-full border-[1.5px] border-customWhite2 bg-gray-100 flex justify-center items-center text-customBlack uppercase text-[13px]`}
                        >
                          +{barState.selectedUsers.length - 3}
                        </div>
                      </>
                    ) : (
                      <>
                        {barState.selectedUsers.map((user: IUser, index: number) => (
                          <AvatarUser
                            key={index}
                            image={user.image ? user.image : ""}
                            alt={user.name}
                            id={user.telegram_id}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
              <div className='text-gray-400'>
                <ArrowDown />
              </div>
            </div>
          </div>
          <Link
            to={`/project/${id}/archive`}
            className='text-[20px] h-full w-[36px] absolute right-[55px] rounded text-gray-300 flex items-center justify-center cursor-pointer'
          >
            <Archive />
          </Link>
          <Link
            to={"/projects/" + id + "/settings"}
            className='text-[28px] h-full w-[36px] absolute right-3 rounded text-gray-300 flex items-center justify-center cursor-pointer'
          >
            <Setting width={28} height={28} fill={"rgba(0, 0, 0, 0.2)"} />
          </Link>
        </div>
      </header>
      <div className='h-[56px] w-full'></div>
      {barState.openParticipant && (
        <div
          className='bg-black opacity-45 z-20 fixed top-0 w-full h-full'
          onClick={() => {
            setBarState({openParticipant: false});
          }}
        ></div>
      )}
      <div
        className={`${
          barState.openParticipant ? "bottom-3" : "bottom-[-100%]"
        } overflow-y-scroll max-h-[70%] z-[100] fixed left-3 right-3 scrollbar-hidden transition-all rounded-[25px] bg-white px-3 py-5 pb-[72px] flex flex-col gap-2`}
      >
        {barState.users.map((user: IUser, index: number) => (
          <div
            key={index}
            onClick={() => {
              setParticipants(user);
            }}
            className={`${
              barState.selectedUsers.some((u: IUser) => u.telegram_id === user.telegram_id)
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
                barState.selectedUsers.some(
                  (u: IUser) => u.telegram_id === user.telegram_id,
                )
                  ? "border-blue-500"
                  : "border-gray-400"
              } flex justify-center items-center rounded border w-5 h-5`}
            >
              {
              barState.selectedUsers.some(
                (u: IUser) => u.telegram_id === user.telegram_id,
              ) && <div className='bg-blue-500 w-3 h-3 rounded-sm'></div>}
            </div>
          </div>
        ))}
        <div>
          {barState.openParticipant && (
            <div className='bg-white rounded-b-[25px] h-[30px] fixed bottom-3 left-3 right-3'>
              <div
                className=' fixed left-6 right-6 bottom-6 bg-custom-gradient-blue text-white flex justify-center items-center py-4 rounded-xl mt-3'
                onClick={() => updateParticipants()}
              >
                {t('choose')}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

