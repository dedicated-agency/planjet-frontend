import { useEffect, useState } from "react";
import { useGetTasks } from "../../common/fetchTasks";
import { Loader } from "../../components/mini/Loader";
import { useNavigate, useParams } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { t } from "i18next";
import { useUserContext } from "../../context/UserContext";
import StoryPoint from "./StoryPoint";
import Participant from "./Participant";
import Priority from "./Priority";
import { Controller, useForm } from "react-hook-form";
import { Avatar } from "../../components/mini/Avatar";
import File from "../../assets/icons/File";
import Square from "../../assets/icons/Square";
import axiosClient from "../../common/axiosClient";
import { IUser } from "../../components/Comment";
import capitalizeFirstLetter from "../../common/capitalizeFirstLetter";
import { useMutation } from "react-query";

export interface IPriority {
  title: string;
}

interface FormValues {
  name: string;
  description: string;
  priority: number;
  participants: IUser[];
  storyPoint: number;
}

interface ITaskData {
  project_id: string | undefined;
  name: string,
  description: string,
  priority: number,
  participant: number[],
  point: number,
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

  const [areaValue, setareaValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: { priority: 2, name: "", description: "", participants: [] },
  });

  const createTaskMutation = useMutation(
    async (taskData: ITaskData) => {
      const response = await axiosClient.post("/task/create", taskData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        navigate("/tasks/" + data.id);
      },
      onError: (error) => {
        console.error("Error creating task:", error);
      },
    },
  );

  const onSubmit = async (data: FormValues) => {
    const taskData = {
      project_id,
      name: data.name,
      description: data.description,
      priority: data.priority,
      participant: data.participants.map((user: IUser) => user.telegram_id),
      point: data.storyPoint,
    };

    createTaskMutation.mutate(taskData);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  if (isLoading) return <Loader />;
  // @ts-ignore
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='fixed top-0 left-0 right-0 flex justify-between h-[56px] items-center bg-[#f2f2f7] p-3'>
        <div className='text-gray-500 h-full w-[60px] flex items-center'></div>
        <div>{"Create"}</div>
        <div className='text-gray-500 h-full w-[60px] flex items-center justify-end'></div>
      </div>
      <div className='h-[56px]'></div>
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
            {...register("description")}
            onChange={handleChange}
            value={areaValue}
            placeholder='Description'
            rows={1}
            style={{
              overflow: "hidden",
              resize: "none",
            }}
            className='text-[14px] font-sans text-gray-500 w-full outline-none'
          />
        </div>

        {/* Task */}
        <div className='h-[44px] flex justify-between items-center px-[16px] bg-white mt-5 rounded-xl cursor-pointer'>
          <div className='flex justify-between items-center gap-2'>
            <div className='text-gray-400'>
              <File />
            </div>
            <p
              className='text-black tex-[16px] font-normal capitalize font-sfpro'
            >
              {t("project")}
            </p>
          </div>

          <div className='flex items-center gap-1 text-gray-400'>
            <Avatar
              image={""}
              alt={project.name}
              width={24}
              radius={4}
              id={Number(project_id)}
            />
            <p
              className='text-[16px] font-normal text-[#1B1F26] font-sfpro'
            >
              {capitalizeFirstLetter(project.name)}
            </p>
          </div>
        </div>

        <div className='bg-white shadow-customShadow rounded-xl mt-5 cursor-pointer'>
          {/* Participant */}
          <Controller
            control={control}
            name='participants'
            render={({ field }) => {
              return (
                <>
                  <Participant
                    setSelectedUsers={field.onChange}
                    selectedUsers={field.value}
                    project={project}
                    project_id={Number(project_id)}
                  />
                </>
              );
            }}
          />
          {/* Priority */}
          <Controller
            control={control}
            name='priority'
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
          <Controller
            control={control}
            name='storyPoint'
            render={({ field }) => {
              return (
                <StoryPoint
                  storyPoint={field.value}
                  setStoryPoint={field.onChange}
                />
              );
            }}
          />
        </div>
        {/* Create btn */}
        <button
          type='submit'
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
    </form>
  );
};

export default CreateTaskFromGroup;
