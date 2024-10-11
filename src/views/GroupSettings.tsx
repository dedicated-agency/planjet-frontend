import { useNavigate, useParams } from "react-router-dom";
import { AvatarUser } from "../components/mini/AvatarUser";
import axiosClient from "../common/axiosClient";
import {
  useQuery,
} from "react-query";
import { Loader } from "../components/mini/Loader";
import { useEffect, useReducer } from "react";
import WebApp from "@twa-dev/sdk";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import getUsersData from "../common/getUsersData";
import { t } from "i18next";
import { IUser } from "../components/Comment";
import { IStatus } from "../components/ProjectCarusel";

const getProject = async (id: number) => {
  const response = await axiosClient.get("/project/show/" + id);
  return response.data;
};

interface IState {
  items: IStatus[];
  statusNotificationPermissions: any;
  projectNotificationPermissions: any;
  users: IUser[];
  statusText: string;
}



const initialState: IState = {
  items: [],
  users: [],
  statusText: "",
  statusNotificationPermissions: [],
  projectNotificationPermissions: []
};

const GroupSettings = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useReducer(
    (state: IState, setState: Partial<IState>) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );


  console.log(state);
  

  const {
    data: project,
    isLoading,
    error,
  } = useQuery(["groupData", id], () => getProject(Number(id)));

  useEffect(() => {
    if (project) {
      setState({
        items: project.statuses.sort((a: IStatus, b: IStatus) => a.order - b.order),
        statusNotificationPermissions: JSON.parse(project.statusNotificationPermissions),
        projectNotificationPermissions: JSON.parse(project.projectNotificationPermissions)
      });

      if(!state.users.length) getUsers();
    }
  }, [isLoading]);

  const getUsers = async () => {
    const users = await getUsersData(`${project.group_id}`)
    // @ts-ignore
    setState({ users: users });
  };

  const deleteProject = async () => {
    if (confirm(t('confirmText'))) {
      try {
        const response = await axiosClient.delete("/project/" + id);
        if (response) {
          navigate("/");
        }
      } catch (error) {
        console.log("delete project error: " + error);
      }
    }
  };

  const editNotification = async (type: string, value: boolean) => {
    const result = await axiosClient.put("/project/" + id + "/notification", {
      type,
      value: value,
    });

    if(result)
    {
      setState({
        statusNotificationPermissions: JSON.parse(result.data.statusNotificationPermissions),
        projectNotificationPermissions: JSON.parse(result.data.projectNotificationPermissions)
      });
    }
  };

  if (isLoading) return <Loader />;
  // @ts-ignore
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className='p-3'>
      {/* status permissions */}
      <div className='px-3 flex items-center justify-between'>
        <p className='text-slate-500 uppercase text-[13px] font-normal'>
          {t('status_settings')}
        </p>
        <p
          className='font-normal text-[15px] text-customBlue'
          onClick={() => {
            editNotification("todo", false)
            editNotification("in_progress", false)
            editNotification("testing", false)
            editNotification("completed", false)
          }}
        >
          {t('turn_off_all')}
        </p>
      </div>

      <div className='mt-2 flex flex-col bg-white rounded-[16px] overflow-hidden'>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6 font-sfpro'
            >
              {t('to_do')}
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.statusNotificationPermissions.includes("todo")}
              onChange={() => editNotification("todo", !state.statusNotificationPermissions.includes("todo"))}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6 font-sfpro'
            >
              {t('in_progress')}
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.statusNotificationPermissions.includes("in_progress")}
              onChange={() => editNotification("in_progress", !state.statusNotificationPermissions.includes("in_progress"))}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>

        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6 font-sfpro'
            >
              {t('testing')}
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.statusNotificationPermissions.includes("testing")}
              onChange={() => editNotification("testing", !state.statusNotificationPermissions.includes("testing"))}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6 capitalize font-sfpro'
            >
              {t('completed')}
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.statusNotificationPermissions.includes("completed")}
              onChange={() => editNotification("completed", !state.statusNotificationPermissions.includes("completed"))}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
      </div>
      <p className='text-[13px] font-normal text-customGrayDark px-3 mt-2'>
        {t('noti_text')}
      </p>

      <div className='px-3 flex items-center justify-between mt-5'>
        <p className='text-slate-500 uppercase text-[13px] font-normal'>
          {t('notifications_in_chat')}
        </p>
        <p
          className='font-normal text-[15px] text-customBlue'
          onClick={() => {
            editNotification("create", false)
            editNotification("edit", false)
            editNotification("archive", false)
            editNotification("delete", false)
          }}
        >
          {t('turn_off_all')}
        </p>
      </div>
      <div className='mt-2 flex flex-col bg-white rounded-[16px] overflow-hidden'>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6 font-sfpro'
            >
              {t('create_task')}
            </p>
            <p
              className='font-normal text-[13px] text-customBlack leading-3 font-sfpro'
            >
              /add
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.projectNotificationPermissions.includes("create")}
              onChange={() => editNotification("create", !state.projectNotificationPermissions.includes("create"))}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6 font-sfpro'
            >
              {t('edit_task')}
            </p>
            <p
              className='font-normal text-[13px] text-customBlack leading-3 font-sfpro'
            >
              /edit
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.projectNotificationPermissions.includes("edit")}
              onChange={() => editNotification("edit", !state.projectNotificationPermissions.includes("edit"))}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6 font-sfpro'
            >
              {t('add_task_to_archive')}
            </p>
            <p
              className='font-normal text-[13px] text-customBlack leading-3 font-sfpro'
            >
              /archive
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.projectNotificationPermissions.includes("archive")}
              onChange={() => editNotification("archive", !state.projectNotificationPermissions.includes("archive"))}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6 font-sfpro'
            >
              {t('delete_task')}
            </p>
            <p
              className='font-normal text-[13px] text-customBlack leading-3 font-sfpro'
            >
              /delete
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.projectNotificationPermissions.includes("delete")}
              onChange={() => editNotification("delete", !state.projectNotificationPermissions.includes("delete"))}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
      </div>
      <p className='text-[13px] font-normal text-customGrayDark px-3 mt-2'>
        {t('noti_text')}
      </p>

      <div className='flex flex-col gap-[7px] bg-white rounded-[16px] overflow-hidden mt-4'>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6 font-sfpro'
            >
              {t('show_comments')}
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.projectNotificationPermissions.includes("comment")}
              onChange={() => editNotification("comment", !state.projectNotificationPermissions.includes("comment"))}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
      </div>

      <p className='px-3 text-slate-500 uppercase text-[12px] mt-4'>
        {t('group_members')}
      </p>
      <div className='mt-2 p-1 bg-white rounded-xl'>
        {state.users.length ? (
          state.users.map((user: IUser, index: number) => (
            <div key={index} className='flex  py-1 items-center h-[44px] '>
              <div className='min-w-[44px] ml-2'>
                <AvatarUser
                  image={user.image || ""}
                  alt={user.name}
                  width={32}
                  height={32}
                  id={user.telegram_id}
                />
              </div>
              <div
                className={`ml-2 ${
                  state.users.length - 1 === index ? "" : "border-b"
                }  w-full`}
              >
                <p className='text-sm font-sans'>{user.name}</p>
                <p className='text-[12px] font-sans text-gray-400'>
                  @{user.username}
                </p>
              </div>
            </div>
          ))
        ) : (
          <Loader />
        )}
      </div>
      <div
        onClick={deleteProject}
        className='h-[50px] flex items-center justify-center mt-4 mb-[42px] rounded-xl bg-gray-300 text-customRed text-[17px] font-medium font-sfpro'
      >
        {capitalizeFirstLetter(t('delete') + " " + t('project'))}
      </div>
    </div>
  );
};

export default GroupSettings;
