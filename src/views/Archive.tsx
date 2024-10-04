import { useParams } from "react-router-dom";
import ArchiveComponent from "../components/ArchiveComponent";
import { fetchData } from "../common/fetchData";
import { useQuery } from "react-query";
import { useGetTasks } from "../common/fetchTasks";
import { Avatar } from "../components/mini/Avatar";
import WebApp from "@twa-dev/sdk";
import { useContext } from "react";
import { StateContext } from "../context/StateContext";

const getArchiveById = async (id: any) => {
  return await fetchData(`project/${id}/archive`, {});
};

import languages from "../local/languages.json";

const Archive = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  const { id } = useParams();

  const { data: project } = useGetTasks(
    {
      // status: state.selectedStatus,
      // user_ids: state.selectedUsers,
      // user_id: state.currectUser !== 0 ? state.currectUser.telegram_id : null
    },
    Number(id),
  );

  const { data: archiveById } = useQuery(["EventsById"], () =>
    getArchiveById(id),
  );

  const { lang } = useContext(StateContext);
  const locale: any = languages;

  return (
    <div>
      <div className='h-[56px]' />
      <div className='fixed top-0 left-0 right-0 flex justify-between h-[56px] items-center p-3 bg-[#f2f2f7]'>
        <div
          className='text-gray-500 h-full w-[60px] flex items-center'
        >
        </div>
        <p className='font-medium text-[17px] text-customDark capitalize'>
          {locale[lang].archive_files}
        </p>
        <div className='w-[60px] flex justify-end'>
          <Avatar image={""} alt={project?.name || " "} radius={6} width={28} id={project?.id} />
        </div>
      </div>
      <div className='px-3 mt-2 flex flex-col gap-2'>
        {archiveById?.map((archive: any, index: number) => (
          <ArchiveComponent key={index} archive={archive} />
        ))}
      </div>
    </div>
  );
};

export default Archive;