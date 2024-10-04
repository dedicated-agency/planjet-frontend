import { useContext, useEffect } from "react";
import { StateContext } from "../context/StateContext";
import languages from "../local/languages.json";
import { fetchData } from "../common/fetchData";
import { useQuery } from "react-query";
import WebApp from "@twa-dev/sdk";
import EventPromo from "../components/EventPromo";

const getEvents = async () => {
  return await fetchData("user/events?is_viewed=1", {});
};

const Events = () => {
  const BackButton = WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(() => window.history.back());
  const { data } = useQuery(["eventsViewData"], () => getEvents());
  console.log(data);

  const { lang } = useContext(StateContext);
  const locales: any = languages;

  useEffect(() => {
    WebApp.setHeaderColor("#F2F2F7");
  }, []);

  return (
    <div className='px-3'>
      <div className='h-[56px]' />
      <div className='fixed top-0 left-0 right-0 flex justify-between h-[56px] items-center p-3 bg-[#f2f2f7]'>
        <div className='text-gray-500 h-full w-[60px] flex items-center'></div>
        <p
          className='font-medium text-[17px] text-customDark capitalize'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {locales[lang].events}
        </p>
        <div className='w-[60px] h-full flex justify-end items-center'></div>
      </div>
      <div className='flex flex-col gap-[7px]'>
        {data?.length !== 0 ? (
          <p
            className='capitalize font-medium text-[15px] text-customBlack'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {locales[lang].today}
          </p>
        ) : (
          ""
        )}
        <>
          {data?.length !== 0 ? (
            data?.map((group: any, index: number) => (
              <EventPromo key={index} group={group} />
            ))
          ) : (
            <div className='w-full flex justify-center mt-10'>
              <p
                className='capitalize font-medium text-[15px] text-customBlack'
                style={{ fontFamily: "SF Pro Display" }}
              >
                {locales[lang].no_events}
              </p>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Events;
