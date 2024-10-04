import { useContext, useEffect, useReducer, useRef } from "react";
import "./carusel.css";
import { useSwipeable } from "react-swipeable";
import { StateContext } from "../context/StateContext";
import { useParams } from "react-router-dom";
import { TopProjectBar } from "./TopProjectBar";
import languages from "../local/languages.json";
import { fetchData } from "../common/fetchData";
import ProjectCaruselItem from "./ProjectCaruselItem";
import { useGetTasks } from "../common/fetchTasks";
import { Loader } from "./mini/Loader";

const initialState = {
  statuses: [],
  tasks: [],
  index: 0,
  name: "",
  users: [],
  currectUser: 0,
  selector: true,
  selectedStatus: null,
  touchStart: null,
  touchEnd: null,
  selectedUsers: "",
};

export const ProjectCarusel = () => {
  const { lang } = useContext(StateContext);
  const { id } = useParams();
  const locales: any = languages;
  const [state, setState] = useReducer(
    (state: any, setState: any) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  const {
    data: project,
    isLoading,
    error,
    // refetch,
    isFetching,
  } = useGetTasks(
    {
      status: state.selectedStatus,
      user_ids: state.selectedUsers,
    },
    Number(id),
  );

  useEffect(() => {
    const currentHash = window.location.hash;
    if(!isLoading && !isFetching && currentHash)
    {
      const extractedId = currentHash.substring(1).split("&")[0];
      const element = document.getElementById(extractedId);
      if(element) 
      {
        element.scrollIntoView({ behavior: "smooth", block: "start"});
        const offset = 105;
        const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
        setTimeout(() => {
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }, 0);
      }    
    }
  }, [isLoading, isFetching]);

  useEffect(() => {
    const currentHash = window.location.hash;
    const extractedStatus = currentHash.substring(1).split("&")[1];
    if(extractedStatus !== "null" && currentHash && extractedStatus)
    {
      setState({selectedStatus: extractedStatus});
    }else if(state.statuses.length)
    {
      setState({selectedStatus: state.statuses[0].id});
    }
  }, [state.statuses])

  const handleSwipe = (direction: "LEFT" | "RIGHT") => {
    if (direction === "LEFT" && state.index < state.statuses.length - 1) {
      setState({
        selectedStatus: state.statuses[state.index + 1].id,
        index: state.index + 1,
      });
    } else if (direction === "RIGHT" && state.index > 0) {
      setState({
        selectedStatus: state.statuses[state.index - 1].id,
        index: state.index - 1,
      });
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
    getStatuses();
  }, [state.selectedUsers]);

  useEffect(() => {
    if (project) {
      setState({ name: project.name, users: project.users });
    }
  }, [project]);

  const getStatuses = async () => {
    const params: any = {};
    if (state.selectedUsers !== "") {
      params.user_ids = state.selectedUsers;
    }
    const response = await fetchData("/status/" + id, params);
    setState({ statuses: response });
  };

  const updateHash = (status: number) => {
    window.location.hash = `0&${status}`;
    setState({ selectedStatus: status});
  }

  // @ts-ignore
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <>
      <TopProjectBar state={state} setState={setState} id={id} />
      <div
        ref={tabContainerRef}
        className='flex h-[44px] max-w-[700px] w-full overflow-x-scroll border-b bg-white px-2 transition scroll-smooth status-list fixed top-[56px] z-[19]'
      >
        {state.statuses.length > 0 &&
          state.statuses.map((status: any) => (
            <div
              key={status.id}
              className='flex h-full  items-center gap-2 px-4 relative cursor-pointer'
              onClick={() => updateHash(status.id)}
            >
              <>
                <p
                  className={`transition text-sm whitespace-nowrap ${
                    Number(state.selectedStatus) === Number(status.id)
                      ? "text-gradient-blue"
                      : "text-customBlack"
                  } font-bold`}
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {status.name}
                </p>
                <p
                  className={`transition text-[11px] rounded-3xl  ${
                    Number(state.selectedStatus) === Number(status.id)
                      ? "bg-custom-gradient-blue"
                      : "bg-customBlack"
                  } text-white flex items-center justify-center pt-[1px]  min-w-[18px]`}
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {status.tasksCount}
                </p>
              </>
              { Number(state.selectedStatus) === Number(status.id) && (
                <div className='transition absolute left-0 bottom-0 h-[3px] rounded-t-full w-full border-blue-500 border bg-custom-gradient-blue'></div>
              )}
            </div>
          ))}
      </div>
      <div className='h-[44px]'></div>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <div
          {...handlers}
          id="carusel-heighter"
          className="carusel-heighter"
          style={{ touchAction: "pan-y" }}
        >
          <div
            key={state.index}
            className='flex flex-col-reverse px-4 pb-12 items-center justify-start'
          >
            {project && project.tasks.length > 0 ? (
              project.tasks.map((task: any, index: number) => (
                <ProjectCaruselItem
                  getStatuses={getStatuses}
                  key={task.id}
                  project={task}
                  statuses={state.statuses}
                  setProjectState={setState}
                  selectedStatus={state.selectedStatus}
                  index={index}
                />
              ))
            ) : (
              <div className='mt-5 text-gray-400'>
                {locales[lang].no_task_yet}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
