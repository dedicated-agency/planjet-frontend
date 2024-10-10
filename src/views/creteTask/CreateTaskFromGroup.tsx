import { useEffect, useState } from "react";
import { useGetTasks } from "../../common/fetchTasks";
import { Loader } from "../../components/mini/Loader";
import { useParams } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import getUsersData from "../../common/getUsersData";
import { t } from "i18next";
import { useUserContext } from "../../context/UserContext";
import { IUser } from "../../components/Comment";
import StoryPoint from "./StoryPoint";
import Participant from "./Participant";
import Priority from "./Priority";
import HookForm from "./HookForm";

export interface IPriority {
  title: string;
}

const priorities = [
  {
    title: t("priority_data_1"),
  },
  {
    title: t("priority_data_2"),
  },
  {
    title: t("priority_data_3"),
  },
];

const CreateTaskFromGroup = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  useEffect(() => {
    WebApp.setHeaderColor("#F2F2F7");
  }, []);
  const { project_id } = useParams();
  const { user } = useUserContext();
  const [selectPriority, setSelectPriority] = useState<number>(2);
  const [openPriority, setOpenPriority] = useState(false);
  const [openParticipant, setOpenParticipant] = useState(false);
  const [openStoryPoint, setOpenStoryPoint] = useState(false);
  const [selectStoryPoint, setSelectStoryPoint] = useState(0);
  const [storyPoint, setStoryPoint] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [focusStoryPoint, setFocusStoryPoint] = useState(false);

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
  

  const {
    data: project,
    isLoading,
    error,
  } = useGetTasks(
    {
      user_id: user.telegram_id,
    },
    Number(project_id),
  );
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
    <>
      <div className='fixed top-0 left-0 right-0 flex justify-between h-[56px] items-center bg-[#f2f2f7] p-3'>
        <div className='text-gray-500 h-full w-[60px] flex items-center'></div>
        <div>{"Create"}</div>
        <div className='text-gray-500 h-full w-[60px] flex items-center justify-end'></div>
      </div>
      <div className='h-[56px]'></div>
      <HookForm
        project_id={project_id}
        selectPriority={selectPriority}
        selectedUsers={selectedUsers}
        selectStoryPoint={selectStoryPoint}
        project={project}
        setOpenParticipant={setOpenParticipant}
        setOpenPriority={setOpenPriority}
        setOpenStoryPoint={setOpenStoryPoint}
      />
      {/* Priority */}
      <Priority
        openPriority={openPriority}
        setOpenPriority={setOpenPriority}
        setSelectPriority={setSelectPriority}
        priorities={priorities}
        selectPriority={selectPriority}
      />
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
    </>
  );
};

export default CreateTaskFromGroup;
