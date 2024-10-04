// import { FaMinus, FaPlus } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { AvatarUser } from "../components/mini/AvatarUser";
import axiosClient from "../common/axiosClient";
import {
  useQuery,
  // useQueryClient
} from "react-query";
import { Loader } from "../components/mini/Loader";
import { useContext, useEffect, useReducer } from "react";
import languages from "../local/languages.json";
import { StateContext } from "../context/StateContext";
import WebApp from "@twa-dev/sdk";
import imageCacheChacker from "../common/imagesCacher";

const getProject = async (id: number) => {
  const response = await axiosClient.get("/project/show/" + id);
  return response.data;
};

const initialState = {
  items: [],
  users: [],
  statusText: "",
  addPermission: false,
  statusPermission: false,
  commentPermission: false,
};

const GroupSettings = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  const { id } = useParams();
  const { lang, capitalizeFirstLetter, availableUserImages, setContextState } = useContext(StateContext);
  const navigate = useNavigate();
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
  } = useQuery(["groupData", id], () => getProject(Number(id)));

  useEffect(() => {
    if (project) {
      getUsers();
      setState({
        items: project.statuses.sort((a: any, b: any) => a.order - b.order),
        addPermission: project.add_permission,
        statusPermission: project.status_permission,
        commentPermission: project.comment_permission,
      });
    }
  }, [project]);

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
    setState({ users: result });
  };

  const deleteProject = async () => {
    if (confirm(locales[lang].confirmText)) {
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

  // const initStatus = async () => {
  //   try {
  //     const response = await axiosClient.post("status", {
  //       project_id: id,
  //       name: state.statusText,
  //       lang,
  //     });
  //     if (response) {
  //       queryClient.invalidateQueries({
  //         queryKey: ["groupData"],
  //       });
  //       setState({ statusText: "" });
  //     }
  //   } catch (error) {
  //     console.log("initStatus error: " + error);
  //   }
  // };

  const editNotification = async (type: string, value: boolean) => {
    if (type === "create") {
      setState({ addPermission: value });
    } else if (type === "status") {
      setState({ statusPermission: value });
    } else if (type === "comment") {
      setState({ commentPermission: value });
    }
    await axiosClient.put("/project/" + id + "/notification", {
      type,
      value: value,
    });
  };

  // const deleteStatus = async (name: string, status_id: number) => {
  //   if (confirm("'" + name + "' " + locales[lang].confirmText)) {
  //     try {
  //       const response = await axiosClient.delete("/status/" + status_id);
  //       if (response) {
  //         queryClient.invalidateQueries({
  //           queryKey: ["groupData"],
  //         });
  //       }
  //     } catch (error) {
  //       console.log("delete project error: " + error);
  //     }
  //   }
  // };

  if (isLoading) return <Loader />;
  // @ts-ignore
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className='p-3'>
      <div className='px-3 flex items-center justify-between'>
        <p className='text-slate-500 uppercase text-[13px] font-normal'>
          {locales[lang].notifications_in_chat}
        </p>
        <p
          className='font-normal text-[15px] text-customBlue'
          onClick={() => {
            editNotification("create", !state.addPermission);
            editNotification("status", !state.statusPermission);
          }}
        >
          {locales[lang].turn_off_all}
        </p>
      </div>
      <div className='mt-2 flex flex-col bg-white rounded-[16px] overflow-hidden'>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6'
              style={{ fontFamily: "SF Pro Display " }}
            >
              {locales[lang].create_task}
            </p>
            <p
              className='font-normal text-[13px] text-customBlack leading-3'
              style={{ fontFamily: "SF Pro Display " }}
            >
              /add
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.addPermission}
              onChange={() => editNotification("create", !state.addPermission)}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6'
              style={{ fontFamily: "SF Pro Display " }}
            >
              {locales[lang].edit_task}
            </p>
            <p
              className='font-normal text-[13px] text-customBlack leading-3'
              style={{ fontFamily: "SF Pro Display " }}
            >
              /edit
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              // checked={state.statusPermission}
              // onChange={() => editNotification("status", !state.statusPermission)}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6'
              style={{ fontFamily: "SF Pro Display " }}
            >
              {locales[lang].change_task_status}
            </p>
            <p
              className='font-normal text-[13px] text-customBlack leading-3'
              style={{ fontFamily: "SF Pro Display " }}
            >
              /changestatus
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.statusPermission}
              onChange={() =>
                editNotification("status", !state.statusPermission)
              }
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>{" "}
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6'
              style={{ fontFamily: "SF Pro Display " }}
            >
              {locales[lang].add_task_to_archive}
            </p>
            <p
              className='font-normal text-[13px] text-customBlack leading-3'
              style={{ fontFamily: "SF Pro Display " }}
            >
              /archive
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              // checked={state.statusPermission}
              // onChange={() => editNotification("status", !state.statusPermission)}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6'
              style={{ fontFamily: "SF Pro Display " }}
            >
              {locales[lang].delete_task}
            </p>
            <p
              className='font-normal text-[13px] text-customBlack leading-3'
              style={{ fontFamily: "SF Pro Display " }}
            >
              /delete
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              // checked={state.statusPermission}
              // onChange={() => editNotification("status", !state.statusPermission)}
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
      </div>
      <p className='text-[13px] font-normal text-customGrayDark px-3 mt-2'>
        Бот будет присылать уведомления в групповой чат при этих событиях
      </p>

      <div className='flex flex-col gap-[7px] bg-white rounded-[16px] overflow-hidden mt-4'>
        <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
          <div>
            <p
              className='text-[17px] font-normal leading-6'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {locales[lang].show_comments}
            </p>
          </div>
          <label className='relative inline-flex cursor-pointer items-center'>
            <input
              id='switch2'
              type='checkbox'
              className='peer sr-only'
              checked={state.commentPermission}
              onChange={() =>
                editNotification("comment", !state.commentPermission)
              }
            />
            <label htmlFor='switch2' className='hidden'></label>
            <div className="peer h-[31px] w-[51px] rounded-full border bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:border after:border-stale-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
          </label>
        </label>
      </div>

      <p className='px-3 text-slate-500 uppercase text-[12px] mt-4'>
        {locales[lang].group_members}
      </p>
      <div className='mt-2 p-1 bg-white rounded-xl'>
        {state.users.length ? (
          state.users.map((user: any, index: number) => (
            <div key={index} className='flex  py-1 items-center h-[44px] '>
              <div className='min-w-[44px] ml-2'>
                <AvatarUser
                  image={user.image}
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
        className='h-[50px] flex items-center justify-center mt-4 mb-[42px] rounded-xl bg-gray-300 text-customRed text-[17px] font-medium'
        style={{ fontFamily: "SF Pro Display" }}
      >
        {capitalizeFirstLetter(locales[lang].delete + " " + locales[lang].project)}
      </div>
    </div>
  );
};

export default GroupSettings;
