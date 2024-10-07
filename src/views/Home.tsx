import { useEffect, useState } from "react";
import BigProjects from "../components/BigProjects";
import Command from "../components/Command";
import EventsPromo from "../components/EventsPromo";
import WebApp from "@twa-dev/sdk";
import { Link } from "react-router-dom";
import SymbolFill from "../assets/icons/SymbolFill";
import ArrowRight from "../assets/icons/ArrowRight";
import { AddTaskButtonHome } from "../components/AddTaskButtonHome";
import UserNavbar from "../components/UserNavbar";
import { t } from "i18next";
import axiosClient from "../common/axiosClient";


const Home = () => {
  const BackButton = WebApp.BackButton;
  BackButton.hide();
  const [isOpenCommand, setIsOpenCommand] = useState(false);
  const [myTasks, setMyTasks] = useState(0)
  

  useEffect(() => {
    WebApp.setHeaderColor("#F2F2F7");
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    if (!onboardingCompleted) {
      setIsOpenCommand(true);
    }
    getTasks();
  }, []);


  const getTasks = async () => {
    try {
      const response: any = await axiosClient.get("/user/tasks");
      if (response && response.data) {
        setMyTasks(response.data.length);
      } else {
        setMyTasks(response.data.length);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setMyTasks(0);
    }
  };

  const handleOnboardingClose = () => {
    localStorage.setItem("onboardingCompleted", "true");
    setIsOpenCommand(false);
  };


  return (
    <div className='h-full relative'>
      <div className='px-3 mt-2'>
        <UserNavbar />
      </div>
      <div className='px-3 mt-2'>
      
        {isOpenCommand && (
          <Command handleOnboardingClose={handleOnboardingClose} />
        )}
      </div>
      <div className='px-3'>
        <Link
          to='/mytasks'
          className='bg-white flex justify-between py-[6px] px-[16px] h-[64px] rounded-[16px]'
        >
          <div className='flex gap-[12px] items-center'>
            <SymbolFill />
            <p
              className='h-full flex items-center text-[17px] text-black font-medium'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {t('my_tasks')}
            </p>
          </div>
          <div className='flex items-center'>
            <div className='w-[32px]'>
              <div className='flex items-center justify-center text-[12px] w-[20px] h-[20px] border rounded-full bg-customPurpleLight text-customPurple p-0'>
                {myTasks}
              </div>
            </div>
            <ArrowRight />
          </div>
        </Link>
      </div>
      <BigProjects />
      <div className='py-3 px-4 w-full flex flex-col gap-3'>
        <EventsPromo />
        <AddTaskButtonHome />
      </div> 
    </div>
  );
};


export default Home;