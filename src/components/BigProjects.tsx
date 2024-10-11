import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchData } from "../common/fetchData";
import { Link } from "react-router-dom";
import EllipsisText from "./EllipsisText";
import projectplus from "../assets/images/projectplus.svg";
import useUserColor from "../common/useUserColor";
import { IUserData } from "../common/sendData";
import { t } from "i18next";
import { useUserContext } from "../context/UserContext";
import { Avatar } from "./mini/Avatar";

const getGroups = async () => {
  return await fetchData("/group/selected", {});
};

interface IGroup {
  id: number;
  name: string;
  groupUsers: IUser[];
  users: IUser[];
  tasks: number;
}

interface IUser {
  group_id: number;
  is_selected: boolean;
  user: IUserData;
  user_id: number;
}

const BigProjects = () => {
  const { updateUserState } = useUserContext();
  const [groups, setGroups] = useState<IGroup[]>([]);
  const { data, error } = useQuery(["groupSelect"], () => getGroups());

  useEffect(() => {
    updateUserState({ location: "home" });
    if (data?.length) {
      getData();
    }
  }, [data]);

  const getData = async () => {
    const result = data.map(async (group: IGroup) => {
      const returnGroup: IGroup = group;
      returnGroup.users = group.groupUsers;
      return returnGroup;
    });

    setGroups(await Promise.all(result));
  };

  // if (isLoading || !groups.length) return <Loader />;
  // @ts-ignore
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className='mt-2'>
      <div className='px-3 h-[36px] flex items-center justify-between'>
        <p
          className='font-normal text-[13px] text-customGrayDark uppercase font-sfpro'
        >
          {t("project")}
        </p>
        <Link
          to={"/settingsprojects"}
          className='text-gradient-blue text-[15px] font-normal h-full items-center flex font-sfpro'
        >
          {t("configure")}
        </Link>
      </div>
      {groups.length === 0 && (
        <>
          <div className='flex flex-col justify-center items-center text-customGrayDark text-[16px] mt-10'>
            <p
              className='text-customGrayDark text-[16px] font-sfpro'
            >
              <img src={projectplus} alt='projectplus' />
              {/* {t('no_projects} */}
            </p>
            <Link
              to={"/settingsprojects"}
              className='text-gradient-blue text-[15px] font-normal h-full items-center flex font-sfpro'
            >
              {t("add")} {t("project")}
            </Link>
          </div>
        </>
      )}
      <div className='flex gap-[8px] overflow-x-scroll scrollbar-hidden px-3'>
        {groups.map((project: IGroup, index: number) => (
          <div
            key={index}
            className='w-auto relative border-2 rounded-[16px] h-[150px] min-w-[230px] shadow-custom510 overflow-hidden'
            style={{
              borderColor:
                useUserColor(project.id).lightColor.id === 1
                  ? "rgba(86, 148, 214, .5)"
                  : useUserColor(project.id).lightColor.id === 2
                  ? "rgba(68, 169, 171, .5)"
                  : useUserColor(project.id).lightColor.id === 3
                  ? "rgba(214, 86, 148, .5)"
                  : useUserColor(project.id).lightColor.id === 4
                  ? "rgba(222, 121, 119, 0.5)"
                  : useUserColor(project.id).lightColor.id === 5
                  ? "rgba(100, 99, 176, .5)"
                  : "",
            }}
          >
            <Link
              to={"/groups/" + project.id}
              className={`h-full w-full p-[16px] flex flex-col justify-between flex-1`}
              style={{
                background: useUserColor(project.id).lightColor.color,
              }}
            >
              <div>
                <div className='flex justify-between'>
                  <div className='flex gap-[8px]'>
                    <Avatar
                      image={""}
                      alt={project.name}
                      id={project.id}
                      radius={8}
                      bgColor={true}
                      width={36}
                    />
                    <div
                      className=''
                      style={{ color: `rgba(255, 255, 255, 1)` }}
                    >
                      <EllipsisText text={project.name} width='150px' />
                      <p
                        className='text-[12px] font-normal leading-3	text-customWhite1 font-sfpro'
                      >
                        {project.users.length} {t("participant")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-between bg-customWhite rounded-[10px] h-[45px] p-[12px] border border-customGrey3'>
                <p
                  className='text-[15px] text-white font-medium font-sfpro'
                >
                  {t("active_tasks")}
                </p>
                <p
                  className='text-[15px] text-white font-semibold font-sfpro'
                >
                  {project.tasks}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BigProjects;
