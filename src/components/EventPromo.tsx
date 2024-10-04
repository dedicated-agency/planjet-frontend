import { Link } from "react-router-dom";
// images
import { Avatar } from "./mini/Avatar";
import { useContext } from "react";
import { dateTimeConverter } from "../common/dateTimeConverter";
import { StateContext } from "../context/StateContext";
import languages from "../local/languages.json";

const EventPromo = (props: any) => {
  const { capitalizeFirstLetter, lang } = useContext(StateContext);
  const locales: any = languages;

  console.log(props.group);

  return (
    <Link
      to={"/tasks/" + props.group.change.task_id}
      className='py-3 px-4 shadow-custom bg-white rounded-[14px]'
    >
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-[6px]'>
          <p
            className='font-normal text-[12px] text-customBlack'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {dateTimeConverter.convertTime(props.group.change.created_at)}
          </p>
          <div className='w-[4px] h-[4px] bg-customBlack rounded-full' />
          <p
            className='text-customBlue font-normal text-[12px]'
            style={{
              fontFamily: "SF Pro Display",
              // width: "100px",
            }}
          >
            {props.group.change.type === "status"
              ? locales[lang].status_changed
              : props.group.change.type === "priority"
              ? locales[lang].priority_changed
              : props.group.change.type === "created"
              ? locales[lang].created
              : props.group.change.type === "comment"
              ? locales[lang].comment
              : props.group.change.type === "participant"
              ? locales[lang].participants_changed
              : props.group.change.type === "archive"
              ? locales[lang].added_to_archive
              : locales[lang].performers_assigned}
          </p>
        </div>
        <div className='flex gap-[6px]'>
          <Avatar
            image={""}
            alt={props.group.change.task.project.name}
            width={18}
            radius={4}
            id={props.group.change.task.project.id}
          />
          <p
            className='font-normal text-[12px] text-customBlack'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {capitalizeFirstLetter(props.group.change.task.project.name)}
          </p>
        </div>
      </div>
      <p
        className='mt-[7px] text-customBlack1E font-medium duo-line-ellipsis'
        style={{ fontFamily: "SF Pro Display" }}
      >
        {capitalizeFirstLetter(props.group.change.task.name)}
        
        {/* {capitalizeFirstLetter(props.group.change.new_value) == 1
          ? locales[lang].priority_data[props.group.change.new_value]
          : capitalizeFirstLetter(props.group.change.new_value) == 2
          ? locales[lang].priority_data[props.group.change.new_value]
          : capitalizeFirstLetter(props.group.change.new_value) == 3
          ? locales[lang].priority_data[props.group.change.new_value]
          : capitalizeFirstLetter(props.group.change.new_value)} */}
      </p>
    </Link>
  );
};

export default EventPromo;
