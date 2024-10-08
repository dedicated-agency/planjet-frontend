import { useEffect, useRef, useState } from "react";
import { AvatarUser } from "../components/mini/AvatarUser";
import { useGetTasks } from "../common/fetchTasks";
import { Loader } from "../components/mini/Loader";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../common/axiosClient";
import WebApp from "@twa-dev/sdk";
import ArrowRight from "../assets/icons/ArrowRight";
import Calendar from "../assets/icons/Calendar";
import User from "../assets/icons/User";
import Prioritet from "../assets/icons/Prioritet";
import Square from "../assets/icons/Square";
import File from "../assets/icons/File";
import { Avatar } from "../components/mini/Avatar";
import getUsersData from "../common/getUsersData";
import { t } from "i18next";
import { useUserContext } from "../context/UserContext";
import { IUser } from "../components/Comment";
import { useForm } from "react-hook-form";

export interface IPriority {
  uz: string;
  ru: string;
  en: string;
}

interface FormValues {
  name: string;
  description: string;
}

const priorities = [
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

// const getGroups = async () => {
//   return await fetchData("/user/groups", {});
// };

const CreateTaskFromGroup = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  useEffect(() => {
    WebApp.setHeaderColor("#F2F2F7");
  }, []);
  const navigate = useNavigate();
  const { project_id } = useParams();
  const {user} = useUserContext();
  const lang = user.lang;
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const handleChange = (event: any) => {
    setText(event.target.value);
  }
  const { lang, user } = useContext(StateContext);
  // const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const handleChange = () => {
    adjustTextareaHeight();
  };
  const [selectPriority, setSelectPriority] = useState<number>(2);
  const [openPriority, setOpenPriority] = useState(false);
  const [openParticipant, setOpenParticipant] = useState(false);
  const [openStoryPoint, setOpenStoryPoint] = useState(false);
  const [selectStoryPoint, setSelectStoryPoint] = useState(0);
  const [storyPoint, setStoryPoint] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  // const [name, setName] = useState("");
  const [focusStoryPoint, setFocusStoryPoint] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  // const { data: groups } = useQuery(["groupsData"], () => getGroups());

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
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

  const {
    data: project,
    isLoading,
    error,
  } = useGetTasks(
    {
      user_id: user.telegram_id,
    },
    Number(project_id),
  );
  useEffect(() => {
    if (project) {
      getUsers();
    }
  }, [project, project_id]);

  const getUsers = async () => {
    const result = await getUsersData(project.group_id);
    console.log({ result });
    // @ts-ignore
    setUsers(result);
  };

  // const createTask = async () => {
  //   const data = {
  //     project_id: project_id,
  //     name,
  //     description: text,
  //     priority: selectPriority,
  //     participant: selectedUsers.map((user: IUser) => user.telegram_id),
  //     point: selectStoryPoint,
  //   };

  //   const response = await axiosClient.post("/task/create", data);
  //   if (response) {
  //     navigate("/tasks/" + response.data.id);
  //   }
  // };

  const onSubmit = async (data: any) => {
    console.log(data);

    const taskData = {
      project_id,
      name: data.name,
      description: data.description,
      priority: selectPriority,
      participant: selectedUsers.map((user: IUser) => user.telegram_id),
      point: selectStoryPoint,
    };

    const response = await axiosClient.post("/task/create", taskData);
    if (response) {
      navigate("/tasks/" + response.data.id);
    }
  };

  if (isLoading) return <Loader />;
  // @ts-ignore
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <>
      <div className='fixed top-0 left-0 right-0 flex justify-between h-[56px] items-center bg-[#f2f2f7] p-3'>
        <div className='text-gray-500 h-full w-[60px] flex items-center'></div>
        <div>{"Create"}</div>
        <div className='text-gray-500 h-full w-[60px] flex items-center justify-end'></div>
      </div>
      <div className='h-[56px]'></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='p-3'>
          {/* Input */}
          <div className='bg-white shadow-customShadow rounded-xl p-3 pb-2'>
            <div className='flex items-center gap-[8px]'>
              <div className={"relative top-[-4px]"}>
                <Square />
              </div>
              <input
                type='text'
                placeholder='Task name'
                {...register("name", { required: "Task name is required" })}
                className='w-full outline-none font-sans mb-2'
              />
            </div>
            {errors.name && (
              <p className='text-xs relative top-[-6px] h-3 text-red-500'>
                {errors.name?.message}
              </p>
            )}
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              onChange={handleChange}

              ref={textareaRef}
              placeholder='Description'
              rows={1}
              style={{
                overflow: "hidden",
                resize: "none",
              }}
              className='text-[14px] font-sans text-gray-500 w-full outline-none'
            />
            {errors.name && (
              <p className='text-xs relative top-[-6px] h-3 text-red-500'>
                {errors.description?.message}
              </p>
            )}
          </div>

          {/* Task */}
          <div className='h-[44px] flex justify-between items-center px-[16px] bg-white mt-5 rounded-xl cursor-pointer'>
            <div className='flex justify-between items-center gap-2'>
              <div className='text-gray-400'>
                <File />
              </div>
              <p
                className='text-black tex-[16px] font-normal font-sans capitalize'
                style={{ fontFamily: "SF Pro Display" }}
              >
                {t("project")}
              </p>
            </div>

            <div className='flex items-center gap-1 text-gray-400'>
              <p
                className='text-[16px] font-normal text-[#1B1F26]'
                style={{ fontFamily: "SF Pro Display" }}
              >
                {project.name}
              </p>
              <Avatar
                image={""}
                alt={project?.name}
                width={24}
                radius={4}
                id={project?.id}
              />
            </div>
          </div>

          <div className='bg-white shadow-customShadow rounded-xl mt-5 cursor-pointer'>
            {/* Participant */}
            <div className='h-[44px] flex justify-between items-center px-[16px]'>
              <div className='flex justify-between items-center gap-2'>
                <div className='text-gray-400'>
                  <User />
                </div>
                <p
                  className='text-black tex-[16px] font-normal font-sans capitalize'
                  style={{ fontFamily: "SF Pro Display" }}
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
                    className='font-normal text-[16px] text-customBlack mr-[-10px]'
                    style={{ fontFamily: "SF Pro Display" }}
                  >
                    {t("appoint")}
                  </p>
                )}
                <div className='ml-3'>
                  <ArrowRight />
                </div>
              </div>
            </div>
            {/* Priority */}
            <div
              className='h-[44px] flex justify-between items-center px-[16px]'
              onClick={() => setOpenPriority(true)}
            >
              <div className='flex justify-between items-center gap-2'>
                <div className='flex gap-[1px] items-end justify-center'>
                  <Prioritet />
                </div>
                <p
                  className='text-black tex-[16px] font-normal font-sans capitalize'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {t("priority")}
                </p>
              </div>
              <div className='flex items-center gap-1 text-gray-400'>
                <p
                  className='font-normal text-[16px] text-customBlack'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {t(`priority_data_${selectPriority}`)}
                </p>
                <ArrowRight />
              </div>
            </div>
            {/* Story Point */}
            <div
              className='h-[44px] flex justify-between items-center px-[16px]'
              onClick={() => setOpenStoryPoint(true)}
            >
              <div className='flex justify-between items-center gap-2'>
                <div className='flex gap-[1px] items-end justify-center text-gray-400'>
                  <Calendar />
                </div>
                <p
                  className='text-black tex-[16px] font-normal font-sans capitalize'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {t("story_point")}
                </p>
              </div>
              <div className='flex items-center gap-1 text-gray-400'>
                {!selectStoryPoint ? (
                  <p
                    className='font-normal text-[16px] text-customBlack'
                    style={{ fontFamily: "SF Pro Display" }}
                  >
                    0
                  </p>
                ) : (
                  <p className='font-normal text-[16px] font-sans text-black'>
                    {selectStoryPoint}
                  </p>
                )}
                <ArrowRight />
              </div>
            </div>
          </div>

          {/* Creare btn */}

          {false ? (
            <button
              type='submit'
              className='fixed bottom-[42px] w-[94%] bg-gray-300 text-gray-400 flex justify-center items-center py-4 rounded-xl'
            >
              {" "}
              {t("create")}
            </button>
          ) : (
            <button
              type='submit'
              // onClick={createTask}
              className='fixed bottom-[42px] w-[94%] bg-custom-gradient-blue text-white flex justify-center items-center py-4 rounded-xl'
            >
              {" "}
              {t("create")}
            </button>
          )}
        </div>
      </form>
      <>
        {openPriority && (
          <div
            className='bg-black opacity-45 z-10 fixed top-0 w-full h-full'
            onClick={() => setOpenPriority(false)}
          ></div>
        )}
        <div
          className={`${
            openPriority ? "bottom-3" : "bottom-[-100%]"
          }  z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 left-3 right-3 flex flex-col gap-2`}
        >
          {priorities.map((priority: IPriority, index: number) => (
            <div
              onClick={() => {
                setSelectPriority(index + 1);
                setOpenPriority(false);
              }}
              key={index}
              className={`${
                index + 1 === selectPriority ? "bg-gray-100" : ""
              }  p-4 rounded-xl flex justify-between items-center`}
            >
              <div className='flex gap-4'>
                <div
                  className={
                    index + 1 === selectPriority ? "text-blue-600" : ""
                  }
                >
                  {priority[lang as keyof IPriority]}
                </div>
              </div>
              <div
                className={`${
                  index + 1 === selectPriority
                    ? "border-blue-500"
                    : "border-gray-400"
                } flex justify-center items-center rounded border w-5 h-5`}
              >
                {index + 1 === selectPriority && (
                  <div className='bg-blue-500 w-3 h-3 rounded-sm'></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
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
      <>
        {openStoryPoint && (
          <div
            className='bg-black opacity-45 z-10 fixed top-0 w-full h-full'
            onClick={() => {
              setOpenStoryPoint(false);
              setFocusStoryPoint(false);
            }}
          ></div>
        )}
        <div
          className={`${
            openStoryPoint
              ? focusStoryPoint
                ? "bottom-[30%]"
                : "bottom-3"
              : "bottom-[-100%]"
          }  z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 left-3 pb-[80px] right-3 flex flex-wrap gap-2 justify-between`}
        >
          <div className='w-full h-[56px] py-[6px] px-[18px] bg-[#F2F2F7] rounded-[16px]'>
            <input
              type='number'
              placeholder='0'
              className='w-full h-full bg-transparent outline-none border-none'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStoryPoint(Number(e.target.value))
              }
              onFocus={() => setFocusStoryPoint(true)}
            />
          </div>
          <div>
            {openStoryPoint && (
              <div
                className=' absolute bottom-[22px] bg-custom-gradient-blue text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3'
                onClick={() => {
                  setFocusStoryPoint(false);
                  setSelectStoryPoint(storyPoint);
                  setOpenStoryPoint(false);
                }}
              >
                {t("save")}
              </div>
            )}
          </div>
        </div>
      </>
    </>
  );
};

export default CreateTaskFromGroup;
