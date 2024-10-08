import WebApp from "@twa-dev/sdk";
import { useContext, useEffect, useState } from "react";
import { Avatar } from "../components/mini/Avatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StateContext } from "../context/StateContext";
import { FaAngleRight } from "react-icons/fa6";
import { useQuery } from "react-query";
import { fetchData } from "../common/fetchData";
import { Loader } from "../components/mini/Loader";
import { AvatarUser } from "../components/mini/AvatarUser";
import getUsersData from "../common/getUsersData";
import { t } from "i18next";
import { IUser } from "../components/Comment";

const getGroup = async (id: number) => {
  return await fetchData("/group/" + id, {});
};

interface IGroup { 
  image: string;
  user: IUser;
}

interface IProject {
  id: number;
  name: string;
  tasks: [],
  topic_id: number;
}

const Projects = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());

  const { id } = useParams();
  const { location } = useContext(StateContext);
  const navigate = useNavigate();
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [openParticipant, setOpenParticipant] = useState(false);

  const { data, error, isLoading } = useQuery(["groupData", id], () =>
    getGroup(Number(id)),
  );

  console.log(data);
  

  const getData = async () => {
    const returnGroup = await getUsersData(`${id}`);
    setGroups(returnGroup);
  };

  useEffect(() => {
    if (data && data.projects.length === 1) {
      if (location === "home") {
        navigate("/projects/" + data.projects[0].id);
      } else {
        navigate("/");
      }
    }
    if (data) {
      getData();
    }
  }, [data]);

  if (isLoading) return <Loader />;
  // @ts-ignore
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <nav className='fixed h-[80px] mt-[12px] w-full top-0 max-w-[700px] mx-auto flex justify-between items-center px-3'>
        <div className='bg-customPurple flex justify-between rounded-[20px] w-full h-full p-[16px]'>
          <div className='flex items-center text-gray-700 gap-2 cursor-pointer'>
            <Avatar image={""} alt={data.name} width={48} radius={12} id={Number(id)} />
            <div>
              <p
                className='text-[17px] text-white font-medium p-0 m-0'
                style={{ fontFamily: "SF Pro Display " }}
              >
                {data.name}
              </p>
              <p
                className='text-[12px] text-gray-300'
                style={{ fontFamily: "SF Pro Display " }}
              >
                {data.groupUsers.length} {t('participant')}
              </p>
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <div className={false ? `hidden` : `relative`}>
              <div
                className='absolute z-10 top-[-16px] right-[9px] rounded-[16px] min-w-[60px] flex gap-4 items-center p-1 cursor-pointer'
                onClick={() => {
                  // setState({ selector: false });
                  setOpenParticipant(true);
                }}
              >
                <div className='flex'>
                  {groups.length > 3 ? (
                    <>
                      {groups.slice(0, 3).map((user: IGroup, index: number) => (
                        <AvatarUser
                          alt={user?.user?.name || " "}
                          image={user?.image}
                          width={28}
                          height={28}
                          key={index}
                          id={user?.user?.telegram_id}
                        />
                      ))}
                      <div
                        className={`mr-[-12px] w-[28px] h-[28px] min-w-[28px] min-h-[28px] rounded-full border-[1.5px] border-customWhite2 bg-gray-100 flex justify-center items-center text-customBlack uppercase text-[13px]`}
                      >
                        <p className='relative t-[3px]'>
                          +{groups.length - 3 >= 9 ? 9 : groups.length - 3}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {groups.map((user: IGroup, index: number) => (
                        <AvatarUser
                          alt={user?.user?.name || " "}
                          image={user?.image}
                          height={28}
                          key={index}
                          id={user?.user?.telegram_id}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className='h-[80px] w-full'></div>
      <div className='p-3 mt-[16px]'>
        {data.projects.length > 0 &&
          data.projects
            .filter((el: IProject) => el.topic_id == 1)
            .map((item: IProject) => (
              <Link
                to={"/projects/" + item.id}
                key={item.id}
                className='w-full h-[56px] px-[16px] flex justify-between bg-white rounded-[16px]'
              >
                <div className='flex items-center gap-3'>
                  <Avatar image={""} alt={"#"} width={28} radius={6} id={item.id} />
                  <p
                    className='text-[17px] text-black'
                    style={{ fontFamily: "SF Pro Display " }}
                  >
                    {item.name}
                  </p>
                </div>
                <div className='flex items-center gap-1'>
                  <div
                    className='text-[13px] font-bold text-white bg-customGrey1 px-[4px] py-[2px] rounded-3xl min-w-[20px] text-center'
                    style={{ fontFamily: "SF Pro Display " }}
                  >
                    {item.tasks.length}
                  </div>
                  <div className='text-gray-300 text-lg'>
                    <FaAngleRight />
                  </div>
                </div>
              </Link>
            ))}
        <div className='bg-white rounded-xl overflow-hidden mt-[8px]'>
          <div className='flex flex-col w-full'>
            {data.projects.length > 0 &&
              data.projects
                .filter((el: IProject) => el.topic_id != 1)
                .map((item: IProject) => (
                  <Link
                    to={"/projects/" + item.id}
                    key={item.id}
                    className='w-full h-[52px] px-[16px] flex justify-between bg-white'
                  >
                    <div className='flex items-center gap-3'>
                      <Avatar
                        image={""}
                        alt={item.name}
                        width={28}
                        radius={6}
                        id={item.id}
                      />
                      <p
                        className='text-[17px] text-black capitalize'
                        style={{ fontFamily: "SF Pro Display " }}
                      >
                        {item.name}
                      </p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div
                        className='text-[12px] font-bold text-blue-500 bg-blue-200 px-[4px] py-[2px] rounded-3xl min-w-[20px] text-center'
                        style={{ fontFamily: "SF Pro Display " }}
                      >
                        {item.tasks.length}
                      </div>
                      <div className='text-gray-300 text-lg'>
                        <FaAngleRight />
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </div>
      {/* bottom */}
      {openParticipant && (
        <div
          className='bg-black opacity-45 z-20 fixed top-0 w-full h-full'
          onClick={() => {
            setOpenParticipant(false);
          }}
        ></div>
      )}
      <div
        className={`${
          openParticipant ? "bottom-3" : "bottom-[-100%]"
        } overflow-y-scroll max-h-[70%] z-[100] fixed left-3 right-3 transition-all scrollbar-hidden rounded-[25px] bg-white px-3 py-5 flex flex-col gap-2`}
      >
        {groups.map((user: IGroup, index: number) => (
          <div
            key={index}
            // onClick={() => {
            //   setParticipants(user);
            // }}
            className={`p-4 rounded-xl flex justify-between items-center`}
          >
            <div className='flex items-center gap-4'>
              <AvatarUser
                image={user.image}
                alt={user.user.name}
                id={user?.user?.telegram_id}
              />
              <div className='ml-3'>
                <p
                  className='text-[17px] font-normal text-black leading-5'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  {user.user.name}
                </p>
                <p
                  className='text-[14px] font-normal text-customBlack leading-3'
                  style={{ fontFamily: "SF Pro Display" }}
                >
                  @{user.user.username}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Projects;