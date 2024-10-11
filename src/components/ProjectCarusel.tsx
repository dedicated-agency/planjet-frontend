import { useEffect, useReducer, useRef } from "react";
import "./carusel.css";
import { useSwipeable } from "react-swipeable";
import { useParams } from "react-router-dom";
import { TopProjectBar } from "./TopProjectBar";
import { fetchData } from "../common/fetchData";
import ProjectCaruselItem, { IProjectTaskUser } from "./ProjectCaruselItem";
import { useGetTasks } from "../common/fetchTasks";
import { Loader } from "./mini/Loader";
import { t } from "i18next";
import { ICommentIn, IUser } from "./Comment";

interface Params {
  user_ids?: string;
}

interface IProjectTask {
  id: number,
  status_id: number,
  taskUser: IProjectTaskUser[],
  user_id: string,
  name: string;
  description: string;
  created_at: string;
  priority: number;
  taskComment: ICommentIn[];
  user: IUser
}

export interface IStatus {
  id: number; 
  name: string;
  tasksCount: number;
  order: number;
}

export interface IState {
  statuses: IStatus[];
  tasks: IProjectTask[];
  index: number;
  name: string;
  users: [];
  currectUser: number;
  selector: boolean;
  selectedStatus: number | string | null;
  touchStart: number | null;
  touchEnd: number | null;
  selectedUsers: string;
}

const initialState: IState = {
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
  const { id } = useParams();
  const [state, setState] = useReducer(
    (state: IState, setState: Partial<IState>) => ({
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
    const list = document.getElementById("tasks-list");
    if(!isLoading && !isFetching && currentHash)
    {
      const extractedId = currentHash.substring(1).split("&")[0];
      const element = document.getElementById(extractedId);
      if(element && list) 
      {
        const offset = 105;
        const targetPosition = element.getBoundingClientRect().top - offset
        setTimeout(() => {
          list.scrollTo({
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
      setState({ selectedStatus: extractedStatus});
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
      statusClicker(state.statuses[state.index + 1].id)
    } else if (direction === "RIGHT" && state.index > 0) {
      setState({
        selectedStatus: state.statuses[state.index - 1].id,
        index: state.index - 1,
      });
      statusClicker(state.statuses[state.index - 1].id)
    }
  };

  const tabContainerRef = useRef(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("LEFT"),
    onSwipedRight: () => handleSwipe("RIGHT"),
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
    const params: Params = {};
    if (state.selectedUsers !== "") {
      params.user_ids = state.selectedUsers;
    }
    const response = await fetchData("/status/" + id, params);
    setState({ statuses: response });
  };

  const updateHash = (status: number) => {
    window.location.hash = `0&${status}`;
    setState({ selectedStatus: status});
    statusClicker(status)
  }

  const statusClicker = (id: number) => {
    const element = document.getElementById('status_' + id);
    if(element)  element.scrollIntoView({ behavior: "smooth" });
  }
  
  // @ts-ignore
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <>
      <TopProjectBar state={state} setState={setState} id={Number(id)} group_id={project?.group_id} />
      <div
        ref={tabContainerRef}
        className='transition-all top-[56px] flex h-[44px] max-w-[700px] w-full overflow-x-scroll border-b bg-white px-2 scroll-smooth status-list fixed z-[19]'
      >
        {state.statuses.length > 0 &&
          state.statuses.map((status: IStatus) => (
            <div
              id={"status_" + status.id}
              key={status.id}
              className='transition-all flex h-full  items-center gap-2 px-4 relative cursor-pointer'
              onClick={() => updateHash(status.id)}
            >
              <>
                <p
                  className={`transition text-sm whitespace-nowrap ${
                    Number(state.selectedStatus) === Number(status.id)
                      ? "text-gradient-blue"
                      : "text-customBlack"
                  } font-bold font-sfpro`}
                >
                  {status.name}
                </p>
                <p
                  className={`transition text-[11px] rounded-3xl  ${
                    Number(state.selectedStatus) === Number(status.id)
                      ? "bg-custom-gradient-blue"
                      : "bg-customBlack"
                  } text-white flex items-center justify-center pt-[1px]  min-w-[18px] font-sfpro`}
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
            id="tasks-list"
            key={state.index}
            className='carusel-heighter flex flex-col px-4 pb-12 items-center overflow-y-scroll'
          >
            {project && project.tasks.length > 0 ? (
              project.tasks.slice().reverse().map((task: IProjectTask, index: number) => (
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
                {t('no_task_yet')}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
