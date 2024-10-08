import {
  useEffect,
  useState,
} from "react";
import { useQuery } from "react-query";
import { fetchData } from "../common/fetchData";
import { Link } from "react-router-dom";
import EllipsisText from "./EllipsisText";
import projectplus from "../assets/images/projectplus.svg";
import useUserColor from "../common/useUserColor";
import { IUserData } from "../common/sendData";
import { t } from "i18next";
import { useUserContext } from "../context/UserContext";

const getGroups = async () => {
  return await fetchData("/group/selected", {});
};

interface IGroup {
  id: number,
  name: string,
  groupUsers: IUser[],
  users: IUser[],
  tasks: number
}

interface IUser {
  group_id: number,
  is_selected: boolean,
  user: IUserData,
  user_id: number,
}

const BigProjects = () => {
  const context = useUserContext()
  const [groups, setGroups] = useState<IGroup[]>([]);
  const { data, error } = useQuery(["groupSelect"], () => getGroups());

  useEffect(() => {
    context.updateUserState({location: "home" });
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
          className='font-normal text-[13px] text-customGrayDark uppercase'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {t('project')}
        </p>
        <Link
          to={"/settingsprojects"}
          className='text-gradient-blue text-[15px] font-normal h-full items-center flex'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {t('configure')}
        </Link>
      </div>
      {groups.length === 0 && (
        <>
          <div className='flex flex-col justify-center items-center text-customGrayDark text-[16px] mt-10'>
            <p
              className='text-customGrayDark text-[16px]'
              style={{ fontFamily: "SF Pro Display" }}
            >
              <img src={projectplus} alt='projectplus' />
              {/* {t('no_projects} */}
            </p>
            <Link
              to={"/settingsprojects"}
              className='text-gradient-blue text-[15px] font-normal h-full items-center flex'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {t('add')} {t('project')}
            </Link>
          </div>
        </>
      )}
      <div className='flex gap-[8px] overflow-x-scroll scrollbar-hidden px-3'>
        {groups.map((project: IGroup, index: number) => (
          <div key={index} className='relative'>
            <Link
              to={"/groups/" + project.id}
              className='h-[150px] min-w-[220px] rounded-[16px] p-[16px] flex flex-col justify-between flex-1 transtin'
              style={{
                background: useUserColor(project.id).lightColor,
              }}
            >
              <div>
                <div className='flex justify-between'>
                  <div className='flex gap-[8px]'>
                    <div
                      className=''
                      style={{ color: `rgba(255, 255, 255, 1)` }}
                    >
                      <EllipsisText
                        text={project.name}
                        width='175px' // O'lchovini berish
                      />
                      <p
                        className='text-[12px] font-normal leading-3	text-customWhite1'
                        style={{ fontFamily: "SF Pro Display" }}
                      >
                        {project.users.length} {t('participant')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-between bg-customWhite rounded-[10px] h-[45px] p-[12px] border-[1px] border-customGrey3'>
                <p
                  className='text-[15px] text-white font-medium'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {t('active_tasks')}
                </p>
                <p
                  className='text-[15px] text-white font-semibold'
                  style={{ fontFamily: "SF Pro Display" }}
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
