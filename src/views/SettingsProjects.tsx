import { StateContext } from "../context/StateContext";
import languages from "../local/languages.json";
import { useNavigate } from "react-router-dom";
import SettingsComponent from "../components/SettingsComponent";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchPutData } from "../common/fetchPutData";
import { fetchData } from "../common/fetchData";
import WebApp from "@twa-dev/sdk";
import { useContext, useEffect, useState } from "react";

const getGroups = async () => {
  return await fetchData("/user/groups", {});
};

const updateGroup = async (id: number, isSelected: boolean) => {
  return await fetchPutData(`/group/${id}`, { is_selected: isSelected });
};



const SettingsProjects = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  const { lang } = useContext(StateContext);
  const locales: any = languages;
  const queryClient = useQueryClient();
  const { data } = useQuery(["groupsData"], () => getGroups());
  const navigate = useNavigate();

  

  const mutation = useMutation(
    (eventData: { id: number; isSelected: boolean }) =>
      updateGroup(eventData.id, eventData.isSelected),
    {
      onSuccess: () => {
        // localStorage.setItem("groupUpdateResponse", JSON.stringify(data));
        queryClient.invalidateQueries("groupsData");
        queryClient.invalidateQueries("groupSelect");
      },
    },
  );

  // const handleUpdateGroup = (id: number, isSelected: boolean) => {
  //   mutation.mutate({ id: id, isSelected });
  // };

  useEffect(() => {
    WebApp.setHeaderColor("#F2F2F7");
  }, []);

  const [selectedGroups, setSelectedGroups] = useState<Record<number, boolean>>(
    {},
  );

  const handleUpdateGroup = (id: number, isSelected: boolean) => {
    setSelectedGroups((prev) => ({ ...prev, [id]: isSelected }));
  };

  const handleSave = () => {
    Object.entries(selectedGroups).forEach(([id, isSelected]) => {
      mutation.mutate({ id: parseInt(id), isSelected });
    });
    navigate("/");
  };

  return (
    <div className='px-3 relative'>
      <div className='h-[56px]' />
      <div className='fixed top-0 left-0 right-0 flex justify-between h-[56px] items-center p-3 bg-[#f2f2f7] z-10'>
        <div className='text-gray-500 h-full w-[60px] flex items-center'></div>
        <p
          className='font-medium text-[17px] text-customDark capitalize'
          style={{ fontFamily: "Sf Pro Display" }}
        >
          {locales[lang].project_settings}
        </p>
        <div
          className='w-[60px] h-full flex justify-end items-center'
          // onClick={() => setOpenParticipant(true)}
        ></div>
      </div>
      <div className='flex flex-col gap-[7px] bg-white rounded-[16px] overflow-hidden'>
        {data?.map((group: any, index: number) => (
          <SettingsComponent
            key={index}
            group={group}
            handleUpdateGroup={handleUpdateGroup}
            isSelected={selectedGroups[group.id] || group.is_selected}
          />
        ))}
      </div>
      <div className='fixed bg-[#f2f2f7] bottom-0 left-3 right-3 flex justify-center pb-[42px] pt-[8px]'>
        <div
          className='  w-[94%] bg-custom-gradient-blue text-white flex justify-center items-center py-4 rounded-xl'
          onClick={handleSave}
        >
          {locales[lang].save}
        </div>
      </div>
    </div>
  );
};

export default SettingsProjects;
