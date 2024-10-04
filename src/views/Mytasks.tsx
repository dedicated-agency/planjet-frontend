import WebApp from "@twa-dev/sdk";
import { useContext, useEffect, useReducer, useState } from "react";
import "../components/carusel.css";
import { useSwipeable } from "react-swipeable";
import { StateContext } from "../context/StateContext";
import languages from "../local/languages.json";
import axiosClient from "../common/axiosClient";
import SymbolBorder from "../assets/icons/SymbolBorder";
import MyTask from "../components/MyTask";
import ArrowRight from "../assets/icons/ArrowRight";

type Status = {
  id: number;
  name: string;
  count: number;
};

const initialState = {
  statuses: [],
  tasks: [],
  index: 0,
  name: "",
  users: [],
  currectUser: 0,
  selector: true,
  mytasks: true,
};

export const Mytasks = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());

  const { lang, capitalizeFirstLetter } = useContext(StateContext);
  const locales: any = languages;
  const [isOpenProject, setIsOpenProject] = useState(false);

  const [state, setState] = useReducer(
    (state: any, setState: any) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  const [status, setStatus] = useState("To do");
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [tasks, setTasks] = useState([]);

  const fetchMyTaskHeader = async () => {
    try {
      const response = await axiosClient.get("/user/tasks/header");
      setStatuses(response.data);
    } catch (err) {
      console.log("Statuslarni olishda xatolik");
    }
  };

  const fetchMyTasks = async (status: string) => {
    try {
      const response = await axiosClient.get(`/user/tasks?status=${status}`);
      setTasks(response.data);
    } catch (err) {
      console.log("Vazifalarni olishda xatolik");
    }
  };

  useEffect(() => {
    fetchMyTaskHeader();
  }, []);

  useEffect(() => {
    fetchMyTasks(status);
  }, [status]);

  const handleSwipe = (direction: any) => {
    if (direction === "LEFT" && state.index < statuses.length - 1) {
      setState({ index: state.index + 1 });
      setStatus(statuses[state.index + 1]?.name);
    } else if (direction === "RIGHT" && state.index > 0) {
      setState({ index: state.index - 1 });
      setStatus(statuses[state.index - 1]?.name);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("LEFT"),
    onSwipedRight: () => handleSwipe("RIGHT"),
    trackMouse: true,
  });

  useEffect(() => {
    WebApp.setHeaderColor("#FFFFFF");
    setState({ name: locales[lang].my_tasks });
  }, []);
  return (
    <div>
      {/* <TopProjectBar state={state} setState={setState} /> */}
      <div className='h-[72px]'></div>
      <div className='w-full h-[72px] fixed z-10 top-0 flex justify-between items-center py-[4px] px-[16px] bg-white'>
        <div className='flex items-center gap-[16px]'>
          <SymbolBorder />
          <div>
            <p
              className='text-[17px] font-medium text-black leading-5'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {locales[lang].my_tasks}
            </p>
          </div>
        </div>
        <div
          className='flex items-center border-[.5px] border-[#E1E8F5] rounded-[25px] p-[4px] pl-[10px] pr-[7px] gap-[6px] cursor-pointer'
          onClick={() => setIsOpenProject(true)}
        >
          <p
            className='text-[14px] font-[300] text-customBlack'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {capitalizeFirstLetter(locales[lang].project)}
          </p>
          <ArrowRight className={"rotate-90"} />
        </div>
      </div>
      <div className='h-[44px]'></div>
      {statuses?.length > 0 && (
        <>
          <div className='flex h-[44px] w-full overflow-x-scroll border-b border-t bg-white px-2 scroll-smooth status-list fixed top-[72px] right-0 left-0 z-10'>
            {statuses?.map((status: any, index: number) => (
              <div
                key={index}
                className={`flex h-full items-center gap-2 px-4 cursor-pointer ${
                  state.index === index ? "mytasks_nav" : ""
                }`}
                onClick={() => {
                  setStatus(status.name);
                  setState({ index });
                }}
              >
                <>
                  <p
                    className={`text-sm whitespace-nowrap ${
                      state.index === index
                        ? "text-gradient-blue"
                        : "text-customBlack"
                    } font-bold`}
                    style={{ fontFamily: "SF Pro Display" }}
                  >
                    {capitalizeFirstLetter(status.name)}
                  </p>
                  <p
                    className={`text-[12px] rounded-3xl ${
                      state.index === index
                        ? "bg-custom-gradient-blue"
                        : "bg-customBlack"
                    } text-white px-[6px] `}
                    style={{ fontFamily: "SF Pro Display" }}
                  >
                    {status.count}
                  </p>
                </>
              </div>
            ))}
          </div>
        </>
      )}

      <div
        {...handlers}
        style={{ touchAction: "pan-y" }}
        className='carusel-heighter'
      >
        <div className='flex flex-col px-4 h-full items-center justify-start'>
          {tasks?.length > 0 ? (
            tasks?.map((task: any) => (
              <>
                <MyTask key={task.id} project={task} />
              </>
            ))
          ) : (
            <div className='mt-5 text-gray-400'>
              {locales[lang].no_task_yet}
            </div>
          )}
        </div>
      </div>
      {isOpenProject && (
        <div
          className='bg-black opacity-45 z-10 fixed top-0 w-full h-full'
          onClick={() => {
            setIsOpenProject(false);
          }}
        ></div>
      )}
      <div
        className={`${
          isOpenProject ? "bottom-3" : "bottom-[-100%]"
        } overflow-y-scroll max-h-[70%] z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 mb-[10px] left-3 right-3 flex flex-col gap-2 scrollbar-hidden`}
      >
        {/* {participants.map((user: any, index: number) => (
          <div
            key={index}
            onClick={() => {
              setParticipants(user);
            }}
            className={`${
              selectedUsers.some(
                (u: any) => u.telegram_id === user.telegram_id,
              ) ||
              state.users.some((u: any) => u.telegram_id === user.telegram_id)
                ? "bg-gray-100"
                : ""
            }  p-4 rounded-xl flex justify-between items-center`}
          >
            <div className='flex gap-[27px]'>
              <AvatarUser image={user.image} alt={user.name} />
              <div>{user.name}</div>
            </div>
            <div
              className={`${
                selectedUsers.some(
                  (u: any) => u.telegram_id === user.telegram_id,
                ) ||
                state.users.some((u: any) => u.telegram_id === user.telegram_id)
                  ? "border-blue-500"
                  : "border-gray-400"
              } flex justify-center items-center rounded border w-5 h-5`}
            >
              {(selectedUsers.some(
                (u: any) => u.telegram_id === user.telegram_id,
              ) ||
                state.users.some(
                  (u: any) => u.telegram_id === user.telegram_id,
                )) && <div className='bg-blue-500 w-3 h-3 rounded-sm'></div>}
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};
