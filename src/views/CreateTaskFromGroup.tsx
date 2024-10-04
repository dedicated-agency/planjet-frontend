import { useContext, useEffect, useRef, useState } from "react";
// import { useQuery } from "react-query";
// import { fetchData } from "../common/fetchData";
import languages from "../local/languages.json";
import { StateContext } from "../context/StateContext";
import { AvatarUser } from "../components/mini/AvatarUser";
import { useGetTasks } from "../common/fetchTasks";
import { Loader } from "../components/mini/Loader";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../common/axiosClient";
// import { dateTimeConverter } from "../common/dateTimeConverter";
import { fetchData } from "../common/fetchData";
import { useQuery } from "react-query";
import WebApp from "@twa-dev/sdk";
import ArrowRight from "../assets/icons/ArrowRight";
import Calendar from "../assets/icons/Calendar";
import User from "../assets/icons/User";
import Prioritet from "../assets/icons/Prioritet";
import Square from "../assets/icons/Square";
import File from "../assets/icons/File";
import { Avatar } from "../components/mini/Avatar";
import imageCacheChacker from "../common/imagesCacher";

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

const statusses = [
  {
    uz: "Bajarish uchun",
    ru: "К выполнению",
    en: "For execution",
  },
  {
    uz: "Jarayonda",
    ru: "В процессе",
    en: "In progress",
  },
  {
    uz: "Tekshiruvda",
    ru: "На проверке",
    en: "Under review",
  },
  {
    uz: "Tayyor",
    ru: "Готово",
    en: "Ready",
  },
];

const getGroups = async () => {
  return await fetchData("/user/groups", {});
};

const CreateTaskFromGroup = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  useEffect(() => {
    WebApp.setHeaderColor("#F2F2F7");
  }, []);
  const navigate = useNavigate();
  const { project_id } = useParams();
  const locales: any = languages;
  const { lang, user, availableUserImages, setContextState } = useContext(StateContext);
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const handleChange = (event: any) => {
    setText(event.target.value);
    adjustTextareaHeight();
  };
  const [selectPriority, setSelectPriority] = useState<number>(2);
  const [openPriority, setOpenPriority] = useState(false);
  const [openParticipant, setOpenParticipant] = useState(false);
  const [openStoryPoint, setOpenStoryPoint] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectStatus, setSelectStatus] = useState<number>(2);
  const [selectStoryPoint, setSelectStoryPoint] = useState(0);
  const [storyPoint, setStoryPoint] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [name, setName] = useState("");

  const { data: groups } = useQuery(["groupsData"], () => getGroups());
  console.log(groups);

  const adjustTextareaHeight = () => {
    const textarea: any = textareaRef.current;
    textarea.style.height = "auto"; 
    textarea.style.height = `${textarea.scrollHeight}px`; 
  };

  const setParticipants = (user: any) => {
    const check = selectedUsers.some(
      (u: any) => u.telegram_id === user.telegram_id,
    );
    if (check) {
      setSelectedUsers(
        selectedUsers.filter((u: any) => u.telegram_id !== user.telegram_id),
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

  console.log(project);

  const getUsers = async () => {
    const resultPromises = project.users.map(async (user: any) => {
      try {
        user.image = await imageCacheChacker(user.telegram_id, availableUserImages, setContextState);
        return user;
      } catch (error) {
        console.log("Create task image error" + error);
      }
    });
    const result = await Promise.all(resultPromises);
    // @ts-ignore
    setUsers(result);
  };

  const createTask = async () => {
    const data = {
      project_id: project_id,
      name,
      description: text,
      priority: selectPriority,
      participant: selectedUsers.map((user: any) => user.telegram_id),
      point: selectStoryPoint,
    };

    const response = await axiosClient.post("/task/create", data);
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
      <div className='p-3'>
        <div className='bg-white shadow-customShadow rounded-xl p-3 pb-2'>
          <div className='flex items-center gap-[8px]'>
            <Square className={"relative top-[-4px]"} />
            <input
              type='text'
              placeholder='Task name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full outline-none font-sans mb-2'
            />
          </div>
          <textarea
            ref={textareaRef}
            onChange={handleChange}
            value={text}
            name=''
            id=''
            placeholder='Description'
            rows={1}
            style={{
              overflow: "hidden",
              resize: "none",
            }}
            className='text-[14px] font-sans text-gray-500 w-full outline-none'
          />
        </div>

        <div className='h-[44px] flex justify-between items-center px-[16px] bg-white mt-5 rounded-xl cursor-pointer'>
          <div className='flex justify-between items-center gap-2'>
            <div className='text-gray-400'>
              <File />
            </div>
            <p
              className='text-black tex-[16px] font-normal font-sans capitalize'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {locales[lang].project}
            </p>
          </div>

          <div className='flex items-center gap-1 text-gray-400'>
            <Avatar image={""} alt={project.name} width={24} radius={4} id={project.id} />
            <p
              className='text-[16px] font-normal text-[#1B1F26]'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {project.name}
            </p>
          </div>
        </div>

        <div className='bg-white shadow-customShadow rounded-xl mt-5 cursor-pointer'>
          <div>
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
                  {locales[lang].participant}
                </p>
              </div>

              <div
                className='flex items-center gap-1 text-gray-400'
                onClick={() => setOpenParticipant(true)}
              >
                {selectedUsers.length > 0 ? (
                  selectedUsers.map((user: any, index: number) => (
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
                    {locales[lang].appoint}
                  </p>
                )}
                <ArrowRight className='ml-3' />
              </div>
            </div>
            {/* Prioritet */}
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
                  {locales[lang].priority}
                </p>
              </div>
              <div className='flex items-center gap-1 text-gray-400'>
                <p
                  className='font-normal text-[16px] text-customBlack'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {locales[lang].priority_data[selectPriority]}
                </p>
                <ArrowRight />
              </div>
            </div>

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
                  {locales[lang].story_point}
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
        </div>
        {name === "" ? (
          <div className='fixed bottom-[42px] w-[94%] bg-gray-300 text-gray-400 flex justify-center items-center py-4 rounded-xl'>
            {" "}
            {locales[lang].create}
          </div>
        ) : (
          <div
            onClick={createTask}
            className='fixed bottom-[42px] w-[94%] bg-custom-gradient-blue text-white flex justify-center items-center py-4 rounded-xl'
          >
            {" "}
            {locales[lang].create}
          </div>
        )}
      </div>

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
        {priorities.map((priority: any, index: number) => (
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
                className={index + 1 === selectPriority ? "text-blue-600" : ""}
              >
                {priority[lang]}
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
        {users.map((user: any, index: number) => (
          <div
            key={index}
            onClick={() => {
              setParticipants(user);
            }}
            className={`${
              selectedUsers.some((u: any) => u.telegram_id === user.telegram_id)
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
                selectedUsers.some(
                  (u: any) => u.telegram_id === user.telegram_id,
                )
                  ? "border-blue-500"
                  : "border-gray-400"
              } flex justify-center items-center rounded border w-5 h-5`}
            >
              {selectedUsers.some(
                (u: any) => u.telegram_id === user.telegram_id,
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
              {locales[lang].choose}
            </div>
          )}
        </div>
      </div>
      {openStoryPoint && (
        <div
          className='bg-black opacity-45 z-10 fixed top-0 w-full h-full'
          onClick={() => setOpenStoryPoint(false)}
        ></div>
      )}
      <div
        className={`${
          openStoryPoint ? "bottom-3" : "bottom-[-100%]"
        }  z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 left-3 pb-[80px] right-3 flex flex-wrap gap-2 justify-between`}
      >
        <div className='w-full h-[56px] py-[6px] px-[18px] bg-[#F2F2F7] rounded-[16px]'>
          <input
            type='number'
            placeholder='0'
            className='w-full h-full bg-transparent outline-none border-none'
            onChange={(e: any) => setStoryPoint(e.target.value)}
          />
        </div>
        {/* {storyPoints.map((storyPoint: any, index: number) => (
          <div
            onClick={() => {
              setSelectStoryPoint(index + 1);
              setOpenStoryPoint(false);
            }}
            key={index}
            className={`${
              index + 1 === selectStoryPoint ? "bg-gray-100" : ""
            }  p-4 rounded-xl flex justify-between items-center border w-[48%]`}
          >
            <div className='flex gap-4'>
              <div
                className={
                  index + 1 === selectStoryPoint ? "text-blue-600" : ""
                }
              >
                {storyPoint.value}
              </div>
            </div>
            <div
              className={`${
                index + 1 === selectStoryPoint
                  ? "border-blue-500"
                  : "border-gray-400"
              } flex justify-center items-center rounded border w-5 h-5`}
            >
              {index + 1 === selectStoryPoint && (
                <div className='bg-blue-500 w-3 h-3 rounded-sm'></div>
              )}
            </div>
          </div>
        ))} */}
        <div>
          {openStoryPoint && (
            <div
              className=' fixed bottom-[22px] bg-custom-gradient-blue text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3'
              onClick={() => {
                setSelectStoryPoint(storyPoint);
                setOpenStoryPoint(false);
              }}
            >
              {locales[lang].save}
            </div>
          )}
        </div>
      </div>

      {openStatus && (
        <div
          className='bg-black opacity-45 z-10 fixed top-0 w-full h-full'
          onClick={() => setOpenStatus(false)}
        ></div>
      )}
      <div
        className={`${
          openStatus ? "bottom-3" : "bottom-[-100%]"
        }  z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 left-3 right-3 flex flex-col gap-2`}
      >
        {statusses.map((status: any, index: number) => (
          <div
            onClick={() => {
              setSelectStatus(index + 1);
              setOpenStatus(false);
            }}
            key={index}
            className={`${
              index + 1 === selectStatus ? "bg-gray-100" : ""
            }  p-4 rounded-xl flex justify-between items-center`}
          >
            <div className='flex gap-4'>
              <div
                className={index + 1 === selectStatus ? "text-blue-600" : ""}
              >
                {status[lang]}
              </div>
            </div>
            <div
              className={`${
                index + 1 === selectStatus
                  ? "border-blue-500"
                  : "border-gray-400"
              } flex justify-center items-center rounded border w-5 h-5`}
            >
              {index + 1 === selectStatus && (
                <div className='bg-blue-500 w-3 h-3 rounded-sm'></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CreateTaskFromGroup;