import { useEffect, useRef, useState } from "react";
import { AvatarUser } from "../components/mini/AvatarUser";
import { useGetTasks } from "../common/fetchTasks";
import { Loader } from "../components/mini/Loader";
import { useNavigate } from "react-router-dom";
import axiosClient from "../common/axiosClient";
import File from "../assets/icons/File";
import { fetchData } from "../common/fetchData";
import { useQuery } from "react-query";
import ArrowRight from "../assets/icons/ArrowRight";
import { Avatar } from "../components/mini/Avatar";
import WebApp from "@twa-dev/sdk";
import User from "../assets/icons/User";
import Prioritet from "../assets/icons/Prioritet";
import Calendar from "../assets/icons/Calendar";
import Square from "../assets/icons/Square";
import imageCacheChacker from "../common/imagesCacher";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import { t } from "i18next";
import { useUserContext } from "../context/UserContext";
import { IUser } from "../components/Comment";

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

const getGroups = async () => {
  return await fetchData("/user/groups", {});
};

const CreateTask = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  useEffect(() => {
    WebApp.setHeaderColor("#F2F2F7");
  }, []);
  const navigate = useNavigate();
  const { user } = useUserContext();
  const lang = user.lang
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
  const [storyPoint, setStoryPoint] = useState(0);
  const [openProject, setOpenProject] = useState(false);
  const [isOpenProject, setIsOpenProject] = useState();
  const [selectStoryPoint, setSelectStoryPoint] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [name, setName] = useState("");
  const [focusStoryPoint, setFocusStoryPoint] = useState(false);

  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
  }>();
  const [tempSelectedProject, setTempSelectedProject] = useState<any>(null);

  const projectid = tempSelectedProject ? tempSelectedProject.id : null;

  const { data: groups } = useQuery(["groupsData"], () => getGroups());

  const adjustTextareaHeight = () => {
    const textarea: any = textareaRef.current;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
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
    Number(projectid),
  );
  useEffect(() => {
    if (project) {
      getUsers();
    }
  }, [project, projectid]);

  const getUsers = async () => {
    const resultPromises = project.users.map(async (user: IUser) => {
      try {
        user.image = await imageCacheChacker((user.telegram_id).toString());
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
      project_id: projectid,
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
            <div className={"relative top-[-4px]"}>
              <Square />
            </div>
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
        <div className='bg-white shadow-customShadow rounded-xl mt-5'>
          <div>
            {/* Project */}
            <div className='h-[44px] flex justify-between items-center px-[16px]'>
              <div className='flex justify-between items-center gap-2'>
                <div className='text-gray-400'>
                  <File />
                </div>
                <p
                  className='text-black tex-[16px] font-normal font-sans capitalize'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {t('project')}
                </p>
              </div>

              <div
                className='flex items-center gap-1 text-gray-400'
                onClick={() => setOpenProject(true)}
              >
                {selectedProject == null ? (
                  <p
                    className='font-normal text-[16px] text-customBlack'
                    style={{ fontFamily: "SF Pro Display" }}
                  >
                    {t('choose')}
                  </p>
                ) : (
                  <Avatar
                    image={""}
                    alt={selectedProject?.name}
                    radius={6}
                    width={28}
                    id={selectedProject?.id}
                  />
                )}
                <ArrowRight />
              </div>
            </div>
            {/* Participant */}
            <div className='h-[44px] flex justify-between items-center px-[16px] cursor-pointer'>
              <div className='flex justify-between items-center gap-2'>
                <div className='text-gray-400'>
                  <User />
                </div>
                <p
                  className='text-black tex-[16px] font-normal font-sans capitalize'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {t('participant')}
                </p>
              </div>

              <div
                className='flex items-center gap-1 text-gray-400'
                onClick={() => {
                  projectid !== null && setOpenParticipant(true);
                }}
              >
                {}
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
                    {t('appoint')}
                  </p>
                )}
                <div className='ml-3'>
                  <ArrowRight />
                </div>
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
                  {t('priority')}
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

            <div
              className='h-[44px] flex justify-between items-center px-[16px]'
              onClick={() => {
                setOpenStoryPoint(true)
              }}
            >
              <div className='flex justify-between items-center gap-2'>
                <div className='flex gap-[1px] items-end justify-center text-gray-400'>
                  <Calendar />
                </div>
                <p
                  className='text-black tex-[16px] font-normal font-sans capitalize'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {t('story_point')}
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
                    {selectStoryPoint}{" "}
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
            {t('create')}
          </div>
        ) : (
          <div
            onClick={createTask}
            className='fixed bottom-[42px] w-[94%] bg-custom-gradient-blue text-white flex justify-center items-center py-4 rounded-xl'
          >
            {" "}
            {t('create')}
          </div>
        )}
      </div>

      {openProject && (
        <div
          className='bg-black opacity-45 z-10 fixed top-0 w-full h-full'
          onClick={() => setOpenProject(false)}
        ></div>
      )}
      <div
        className={`${
          openProject ? "bottom-3" : "bottom-[-100%]"
        } overflow-y-scroll scrollbar-hidden max-h-[70%] z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 pb-16 mb-2 left-3 right-3 flex flex-col gap-2`}
      >
        {groups?.map((group: any, index: number) => (
          <div
            onClick={() => {
              setSelectPriority(index + 1);
              setIsOpenProject(group?.id);
            }}
            key={index}
            className={`${
              isOpenProject === group?.id
                ? "bg-[#FAFAFA] border-[1px] border-[#EBEDF0]"
                : "border border-[white]"
            }  pt-[6px] pb-[6px] rounded-xl flex flex-col justify-between relative transition-all duration-700 ease-in-out`}
          >
            <div className='w-full px-[18px] h-[44px] flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Avatar
                  image={""}
                  alt={group.name}
                  radius={6}
                  width={28}
                  id={group.id}
                />
                <p
                  className='font-normal text-[17px] text-black'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {group.name}
                </p>
              </div>
              <div
                className={`${
                  isOpenProject === group?.id
                    ? "rotate-[270deg]"
                    : "rotate-[90deg]"
                }`}
              >
                <ArrowRight />
              </div>
            </div>
            {isOpenProject === group?.id ? (
              <div
                className='ml-[35px] px-[18px] transition-all duration-700 ease-in-out max-h-[1000px] opacity-100'
                onClick={() => {
                  setSelectPriority(index + 1);
                }}
              >
                {group.projects?.map((project: any, i: number) => (
                  <div
                    onClick={() => setSelectedProject(project)}
                    key={i}
                    className='flex items-center justify-between h-[44px] transition-all duration-500 ease-in-out'
                  >
                    <p
                      className='font-normal text-[17px] text-black'
                      style={{ fontFamily: "SF Pro Display" }}
                    >
                      {capitalizeFirstLetter(project?.name)}
                    </p>
                    <div
                      className={`${
                        project.id === selectedProject?.id
                          ? "border-blue-500"
                          : "border-gray-400"
                      } flex justify-center items-center rounded border w-[16px] h-[16px]`}
                    >
                      {project.id === selectedProject?.id && (
                        <div className='bg-blue-500 w-[10px] h-[10px] rounded-sm'></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='ml-[35px] transition-all duration-700 ease-in-out max-h-0 opacity-0 overflow-hidden'></div>
            )}
          </div>
        ))}

        <div>
          {openProject && (
            <div className='bg-white rounded-b-[25px] h-[30px] fixed bottom-3 left-3 right-3'>
              <div
                className=' fixed left-6 right-6 bottom-6 bg-custom-gradient-blue text-white flex justify-center items-center py-4 rounded-xl mt-3'
                onClick={() => {
                  setTempSelectedProject(selectedProject);
                  setOpenProject(false);
                }}
              >
                {t('choose')}
              </div>
            </div>
          )}
        </div>
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

      {openParticipant && projectid !== null && (
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
          openParticipant && projectid !== null ? "bottom-3" : "bottom-[-100%]"
        } overflow-y-scroll scrollbar-hidden max-h-[70%] z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-[12px] pb-[68px] left-3 right-3 flex flex-col gap-2`}
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
            }  p-4 rounded-[16px] flex justify-between items-center`}
          >
            <div className='flex gap-[28px]'>
              <AvatarUser
                image={user.image}
                alt={user.name}
                width={28}
                height={28}
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
              } flex justify-center items-center rounded border w-[16px] h-[16px]`}
            >
              {selectedUsers.some(
                (u: any) => u.telegram_id === user.telegram_id,
              ) && (
                <div className='bg-blue-500 w-[10px] h-[10px] rounded-sm'></div>
              )}
            </div>
          </div>
        ))}
        <div>
          {openParticipant && projectid !== null && (
            <div
              className=' fixed bottom-[22px] bg-custom-gradient-blue text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3'
              onClick={() => setOpenParticipant(false)}
            >
              {t('choose')}
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
          openStoryPoint ? (focusStoryPoint ? "bottom-[200px]" : "bottom-3") : "bottom-[-100%]"
        }  z-[100] fixed transition-all rounded-[25px] bg-white px-3 py-5 left-3 pb-[80px] right-3 flex flex-wrap gap-2 justify-between`}
      >
        <div className='w-full h-[56px] py-[6px] px-[18px] bg-[#F2F2F7] rounded-[16px]'>
          <input
            type='number'
            placeholder='0'
            className='w-full h-full bg-transparent outline-none border-none'
            onChange={(e: any) => setStoryPoint(e.target.value)}
            onFocus={() => setFocusStoryPoint(true)}
          />
        </div>
      
        <div>
          {openStoryPoint && (
            <div
              className=' fixed bottom-[22px] bg-custom-gradient-blue text-white flex justify-center items-center py-4 left-6 right-6 rounded-xl mt-3'
              onClick={() => {
                setSelectStoryPoint(storyPoint);
                setOpenStoryPoint(false);
              }}
            >
              {t('save')}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateTask;
