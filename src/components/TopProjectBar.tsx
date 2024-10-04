import { useContext, useEffect, useReducer } from "react";
import { StateContext } from "../context/StateContext";
import languages from "../local/languages.json";

import { AvatarUser } from "./mini/AvatarUser";
import { Avatar } from "./mini/Avatar";
import { Link } from "react-router-dom";
import Archive from "../assets/icons/Archive";
import { Setting } from "../assets/icons/Setting";
import ArrowDown from "../assets/icons/ArrowDown";
import imageCacheChacker from "../common/imagesCacher";

const initialState = {
  users: [],
  selectedUsers: [],
  openParticipant: false,
};


export const TopProjectBar = (props: any) => {
  const { state, setState, id } = props;
  const { lang, availableUserImages, setContextState } = useContext(StateContext);
  const locales: any = languages;

  const [barState, setBarState] = useReducer(
    (state: any, setState: any) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  const setParticipants = (user: any) => {
    const check = barState.selectedUsers.some(
      (u: any) => u.telegram_id === user.telegram_id,
    );
    if (check) {
      setBarState({selectedUsers: barState.selectedUsers.filter((u: any) => u.telegram_id !== user.telegram_id)})
    } else {
      setBarState({selectedUsers: [user, ...barState.selectedUsers]});
    }
  };

  useEffect(() => {
    if(state.users.length) getUsers();
  }, [state.users.length]);

  const getUsers = async () => {
    const result = await Promise.all(
      state.users.map(async (user: any) => {
        const image = await imageCacheChacker(user.telegram_id, availableUserImages, setContextState);
        return { ...user, image }
    })
  );
    // @ts-ignore
    setBarState({users: result});
  };
  const updateParticipants = async () => {
    setState({
      selectedUsers: barState.selectedUsers
        .map((user: any) => user.telegram_id)
        .join(","),
    });
    setBarState({openParticipant: false});
  };

  return (
    <>
      <header className='fixed z-20 h-[56px] bg-white w-full top-0 max-w-[700px] mx-auto flex justify-between items-center border-b px-[20px]'>
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
                {state.users && state.users.length} {locales[lang].participant}
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
                        {barState.users.slice(0, 3).map((user: any, index: number) => (
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
                        {barState.users.map((user: any, index: number) => (
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
                          .map((user: any, index: number) => (
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
                        {barState.selectedUsers.map((user: any, index: number) => (
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
        {barState.users.map((user: any, index: number) => (
          <div
            key={index}
            onClick={() => {
              setParticipants(user);
            }}
            className={`${
              barState.selectedUsers.some((u: any) => u.telegram_id === user.telegram_id)
                ? "bg-gray-100"
                : ""
            }  p-4 rounded-xl flex justify-between items-center`}
          >
            <div className='flex gap-4'>
              <AvatarUser
                image={user.image}
                alt={user.name}
                id={user.telegram_id}
              />
              <div>{user.name}</div>
            </div>
            <div
              className={`${
                barState.selectedUsers.some(
                  (u: any) => u.telegram_id === user.telegram_id,
                )
                  ? "border-blue-500"
                  : "border-gray-400"
              } flex justify-center items-center rounded border w-5 h-5`}
            >
              {
              barState.selectedUsers.some(
                (u: any) => u.telegram_id === user.telegram_id,
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
                {locales[lang].choose}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
