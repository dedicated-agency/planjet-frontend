import { FaRegComment } from "react-icons/fa6";
import { Avatar } from "../components/mini/Avatar";
import languages from "../local/languages.json";
import { useContext, useEffect, useReducer } from "react";
import { StateContext } from "../context/StateContext";
import { dateTimeConverter } from "../common/dateTimeConverter";
import { AvatarUser } from "../components/mini/AvatarUser";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { fetchData } from "../common/fetchData";
import { Loader } from "../components/mini/Loader";
import WebApp from "@twa-dev/sdk";
import axiosClient from "../common/axiosClient";
import { IoTrash } from "react-icons/io5";
import { TbArrowBarUp } from "react-icons/tb";
import CommentAndEvent from "../components/CommentAndEvent";
import StatusSelector from "../components/StatusSelector";
import Calendar from "../assets/icons/Calendar";
import User from "../assets/icons/User";
import Users from "../assets/icons/Users";
import ArrowRight from "../assets/icons/ArrowRight";
import Prioritet from "../assets/icons/Prioritet";
import SymbolB from "../assets/icons/SymbolB";
import Square from "../assets/icons/Square";

import imageCacheChacker from "../common/imagesCacher";

const getTask = async (id: number) => {
  try {
    return await fetchData("/task/show/" + id, {});
  } catch (error) {
    console.log("Get task error: " + error);
  }
};

const getStatuses = async (id: number) => {
  try {
    return await fetchData("/status/" + id, {});
  } catch (error) {
    console.log("getStatuses error: " + error);
  }
};

const initialState = {
  users: [],
  user: null,
  comments: [],
  events: [],
  // selector: 'event',
  selector: "comment",
  commentText: "",
  commentInput: false,
  is_mobile: false,
  participants: [],
  confirmationInput: "",
  isOpenDelete: false,
  isOpenComment: true,
  openParticipant: false,
  selectStatus: null,
  selectedUsers: [],
  selectPriority: null,
};

export const Task = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  useEffect(() => {
    WebApp.setHeaderColor("#FFFFFF");
  }, []);

  const locales: any = languages;
  const { id } = useParams();
  const { lang, user, capitalizeFirstLetter, availableUserImages, setContextState } = useContext(StateContext);
  const navigate = useNavigate();

  const setParticipants = (user: any) => {
    const check = state.selectedUsers.some(
      (u: any) => u.telegram_id === user.telegram_id,
    );
    if (check) {
      setState({selectedUsers: state.selectedUsers.filter((u: any) => u.telegram_id !== user.telegram_id)})
    } else {
      setState({selectedUsers: [user, ...state.selectedUsers]});
    }
  };

  const [state, setState] = useReducer(
    (state: any, setState: any) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  const {
    data: task,
    error,
    isLoading,
  } = useQuery(["taskData", id], () => getTask(Number(id)));

  const { data: statuses } = useQuery(
    ["statusData", task && task.project_id],
    () => getStatuses(Number(task?.project_id)),
  );

  useEffect(() => {
    if (task) getUsers();
  }, [task]);

  const getUsers = async () => {
    if (!task) return;

    const getUserImages = async (usersArray: any[]) => {
      return await Promise.all(
        usersArray.map(async (user: any) => {
          user.image = await imageCacheChacker(user.telegram_id, availableUserImages, setContextState);
          return user;
        })
      );
    };

    const user = { ...task.user };
    user.image = await imageCacheChacker(task.user.telegram_id, availableUserImages, setContextState);
  
    const selectedUsersPromise = task.taskUser.length
    ? getUserImages(task.taskUser.map((taskUser: any) => taskUser.user))
    : Promise.resolve([]);

  const participantsPromise = task.users.length
    ? getUserImages(task.users)
    : Promise.resolve([]);

  const commentsPromise = task.taskComment.length
    ? getUserImages(task.taskComment)
    : Promise.resolve([]);

  const eventsPromise = task.taskChange.length
    ? getUserImages(task.taskChange.map((taskChange: any) => ({ ...taskChange, telegram_id: taskChange.user_id })))
    : Promise.resolve([]);

    const [selectedUsers, participants, comments, events] = await Promise.all([
      selectedUsersPromise,
      participantsPromise,
      commentsPromise,
      eventsPromise,
    ]);

    const details = navigator.userAgent;
    const isMobileDevice = /android|iphone|kindle|ipad/i.test(details);
  
    const data = {
      user,
      selectedUsers,
      comments,
      events,
      participants,
      is_mobile: isMobileDevice,
    };

    setState(data);
  };

  const queryClient = useQueryClient();

  const updateStatus = async (status: number) => {
    try {
      const response = await axiosClient.put("/task/" + task.id + "/status", {
        status,
      });
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ["taskData"],
        });
      }
    } catch (error) {
      console.log("Update status error");
    }
  };

  const updatePriority = async (priority: number) => {
    try {
      const response = await axiosClient.put("/task/" + task.id + "/priority", {
        priority,
      });
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ["taskData"],
        });
      }
    } catch (error) {
      console.log("Update status error");
    }
  };

  const deleteTask = async () => {
    try {
      const response = await axiosClient.delete(`/task/${id}`);
      if (response) {
        navigate("/projects/" + task.project_id);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const archiveTask = async () => {
    let text = locales[lang].send_archive;
    if (task.is_archive) {
      text = locales[lang].de_archiving;
    }
    if (confirm(text)) {
      try {
        const response = await axiosClient.put(`/task/${id}/archive`, {
          archive: Boolean(!task.is_archive),
        });
        if (response) {
          queryClient.invalidateQueries({
            queryKey: ["taskData"],
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const updateParticipants = async () => {
    const response = await axiosClient.put("/task/" + id + "/participant", {
      participant: state.selectedUsers.map((user: any) => user.telegram_id),
    });

    if (response) {
      setState({ openParticipant: false });
      queryClient.invalidateQueries({
        queryKey: ["taskData"],
      });
    }
  };

  if (isLoading) return <Loader />;
  // @ts-ignore
  if (error) return <div>An error occurred: {error.message}</div>;

  const capitalizeFirstChar = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <div className='fixed z-20 top-0 left-0 right-0 flex justify-between h-[56px] items-center bg-white p-3 shadow-custom'>
        <Link to={"/projects/" + task.project_id} className='w-[60px] flex'>
          <Avatar image={""} alt={task.project?.name} radius={8} width={36} id={task.project?.id} />
        </Link>
        <p
          className='font-medium text-[17px] text-black'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {capitalizeFirstLetter(task.project?.name)}
        </p>
        <div className='text-gray-500 h-full w-[60px] flex items-center'></div>
      </div>
      <div className='h-[56px]'></div>
      <div className='p-3 pt-[12px] flex flex-col gap-[12px]'>
        <div className='shadow-customShadow rounded-[16px] bg-white p-[16px]'>
          <div className='flex gap-[10px]'>
            <div className='relative top-[2px]'>
              <Square />
            </div>
            <p
              className='font-semibold text-[17px] text-black whitespace-pre-line'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {capitalizeFirstChar(task.name)}
            </p>
          </div>
          {task.description && (
            <p
              className='text-[14px] text-customBlackLight mt-2 font-normal whitespace-pre-line'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {task.description}
            </p>
          )}

          {/* Images */}

          {/* <div className='flex flex-wrap p-[4px] shadow-customCombined rounded-[16px] gap-[2px] mt-[10px]'>
            <div className='w-[30%] min-w-[100px] flex-1 rounded-[12px] overflow-hidden'>
              <img src={img} alt='' className='w-[100%]' />
            </div>
            <div className='w-[30%] min-w-[100px] flex-1 rounded-[12px] overflow-hidden'>
              <img src={img} alt='' className='w-[100%]' />
            </div>
            <div className='w-[30%] min-w-[100px] flex-1 rounded-[12px] overflow-hidden'>
              <img src={img} alt='' className='w-[100%]' />
            </div>
            <div className='w-[30%] min-w-[100px] flex-1 rounded-[12px] overflow-hidden'>
              <img src={img} alt='' className='w-[100%]' />
            </div>
            <div className='w-[30%] min-w-[100px] flex-1 rounded-[12px] overflow-hidden'>
              <img src={img} alt='' className='w-[100%]' />
            </div>
          </div> */}
        </div>
        <div className='shadow-customShadow rounded-[16px] bg-white px-3'>
          <div className='flex justify-between items-center p-2 h-[44px]'>
            <div className='flex justify-between items-center gap-[16px]'>
              <div className='text-gray-400'>
                <Calendar />
              </div>
              <p
                className='text-black font-normal text-[16px]'
                style={{ fontFamily: "SF Pro Display " }}
              >
                {locales[lang].created_at}
              </p>
            </div>
            <p
              className='text-black font-medium text-[15px]'
              style={{ fontFamily: "SF Pro Display " }}
            >
              {task.created_at &&
                dateTimeConverter.convertTime(task.created_at)}
            </p>
          </div>
          <div className='flex justify-between items-center p-2 h-[44px]'>
            <div className='flex justify-between items-center gap-[16px]'>
              <div className='text-gray-400'>
                <User />
              </div>
              <p
                className='text-black font-normal text-[16px]'
                style={{ fontFamily: "SF Pro Display " }}
              >
                {locales[lang].author}
              </p>
            </div>
            <div className='pr-3'>
              <AvatarUser
                image={state.user && state.user.image}
                alt={task.user ? task.user.name : "No user"}
                id={task.user.telegram_id}
              />
            </div>
          </div>
          <div
            className='flex justify-between items-center p-2 h-[44px]'
            onClick={() => setState({openParticipant: true})}
          >
            <div className='flex justify-between items-center gap-[16px]'>
              <div className='text-gray-400'>
                <Users />
              </div>
              <p
                className='text-black font-normal text-[16px] ml-[-5px]'
                style={{ fontFamily: "SF Pro Display " }}
              >
                {capitalizeFirstLetter(locales[lang].participant)}
              </p>
            </div>
            <div className='flex items-center gap-[8px]'>
              <div className='rounded-[16px] flex gap-4 items-center cursor-pointer pr-3'>
                <div className='flex '>
                  {state.selectedUsers.length > 0 ? (
                    state.selectedUsers.map((user: any, index: number) => (
                      <AvatarUser
                        key={index}
                        image={user.image}
                        alt={user.name}
                        id={user.telegram_id}
                      />
                    ))
                  ) : (
                    <AvatarUser
                      image={state.user && state.user.image}
                      alt={task.user ? task.user.name : "No user"}
                      id={task.user.telegram_id}
                    />
                  )}
                </div>
              </div>
              <ArrowRight />
            </div>
          </div>
          {task.point ? (
            <div className='flex justify-between items-center p-2 h-[44px]'>
              <div className='flex justify-between items-center gap-[16px]'>
                <div className='text-gray-400'>
                  <Calendar />
                </div>
                <p
                  className='text-black font-normal text-[16px]'
                  style={{ fontFamily: "SF Pro Display " }}
                >
                  {locales[lang].story_point}
                </p>
              </div>
              <div className='pr-3'>
                <p className='font-bold font-sans text-sm'>{task.point}</p>
              </div>
            </div>
          ) : (
            ""
          )}
          {/* <div className="flex justify-between items-center p-2">
                    <div className="flex justify-between items-center gap-2">
                        <div className="text-gray-400">
                            <BsCalendar3 />
                        </div>
                        <p className="text-gray-400 font-bold font-sans">{locales[lang].deadline}</p>
                    </div>
                    <p className="font-bold font-sans">{ task.created_at && dateTimeConverter.convert(task.created_at)}</p>
                </div> */}
          {/* <div className="flex justify-between items-center p-2">
                    <div className="flex justify-between items-center gap-2">
                        <div className="text-gray-400">
                            <FaLink />
                        </div>
                        <p className="text-gray-400 font-bold font-sans">{locales[lang].file}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-300 text-white flex justify-center items-center text-sm">0</div>
                        <div className="text-gray-500">
                            <FaAngleDown />
                        </div>
                    </div>
                </div> */}
        </div>
        <div className='shadow-customShadow rounded-[16px] bg-white p-3'>
          <div className='flex justify-between items-center p-2'>
            <div className='flex justify-between items-center gap-[16px]'>
              <div className='flex gap-[1px] items-end justify-center'>
                <Prioritet />
              </div>
              <p
                className='text-black font-normal text-[16px]'
                style={{ fontFamily: "SF Pro Display" }}
              >
                {capitalizeFirstLetter(locales[lang].priority)}
              </p>
            </div>
            <div
              onClick={() => setState({selectPriority: task.priority})}
              className={`text-customBlackLight text-[15px] flex items-center gap-[4px] font-sans font-normal ${
                task.priority === 3
                  ? "bg-[#FDD3D0]"
                  : task.priority === 2
                  ? "bg-[#FFE8A3]"
                  : "bg-[#AFF4C6]"
              } rounded-[8px] px-[12px] py-[4px]`}
            >
              {locales[lang].priority_data[task.priority]}
              <ArrowRight />
            </div>
          </div>
          <div className='flex justify-between items-center p-2'>
            <div className='flex justify-between items-center gap-[16px]'>
              <div>
                <SymbolB />
              </div>
              <div
                className='text-black font-normal text-[16px]'
                style={{ fontFamily: "SF Pro Display " }}
              >
                {locales[lang].status}
              </div>
            </div>
            <div
              onClick={() => setState({selectStatus: task.status.id})}
              className={`text-customBlackLight text-[15px] flex items-center gap-[4px] font-sans font-normal ${
                task.status.name == "To do"
                  ? "bg-[#F2F2F7]"
                  : task.status.name == "In Progress"
                  ? "bg-[#007AFF26]"
                  : task.status.name == "Testing"
                  ? "bg-[#FDD3D0]"
                  : task.status.name == "Completed"
                  ? "bg-[#AFF4C6]"
                  : "bg-[#F2F2F7]"
              } rounded-[8px] px-[12px] py-[4px]`}
            >
              {task.status.name}
              <ArrowRight />
            </div>
          </div>
        </div>

        <div
          className='shadow-customShadow rounded-[16px] bg-white py-[14px] px-4'
          style={
            state.commentInput
              ? Number(user.id) === Number(task.user_id)
                ? { paddingBottom: "300px" }
                : { paddingBottom: "350px" }
              : {}
          }
        >
          <div
            className='flex justify-between items-center px-2'
            onClick={() => setState({isOpenComment: !state.isOpenComment})}
          >
            <div className='transition-all flex justify-between items-center gap-2'>
              <div className='flex gap-[1px] items-end justify-center text-gray-400'>
                <FaRegComment />
              </div>
              <p className='text-gray-400 font-bold font-sans'>
                {locales[lang].comments_and_events}
              </p>
            </div>
            <div className='transition-all flex items-center gap-3'>
              <div
                className={`${
                  (task.taskChange.length + task.taskComment.length).toString()
                    .length === 1 && "w-[20px] h-[20px]"
                } w-auto text-blue-500 text-sm font-sans font-bold bg-blue-200 rounded-full py-[3px] px-[6px] flex justify-center items-center`}
              >
                {task.taskChange.length + task.taskComment.length}
              </div>
              <div
                className={`${
                  state.isOpenComment && "rotate-90"
                } text-gray-400 duration-200`}
              >
                <ArrowRight />
              </div>
            </div>
          </div>
          {state.isOpenComment && (
            <>
              <div className='bg-gray-100 flex p-1 rounded-full mt-[25px]'>
                <div
                  onClick={() => setState({ selector: "comment" })}
                  className={` ${
                    state.selector === "comment"
                      ? " bg-blue-200 text-blue-500"
                      : "text-gray-400"
                  } transition w-[50%] capitalize rounded-full text-center text-sm font-sans font-bold py-1 cursor-pointer`}
                >
                  {locales[lang].comments} {task.taskComment.length}
                </div>
                <div
                  onClick={() => setState({ selector: "event" })}
                  className={` ${
                    state.selector === "event"
                      ? "bg-blue-200 text-blue-500"
                      : "text-gray-400"
                  } transition w-[50%] capitalize  rounded-full text-center text-sm font-sans font-bold py-1 cursor-pointer`}
                >
                  {locales[lang].events} {task.taskChange.length}
                </div>
              </div>
              <CommentAndEvent
                setState={setState}
                state={state}
                queryClient={queryClient}
              />
            </>
          )}
        </div>

        {Number(user.id) === Number(task.user_id) && (
          <div className='flex mt-5 gap-3'>
            <div
              onClick={() => setState({isOpenDelete: true})}
              className='w-full h-[55px] bg-gray-300 rounded-xl text-gray-500 flex flex-col justify-center items-center'
            >
              <div>
                <IoTrash size={20} />
              </div>
              <p className='text-[12px]'>{locales[lang].delete}</p>
            </div>
            <div
              onClick={archiveTask}
              className='w-full h-[55px] bg-gray-300 rounded-xl text-gray-500 flex flex-col justify-center items-center'
            >
              <div>
                <TbArrowBarUp size={20} />
              </div>
              <p className='text-[12px]'>{locales[lang].archive}</p>
            </div>
          </div>
        )}
      </div>
      {statuses && (
        <StatusSelector
          selectStatus={state.selectStatus}
          setSelectStatus={setState}
          statuses={statuses}
          updateStatus={updateStatus}
        />
      )}

      {state.selectPriority && (
        <div
          className='transition-all bg-black opacity-45 z-10 fixed top-0 w-full h-full'
          onClick={() => setState({selectPriority: null})}
        ></div>
      )}
      <div
        className={`${
          state.selectPriority ? "bottom-3" : "bottom-[-100%]"
        }  z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 right-3 left-3 flex flex-col gap-2`}
      >
        {priorities.map((priority: any, index: number) => (
          <div
            onClick={() => {
              updatePriority(index + 1);
              setState({selectPriority: null});
            }}
            key={index}
            className={`${
              index + 1 === state.selectPriority ? "bg-gray-100" : ""
            }  p-4 rounded-xl flex justify-between items-center`}
          >
            <div className='flex gap-4'>
              <div
                className={index + 1 === state.selectPriority ? "text-blue-600" : ""}
              >
                {priority[lang]}
              </div>
            </div>
            <div
              className={`${
                index + 1 === state.selectPriority
                  ? "border-blue-500"
                  : "border-gray-400"
              } flex justify-center items-center rounded border w-5 h-5`}
            >
              {index + 1 === state.selectPriority && (
                <div className='bg-blue-500 w-3 h-3 rounded-sm'></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {state.openParticipant && (
        <div
          className='bg-black opacity-45 z-10 fixed top-0 w-full h-full'
          onClick={() => {
            setState({openParticipant: false});
          }}
        ></div>
      )}
      <div
        className={`${
          state.openParticipant ? "bottom-3" : "bottom-[-100%]"
        } overflow-y-scroll max-h-[70%] z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 pb-[60px] mb-[10px] left-3 right-3 flex flex-col gap-2 scrollbar-hidden`}
      >
        {
          state.participants.length > 0 ?
          state.participants.map((user: any, index: number) => (
            <div
              key={index}
              onClick={() => {
                setParticipants(user);
              }}
              className={`${
                state.selectedUsers.some(
                  (u: any) => u.telegram_id === user.telegram_id,
                ) 
                  ? "bg-gray-100"
                  : ""
              }  p-4 rounded-xl flex justify-between items-center`}
            >
              <div className='flex gap-[27px]'>
                <AvatarUser
                  image={user.image}
                  alt={user.name}
                  id={user.telegram_id}
                />
                <div>{user.name}</div>
              </div>
              <div
                className={`${
                  state.selectedUsers.some((u: {telegram_id: number}) => u.telegram_id === user.telegram_id)
                    ? "border-blue-500"
                    : "border-gray-400"
                } flex justify-center items-center rounded border w-5 h-5`}
              >
                {
                  state.selectedUsers.some((u: {telegram_id: number}) => u.telegram_id === user.telegram_id) ? 
                  <div className='bg-blue-500 w-3 h-3 rounded-sm'></div> 
                  : ""
                }
              </div>
            </div>
          )) : <Loader/>
        }
        <div>
          {state.openParticipant && (
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
      {state.isOpenDelete && (
        <div
          className='transition-all bg-black opacity-45 z-10 fixed top-0 w-full h-full'
          onClick={() => setState({isOpenDelete: true})}
        ></div>
      )}
      <div
        className={`${
          state.isOpenDelete ? "bottom-3" : "bottom-[-100%]"
        }  z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 right-3 left-3 flex flex-col gap-2`}
      >
        <div className='w-full h-[56px] py-[6px] px-[18px] bg-[#F2F2F7] rounded-[16px]'>
          <input
            type='text'
            placeholder='Type to here'
            className='w-full h-full bg-transparent outline-none border-none'
            value={state.confirmationInput}
            onChange={(e: any) => setState({confirmationInput: e.target.value})}
          />
        </div>
        <p
          className='text-[16px] font-normal text-customGrayDark px-3 mt-2 leading-4'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {locales[lang].delete_confirmation}
        </p>
        <div>
          {state.isOpenDelete && (
            <div className='flex gap-[16px]'>
              <div
                className='w-[50%] bottom-[22px] bg-custom-gradient-blue text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 capitalize'
                onClick={() => {
                  setState({confirmationInput: '', isOpenDelete: false})
                }}
              >
                {locales[lang].cancel}
              </div>

              {state.confirmationInput === "I'm Sure" ? (
                <div
                  className='w-[50%] bottom-[22px] bg-[#FF3B30] text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 cursor-pointer'
                  onClick={() => deleteTask()}
                >
                  {locales[lang].delete}
                </div>
              ) : (
                <div className='w-[50%] bottom-[22px] bg-[#FDD3D0] text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3 cursor-pointer'>
                  {locales[lang].delete}
                </div>
              )}
              {/* <div
                className='w-[50%] bottom-[22px] bg-[#FF3B30] text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3'
                // onClick={() => {
                //   setSelectStoryPoint(storyPoint);
                //   setOpenStoryPoint(false);
                // }}
              >
                {locales[lang].delete}
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const priorities = [
  {
    uz: "Past",
    ru: "Низкий",
    en: "Low",
  },
  {
    uz: "O'rta",
    ru: "Средний",
    en: "Medium",
  },
  {
    uz: "Yuqori",
    ru: "Высокий",
    en: "High",
  },
];
