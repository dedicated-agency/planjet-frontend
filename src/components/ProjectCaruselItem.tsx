// import { FaLink, FaRegComment } from "react-icons/fa6";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AvatarUser } from "./mini/AvatarUser";
import { useEffect, useReducer } from "react";
import { dateTimeConverter } from "../common/dateTimeConverter";
import axiosClient from "../common/axiosClient";
import { useQueryClient } from "react-query";
import StatusSelector from "./StatusSelector";
import Comment from "../assets/icons/Comment";
import imageCacheChacker from "../common/imagesCacher";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import { useUserContext } from "../context/UserContext";
import { ICommentIn, IUser } from "./Comment";
import { IState, IStatus } from "./ProjectCarusel";

interface IStateItem {
  userPhoto: string;
  selectStatus: number | string | null;
  participants: IParticipant[];
}

const initialState: IStateItem = {
  userPhoto: '',
  selectStatus: null,
  participants: []
};


interface IProps {
  project: IProject,
  statuses: IStatus[],
  setProjectState: React.Dispatch<Partial<IState>>,
  getStatuses: () => Promise<void>,
  selectedStatus: number | string | null,
  index: number,
}

interface IProject {
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

export interface IProjectTaskUser {
  task_id: number;
  user: IUser;
  user_id: string;
}

interface IParticipant {
  img: string;
  user: IUser;
  task_id: number;
  user_id: number | string;
}


const ProjectCaruselItem = (props: IProps) => {
  const navigate = useNavigate();
  const {user} = useUserContext()
  const { project, statuses, setProjectState, getStatuses, selectedStatus } = props;

  const [state, setState] = useReducer(
    (state: IStateItem, setState: Partial<IStateItem>) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  const queryClient = useQueryClient();

  const updateStatus = async (status: number) => {
    try {
      const response = await axiosClient.put(
        "/task/" + project.id + "/status",
        { status },
      );
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ["tasksDate"],
        });
        setProjectState({ selectedStatus: project.status_id });
        getStatuses();
      }
    } catch (error) {
      console.log("Update status error");
    }
  };

  useEffect(() => {
    getPhoto();
  }, []);

  const getPhoto = async () => {
    const result = await imageCacheChacker(project.user_id);
    const results: IParticipant[] = [];
    if(project.taskUser.length)
    {
      for (const taskUser of project.taskUser) {
        const img = await imageCacheChacker(taskUser.user_id);
        results.push({...taskUser, img})
      }
    }
    setState({participants: results, userPhoto: result})
  };

  const locationNavigator = () => {
    navigate("#" + project.id + "&" + selectedStatus, { replace: true });
    navigate("/tasks/" + project.id);
  }

  return (
    <>
      <div id={`${project.id}`} className='task-carusel-item w-full mt-2 relative'>
        <p
          className='absolute z-10 right-[16px] top-[12px] text-2xl text-gray-400'
          onClick={() => setState({selectStatus: project.status_id})}
        >
          <HiOutlineDotsHorizontal />
        </p>
        <div
          onClick={locationNavigator}
          key={project.id}
          className='block bg-white rounded-[16px] p-[16px] w-full'
        >
          <div className='flex justify-between items-center mb-2 relative'>
            <p
              className='text[17px] text-customDark1 max-w-[90%] font-sans font-[500] single-line-ellipsis '
              style={{ fontFamily: "SF Pro Display" }}
            >
              {capitalizeFirstLetter(project.name)}
            </p>
          </div>
          <p
            className='text-sm text-customBlack font-sans font-normal duo-line-ellipsis'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {project.description}
          </p>
          <div className='flex justify-between items-center mt-6'>
            <div className='flex gap-2 items-center'>
              <p className='font-sans text-sm font-bold text-gray-400'>
                {dateTimeConverter.convertTime(project.created_at)}
              </p>
              <div className='flex gap-[1px] items-end justify-center pb-1'>
                <span
                  className={` ${
                    project.priority === 1 && "bg-green-400 border-green-400"
                  } ${
                    project.priority === 2 && "bg-yellow-400 border-yellow-400"
                  } ${
                    project.priority === 3 && "bg-red-400 border-red-400"
                  } border rounded-sm w-[5px] h-2`}
                ></span>
                <span
                  className={` ${
                    project.priority === 1 && "bg-green-200 border-green-200"
                  } ${
                    project.priority === 2 && "bg-yellow-400 border-yellow-400"
                  } ${
                    project.priority === 3 && "bg-red-400 border-red-400"
                  } border rounded-sm w-[5px] h-3`}
                ></span>
                <span
                  className={` ${
                    project.priority === 1 && "bg-green-200 border-green-200"
                  } ${
                    project.priority === 2 && "bg-yellow-200 border-yellow-200"
                  } ${
                    project.priority === 3 && "bg-red-400 border-red-400"
                  } border rounded-sm w-[5px] h-4`}
                ></span>
              </div>
            </div>
            <div className='flex justify-between items-center gap-3 relative right-[11px]'>
              {project.taskComment?.length !== 0 && (
                <div className='text-customBlack text-[13px] flex items-center gap-1'>
                  <Comment /> <p className="mt-[2px]">{project.taskComment?.length}</p>
                </div>
              )}
              <div className='text-blue-500 pr-1 flex'>
                {
                  state.participants.length ? state.participants.map((taskUser: IParticipant) => (
                    <AvatarUser
                    image={taskUser.img}
                    alt={taskUser.user.name || "N"}
                    width={28}
                    height={28}
                    key={taskUser.user_id}
                    id={Number(taskUser.user_id)}
                  />
                  )):
                  <AvatarUser
                    image={state.userPhoto}
                    alt={project?.user?.name || user.first_name}
                    width={28}
                    height={28}
                    id={project?.user?.telegram_id}
                  />
                }

              </div>
            </div>
          </div>
        </div>
      </div>
      <StatusSelector
        selectStatus={state.selectStatus}
        setSelectStatus={setState}
        statuses={statuses}
        updateStatus={updateStatus}
      />
    </>
  );
};

export default ProjectCaruselItem;
