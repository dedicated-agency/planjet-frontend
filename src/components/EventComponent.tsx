import { Link } from "react-router-dom";
// images
import ArrowRight from "../assets/icons/ArrowRight";
import { dateTimeConverter } from "../common/dateTimeConverter";
import { Avatar } from "./mini/Avatar";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import { t } from "i18next";

const EventComponent = (props: any) => {
  
  return (
    <Link to={"/tasks/" + props.group.change.task_id} className='bg-white shadow-custom py-3 px-4 rounded-[14px]'>
      <div className='flex items-center justify-between'>
        <p
          className='text-customBlack1E font-medium single-line-ellipsis w-[93%]'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {capitalizeFirstLetter(props.group.change.new_value)}
        </p>
        <div>
          <ArrowRight />
        </div>
      </div>
      <div className='flex items-center gap-[12px] mt-[16px]'>
        <Avatar
          image={""}
          alt={props.group.change.task.project.name}
          width={24}
          radius={6}
          id={props.group.change.task.project.id}
        />
        <p
          className='font-normal text-[13px] text-customBlack'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {dateTimeConverter.convertTime(props.group.change.created_at)}
        </p>
        <div className='w-[4px] h-[4px] bg-customBlack rounded-full' />
        <Link
          to={""}
          className='text-customBlue font-normal text-[13px]'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {props.group.change.type === "status" && t('status_changed')}
          {props.group.change.type === "priority" &&
            t('priority_changed')}
          {props.group.change.type === "created" && t('created')}
          {props.group.change.type === "comment" && t('comment')}
          {props.group.change.type === "participant" &&
            t('performers_assigned')}
        </Link>
      </div>
    </Link>
  );
};

export default EventComponent;
