import { Link } from "react-router-dom";
import EventPromo, { IEventGroup } from "./EventPromo";
import { fetchData } from "../common/fetchData";
import { useQuery } from "react-query";
import calendar from "../assets/images/calendar.svg";
import { t } from "i18next";

const getEventsNew = async () => {
  return await fetchData("user/events", {});
};

const EventsPromo = () => {
  const { data } = useQuery(["eventsNewData"], getEventsNew);

  return (
    <div className='flex flex-col gap-[10px]'>
      <div className='flex justify-between items-center h-[36px]'>
        <p
          className='text-[13px] font-normal text_gray uppercase font-sfpro'
        >
          {t("events")}
        </p>
        <Link
          to={"/event"}
          className='text-gradient-blue text-[15px] font-normal font-sfpro'
        >
          {t("view_all")}
        </Link>
      </div>
      <>
        {data && data.length > 0 ? (
          data.map((group: IEventGroup, index: number) => (
            <EventPromo key={index} group={group} />
          ))
        ) : (
          <div className='flex flex-col justify-center items-center'>
            <img src={calendar} alt='calendar' />
            <p className='text-gradient-blue text-[15px] font-normal h-full items-center flex font-sfpro'>
              {t("no_new_events")}
            </p>
          </div>
        )}
      </>
    </div>
  );
};

export default EventsPromo;
