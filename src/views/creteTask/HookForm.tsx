import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../common/axiosClient";
import { IUser } from "../../components/Comment";
import Square from "../../assets/icons/Square";
import { useState } from "react";
import File from "../../assets/icons/File";
import { t } from "i18next";
import { Avatar } from "../../components/mini/Avatar";
import User from "../../assets/icons/User";
import { AvatarUser } from "../../components/mini/AvatarUser";
import ArrowRight from "../../assets/icons/ArrowRight";
import Prioritet from "../../assets/icons/Prioritet";
import Calendar from "../../assets/icons/Calendar";

interface FormValues {
  name: string;
  description: string;
}

const HookForm = ({
  project_id,
  selectPriority,
  selectedUsers,
  selectStoryPoint,
  project,
  setOpenParticipant,
  setOpenPriority,
  setOpenStoryPoint,
}: any) => {
  const navigate = useNavigate();

  const [areaValue, setareaValue] = useState("");
  const handleChange = (event: any) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setareaValue(textarea.value)
  };

  // Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: any) => {
    console.log(data);

    const taskData = {
      project_id,
      name: data.name,
      description: data.description,
      priority: selectPriority,
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


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                className='text-black tex-[16px] font-normal font-sans capitalize'
                style={{ fontFamily: "SF Pro Display" }}
              >
                {t("project")}
              </p>
            </div>

            <div className='flex items-center gap-1 text-gray-400'>
              <p
                className='text-[16px] font-normal text-[#1B1F26]'
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

          <div className='bg-white shadow-customShadow rounded-xl mt-5 cursor-pointer'>
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
                  {t("participant")}
                </p>
              </div>

              <div
                className='flex items-center gap-1 text-gray-400'
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
                    className='font-normal text-[16px] text-customBlack mr-[-10px]'
                    style={{ fontFamily: "SF Pro Display" }}
                  >
                    {t("appoint")}
                  </p>
                )}
                <div className='ml-3'>
                  <ArrowRight />
                </div>
              </div>
            </div>
            {/* Priority */}
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
                  {t("priority")}
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
            {/* Story Point */}
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
                  {t("story_point")}
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
    </>
  );
};

export default HookForm;
