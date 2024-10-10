import { useEffect, useState } from "react";
import { useGetTasks } from "../../common/fetchTasks";
import { Loader } from "../../components/mini/Loader";
import { useNavigate, useParams } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import getUsersData from "../../common/getUsersData";
import { t } from "i18next";
import { useUserContext } from "../../context/UserContext";
import { IUser } from "../../components/Comment";
import StoryPoint from "./StoryPoint";
import Participant from "./Participant";
import Priority from "./Priority";
import { Controller, useForm } from "react-hook-form";
import ArrowRight from "../../assets/icons/ArrowRight";
import Calendar from "../../assets/icons/Calendar";
import { AvatarUser } from "../../components/mini/AvatarUser";
import User from "../../assets/icons/User";
import { Avatar } from "../../components/mini/Avatar";
import File from "../../assets/icons/File";
import Square from "../../assets/icons/Square";
import axiosClient from "../../common/axiosClient";

export interface IPriority {
  title: string;
}

interface FormValues {
  name: string;
  description: string;
  priority: number;
  participant: number[];
}

const CreateTaskFromGroup = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  useEffect(() => {
    WebApp.setHeaderColor("#F2F2F7");
  }, []);
  const navigate = useNavigate();
  const { project_id } = useParams();
  const { user } = useUserContext();
  const [openParticipant, setOpenParticipant] = useState(false);
  const [openStoryPoint, setOpenStoryPoint] = useState(false);
  const [selectStoryPoint, setSelectStoryPoint] = useState(0);
  const [storyPoint, setStoryPoint] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [focusStoryPoint, setFocusStoryPoint] = useState(false);
  const [areaValue, setareaValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: { priority: 2, name: "", description: "" },
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);

    const taskData = {
      project_id,
      name: data.name,
      description: data.description,
      priority: data.priority,
      participant: selectedUsers.map((user: IUser) => user.telegram_id),
      point: selectStoryPoint,
    };

    try {
      const response = await axiosClient.post("/task/create", taskData);
      if (response) {
        navigate("/tasks/" + response.data.id);
      }
    } catch (error) {
      console.error("Error creating task:", error);
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

  const handleChange = (event: any) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setareaValue(textarea.value);
  };

  const {
    data: project,
    isLoading,
    error,
  } = useGetTasks({ user_id: user.telegram_id }, Number(project_id));

  useEffect(() => {
    if (project) {
      getUsers();
    }
  }, [project, project_id]);

  const getUsers = async () => {
    const result = await getUsersData(project.group_id);
    // console.log({ result });
    // @ts-ignore
    setUsers(result);
  };

  if (isLoading) return <Loader />;
  // @ts-ignore
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="fixed top-0 left-0 right-0 flex justify-between h-[56px] items-center bg-[#f2f2f7] p-3">
        <div className="text-gray-500 h-full w-[60px] flex items-center"></div>
        <div>{"Create"}</div>
        <div className="text-gray-500 h-full w-[60px] flex items-center justify-end"></div>
      </div>
      <div className="h-[56px]"></div>
      <div className="p-3">
        {/* Input */}
        <div className="bg-white shadow-customShadow rounded-xl p-3 pb-2">
          <div className="flex items-center gap-[8px]">
            <div className={"relative top-[-4px]"}>
              <Square />
            </div>
            <input
              type="text"
              placeholder="Task name"
              {...register("name", { required: "Task name is required" })}
              className="w-full outline-none font-sans mb-2"
            />
          </div>
          {errors.name && (
            <p className="text-xs relative top-[-6px] h-3 text-red-500">
              {errors.name?.message}
            </p>
          )}
          <textarea
            {...register("description")}
            onChange={handleChange}
            value={areaValue}
            placeholder="Description"
            rows={1}
            style={{
              overflow: "hidden",
              resize: "none",
            }}
            className="text-[14px] font-sans text-gray-500 w-full outline-none"
          />
        </div>

        {/* Task */}
        <div className="h-[44px] flex justify-between items-center px-[16px] bg-white mt-5 rounded-xl cursor-pointer">
          <div className="flex justify-between items-center gap-2">
            <div className="text-gray-400">
              <File />
            </div>
            <p
              className="text-black tex-[16px] font-normal font-sans capitalize"
              style={{ fontFamily: "SF Pro Display" }}
            >
              {t("project")}
            </p>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <p
              className="text-[16px] font-normal text-[#1B1F26]"
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

        <div className="bg-white shadow-customShadow rounded-xl mt-5 cursor-pointer">
          {/* Participant */}
          <div className="h-[44px] flex justify-between items-center px-[16px]">
            <div className="flex justify-between items-center gap-2">
              <div className="text-gray-400">
                <User />
              </div>
              <p
                className="text-black tex-[16px] font-normal font-sans capitalize"
                style={{ fontFamily: "SF Pro Display" }}
              >
                {t("participant")}
              </p>
            </div>

            <div
              className="flex items-center gap-1 text-gray-400"
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
                  className="font-normal text-[16px] text-customBlack mr-[-10px]"
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {t("appoint")}
                </p>
              )}
              <div className="ml-3">
                <ArrowRight />
              </div>
            </div>
          </div>
          {/* Priority */}
          <Controller
            control={control}
            name="priority"
            render={({ field }) => {
              return (
                <Priority
                  setSelectPriority={field.onChange}
                  selectPriority={field.value}
                />
              );
            }}
          />

          {/* Story Point */}
          <div
            className="h-[44px] flex justify-between items-center px-[16px]"
            onClick={() => setOpenStoryPoint(true)}
          >
            <div className="flex justify-between items-center gap-2">
              <div className="flex gap-[1px] items-end justify-center text-gray-400">
                <Calendar />
              </div>
              <p
                className="text-black tex-[16px] font-normal font-sans capitalize"
                style={{ fontFamily: "SF Pro Display" }}
              >
                {t("story_point")}
              </p>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              {!selectStoryPoint ? (
                <p
                  className="font-normal text-[16px] text-customBlack"
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  0
                </p>
              ) : (
                <p className="font-normal text-[16px] font-sans text-black">
                  {selectStoryPoint}
                </p>
              )}
              <ArrowRight />
            </div>
          </div>
        </div>
        {/* Create btn */}
        <button
          type="submit"
          disabled={!!errors.name}
          className={`fixed bottom-[42px] w-[94%] py-4 rounded-xl flex justify-center items-center ${
            !!errors.name
              ? "bg-gray-300 text-gray-400"
              : "bg-custom-gradient-blue text-white"
          }`}
        >
          {" "}
          {t("create")}
        </button>
      </div>
      {/* Priority */}

      {/* Participant */}
      <Participant
        openParticipant={openParticipant}
        setOpenParticipant={setOpenParticipant}
        setSelectedUsers={setSelectedUsers}
        users={users}
        setParticipants={setParticipants}
        selectedUsers={selectedUsers}
      />
      {/* StoryPoint */}
      <StoryPoint
        openStoryPoint={openStoryPoint}
        setOpenStoryPoint={setOpenStoryPoint}
        focusStoryPoint={focusStoryPoint}
        setFocusStoryPoint={setFocusStoryPoint}
        storyPoint={storyPoint}
        setStoryPoint={setStoryPoint}
        setSelectStoryPoint={setSelectStoryPoint}
      />
    </form>
  );
};

export default CreateTaskFromGroup;
