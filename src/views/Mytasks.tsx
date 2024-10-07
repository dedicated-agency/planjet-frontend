import WebApp from "@twa-dev/sdk";
import { useEffect, useReducer, useRef, useState } from "react";
import "../components/carusel.css";
import { useSwipeable } from "react-swipeable";
import MyTask from "../components/MyTask";
import axiosClient from "../common/axiosClient";
import ArrowRight from "../assets/icons/ArrowRight";
import SymbolBorder from "../assets/icons/SymbolBorder";
import { Avatar } from "../components/mini/Avatar";
import { useQuery } from "react-query";
import { fetchData } from "../common/fetchData";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import { t } from "i18next";

const getGroups = async () => {
  return await fetchData("/user/groups", {});
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
  selectedStatus: null,
};

export const Mytasks = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());

  const [isOpenProjectFilter, setIsOpenProjectFilter] = useState(false);
  const [isOpenProject, setIsOpenProject] = useState();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
  }>();

  const { data: groups } = useQuery(["groupsData"], () => getGroups());

  const [state, setState] = useReducer(
    (state: any, setState: any) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  const handleSwipe = (direction: any) => {
    if (direction === "LEFT" && state.index < state.statuses.length - 1) {
      const newIndex = state.index + 1;
      setState({ index: newIndex });
      getTasks(state.statuses[newIndex].name);
      updateHash(state.statuses[newIndex].id);
    } else if (direction === "RIGHT" && state.index > 0) {
      const newIndex = state.index - 1;
      setState({ index: newIndex });
      getTasks(state.statuses[newIndex].name);
      updateHash(state.statuses[newIndex].id);
    }
  };

  const tabContainerRef = useRef(null);
  // @ts-ignore
  const scrollTabs = (direction) => {
    if (tabContainerRef.current) {
      const scrollAmount = direction === "RIGHT" ? -50 : 50;
      // @ts-ignore
      tabContainerRef.current.scrollBy({
        top: 0,
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      handleSwipe("LEFT");
      scrollTabs("LEFT");
    },
    onSwipedRight: () => {
      handleSwipe("RIGHT");
      scrollTabs("RIGHT");
    },
    trackMouse: true,
  });

  useEffect(() => {
    setState({ name: t('my_tasks') });
    getStatuses();
  }, [selectedProjectId]);

  const getStatuses = async () => {
    try {
      const response = await axiosClient.get(
        `/user/tasks/header?project_id=${selectedProject?.id || ""}`,
      );
      if (response && response.data) {
        setState({
          statuses: response.data,
          selectedStatus: response.data[0].name,
        }); // Set initial selected status
        // Get tasks for the first status by default
        if (response.data.length > 0) {
          getTasks(response.data[0].name); // Fetch tasks by the first status name
        }
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const getTasks = async (statusName: string) => {
    try {
      const response: any = await axiosClient.get(
        `/user/tasks?status=${statusName}&project_id=${selectedProject?.id}`,
      );
      if (response && response.data) {
        setState({ tasks: response.data });
      } else {
        setState({ tasks: [] });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setState({ tasks: [] });
    }
  };

  useEffect(() => {
    const currentHash = window.location.hash;
    const extractedStatus = currentHash.substring(1).split("&")[1];
    if (extractedStatus !== "null" && currentHash && extractedStatus) {
      setState({ selectedStatus: extractedStatus });
    } else if (state.statuses.length) {
      setState({ selectedStatus: state.statuses[0].id });
    }
  }, [state.statuses]);

  const updateHash = (status: number) => {
    window.location.hash = `0&${status}`;
    setState({ selectedStatus: status });
  };

  return (
    <>
      <div className='h-[72px]'></div>
      <div
        ref={tabContainerRef}
        className='w-full h-[72px] fixed z-10 top-0 flex justify-between items-center py-[4px] px-[16px] bg-white'
      >
        <div className='flex items-center gap-[16px]'>
          <SymbolBorder />
          <div>
            <p
              className='text-[17px] font-medium text-black leading-5'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {t('my_tasks')}
            </p>
          </div>
        </div>
        <div
          className='flex items-center border-[.5px] border-[#E1E8F5] rounded-[25px] p-[4px] pl-[10px] pr-[7px] gap-[6px] cursor-pointer'
          onClick={() => setIsOpenProjectFilter(true)}
        >
          <p
            className='text-[14px] font-[300] text-customBlack'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {selectedProject
              ? selectedProject?.name
              : capitalizeFirstLetter(t('project'))}
          </p>
          <div className={"rotate-90"}>
            <ArrowRight />
          </div>
        </div>
      </div>
      <div>
        {state.statuses.length > 0 && (
          <div
            ref={tabContainerRef}
            className='flex h-[44px] w-full overflow-x-scroll border-b border-t bg-white px-2 scroll-smooth status-list fixed top-[72px] z-10'
          >
            {state.statuses.map((status: any, index: number) => (
              <div
                key={index}
                className={`flex h-full  items-center gap-2 px-4 relative cursor-pointer`}
                onClick={() => {
                  setState({ index });
                  getTasks(status.name);
                  updateHash(status.id);
                }}
              >
                <>
                  <p
                    className={`transition text-sm whitespace-nowrap ${
                      state.index === index
                        ? "text-gradient-blue"
                        : "text-customBlack"
                    } font-bold`}
                    style={{ fontFamily: "SF Pro Display" }}
                  >
                    {capitalizeFirstLetter(status.name)}
                  </p>
                  <p
                    className={`transition text-[11px] rounded-3xl ${
                      state.index === index
                        ? "bg-custom-gradient-blue"
                        : "bg-customBlack"
                    } text-white flex items-center justify-center pt-[1px]  min-w-[18px] `}
                    style={{ fontFamily: "SF Pro Display" }}
                  >
                    {status.count}
                  </p>
                  {state.index === index && (
                    <div className='transition absolute left-0 bottom-0 h-[3px] rounded-t-full w-full border-blue-500 border bg-custom-gradient-blue'></div>
                  )}
                </>
              </div>
            ))}
          </div>
        )}
        <div className='h-[44px]'></div>
        <div
          {...handlers}
          className='carusel-heighter'
          style={{ touchAction: "pan-y" }}
        >
          <div className='flex flex-col px-4 pb-12 items-center justify-start'>
            {state.tasks.length > 0 ? (
              state.tasks.map((task: any) => (
                <MyTask key={task?.id} project={task} /> // Render individual task components
              ))
            ) : (
              <div className='mt-5 text-gray-400'>
                {t('no_task_yet')}
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpenProjectFilter && (
        <div
          className='bg-black opacity-45 z-10 fixed top-0 w-full h-full'
          onClick={() => setIsOpenProjectFilter(false)}
        ></div>
      )}
      <div
        className={`${
          isOpenProjectFilter ? "bottom-3" : "bottom-[-100%]"
        } overflow-y-scroll scrollbar-hidden max-h-[70%] z-[100] fixed transition-all rounded-[25px] bg-white p-3 mb-2 left-3 right-3 flex flex-col gap-2`}
      >
        {groups?.map((group: any, index: number) => (
          <div
            onClick={() => {
              // setSelectPriority(index + 1);
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
                  // setSelectPriority(index + 1);
                }}
              >
                {group.projects?.map((project: any, i: number) => (
                  <div
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setSelectedProject(project);
                      setIsOpenProjectFilter(false);
                    }}
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
                        project.id === selectedProjectId
                          ? "border-blue-500"
                          : "border-gray-400"
                      } flex justify-center items-center rounded border w-[16px] h-[16px]`}
                    >
                      {project.id === selectedProjectId && (
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
      </div>
    </>
  );
};
