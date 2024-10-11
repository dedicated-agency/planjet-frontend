import { Fragment } from "react";
import { dateTimeConverter } from "../common/dateTimeConverter";
import ArrowRight from "../assets/icons/ArrowRight";
import { AvatarUser } from "./mini/AvatarUser";
import ArrowLongRight from "../assets/icons/ArrowLongRight";
import { useState } from "react";
import useUserColor from "../common/useUserColor";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";
import { Link } from "react-router-dom";
import { t } from "i18next";

interface IEventProps {
  group: IEventGroup;
}

export interface IEventGroup {
  events: IEvent[];
  task_id: number;
  project: string;
  task_name: string;
  group: string;
}

interface IEvent {
  changes: IEventChange[];
  user_name: string;
  user_id: number;
}

interface IEventChange {
  type: string;
  created_at: string;
  old_value: string;
  new_value: string;
}

const EventPromo = (props: IEventProps) => {
  const [isOpenDescription, setisOpenDescription] = useState<boolean>(false);

  const changes = props.group.events.flatMap((el: IEvent) => el.changes);

  return (
    <div className='h-auto bg-white rounded-2xl p-3'>
      <Link to={"tasks/" + props.group.task_id}>
        <p
          className=' text-xs font-medium font-sfpro'
          style={{
            color: useUserColor(props.group.task_id).lightColor.id === 1
                  ? "rgba(86, 148, 214, .5)"
                  : useUserColor(props.group.task_id).lightColor.id === 2
                  ? "rgba(68, 169, 171, .5)"
                  : useUserColor(props.group.task_id).lightColor.id === 3
                  ? "rgba(214, 86, 148, .5)"
                  : useUserColor(props.group.task_id).lightColor.id === 4
                  ? "rgba(222, 121, 119, 0.5)"
                  : useUserColor(props.group.task_id).lightColor.id === 5
                  ? "rgba(100, 99, 176, .5)"
                  : "",
          }}
        >
          {props.group.group} | {props.group.project}
        </p>
        <p
          className='font-medium text-base leading-5 mt-1 duo-line-ellipsis font-sfpro'
        >
          {capitalizeFirstLetter(props.group.task_name)}
        </p>
      </Link>
      <div className='bg-customIndigo120 h-auto rounded-xl border-l-[3px] border-customIndigo100 p-3 mt-1'>
        {props.group.events.map((event: IEvent, index: number) => {
          if (props.group.events.length === 1 && event.changes.length === 1) {
            return (
              <div key={index}>
                <div className='flex gap-3 items-center'>
                  <div className='mr-2'>
                    <AvatarUser
                      image={""}
                      alt={event.user_name}
                      width={20}
                      height={20}
                      size={14}
                    />
                  </div>
                  <p
                    className='font-normal text-[15px] font-sfpro'
                    style={{
                      color:
                        useUserColor(event.user_id).lightColor.id === 1
                          ? "rgba(86, 148, 214, .5)"
                          : useUserColor(event.user_id).lightColor.id === 2
                          ? "rgba(68, 169, 171, .5)"
                          : useUserColor(event.user_id).lightColor.id === 3
                          ? "rgba(214, 86, 148, .5)"
                          : useUserColor(event.user_id).lightColor.id === 4
                          ? "rgba(222, 121, 119, 0.5)"
                          : useUserColor(event.user_id).lightColor.id === 5
                          ? "rgba(100, 99, 176, .5)"
                          : "",
                    }}
                  >
                    {event.user_name}
                  </p>
                  {event.changes.map((change: IEventChange, index: number) => (
                    <Fragment key={index}>
                      <p
                        className='font-normal text-black text-xs font-sfpro'
                      >
                        {change.type === "status"
                          ? t("status_changed")
                          : change.type === "priority"
                          ? t("priority_changed")
                          : change.type === "created"
                          ? t("created")
                          : change.type === "comment"
                          ? t("comment")
                          : change.type === "participant"
                          ? t("participants_changed")
                          : change.type === "archive"
                          ? t("added_to_archive")
                          : t("performers_assigned")}
                      </p>
                      <p
                        className='font-normal text-[10px] text-customGray font-sfpro'
                      >
                        {dateTimeConverter.convertTime(change.created_at)}
                      </p>
                    </Fragment>
                  ))}
                  {/* Time */}
                </div>
                <div className='flex items-center gap-1 mt-2'>
                  {event.changes.map((change: IEventChange, index: number) => (
                    <Fragment key={index}>
                      <div className='w-max h-4 bg-customIndigo150 flex justify-center items-center py-1 px-[6px] rounded-2xl'>
                        <p className='text-xs line-through text-customIndigo'>
                          {Number(change.old_value) == 1
                            ? t(`priority_data[${change.old_value}]`)
                            : Number(change.old_value) == 2
                            ? t(`priority_data[${change.old_value}]`)
                            : Number(change.old_value) == 3
                            ? t(`priority_data[${change.old_value}]`)
                            : capitalizeFirstLetter(change.old_value)}
                        </p>
                      </div>
                      <ArrowLongRight />
                      <div className='w-max h-4 bg-customIndigo150 flex justify-center items-center py-1 px-[6px] rounded-2xl'>
                        <p className='text-xs line-through text-customIndigo'>
                          В процессе
                        </p>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            );
          }
        })}
        {changes.length > 1 && (
          <div
            className='h-5 flex justify-between items-center cursor-pointer'
            onClick={() => setisOpenDescription(!isOpenDescription)}
          >
            <p
              className='font-medium text-[13px] text-customIndigo100 font-sfpro'
            >
              {t("recent_events")}
            </p>

            <div
              className={`${
                !isOpenDescription ? "rotate-90" : "rotate-[-90deg]"
              } duration-300 transition-all`}
            >
              <ArrowRight stroke='#6463B0' opacity={1} />
            </div>
          </div>
        )}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out scrollbar-hidden ${
            isOpenDescription ? "max-h-[350px] overflow-y-auto" : "max-h-0"
          }`}
        >
          <div className='mt-3'>
            {props.group.events.map((event: IEvent, index: number) => (
              <div key={index}>
                {event.changes.length === 1 ? (
                  <div className='mt-3'>
                    <div className='flex gap-3 items-center'>
                      <div className='mr-2'>
                        <AvatarUser
                          image={""}
                          alt={event.user_name}
                          width={20}
                          height={20}
                          size={14}
                        />
                      </div>
                      <p
                        className='font-normal text-[15px] font-sfpro'
                        style={{
                          color:
                            useUserColor(event.user_id).lightColor.id === 1
                              ? "rgba(86, 148, 214, .5)"
                              : useUserColor(event.user_id).lightColor.id === 2
                              ? "rgba(68, 169, 171, .5)"
                              : useUserColor(event.user_id).lightColor.id === 3
                              ? "rgba(214, 86, 148, .5)"
                              : useUserColor(event.user_id).lightColor.id === 4
                              ? "rgba(222, 121, 119, 0.5)"
                              : useUserColor(event.user_id).lightColor.id === 5
                              ? "rgba(100, 99, 176, .5)"
                              : "",
                        }}
                      >
                        {event.user_name}
                      </p>
                      {event.changes.map(
                        (change: IEventChange, index: number) => (
                          <Fragment key={index}>
                            <p
                              className='font-normal text-black text-xs font-sfpro'
                            >
                              {change.type === "status"
                                ? t("status_changed")
                                : change.type === "priority"
                                ? t("priority_changed")
                                : change.type === "created"
                                ? "created"
                                : change.type === "comment"
                                ? t("comment")
                                : change.type === "participant"
                                ? t("participants_changed")
                                : change.type === "archive"
                                ? t("added_to_archive")
                                : t("performers_assigned")}
                            </p>
                            <p
                              className='font-normal text-[10px] text-customGray font-sfpro'
                            >
                              {dateTimeConverter.convertTime(change.created_at)}
                            </p>
                          </Fragment>
                        ),
                      )}
                      {/* Time */}
                    </div>
                    <div className='flex items-center gap-1 mt-2'>
                      {event.changes.map(
                        (change: IEventChange, index: number) => (
                          <Fragment key={index}>
                            <div className='w-max h-4 bg-customIndigo150 flex justify-center items-center py-1 px-[6px] rounded-2xl'>
                              <p className='text-xs line-through text-customIndigo'>
                                {Number(change.old_value) == 1
                                  ? t(`priority_data[${change.old_value}]`)
                                  : Number(change.old_value) == 2
                                  ? t(`priority_data[${change.old_value}]`)
                                  : Number(change.old_value) == 3
                                  ? t(`priority_data[${change.old_value}]`)
                                  : capitalizeFirstLetter(change.old_value)}
                              </p>
                            </div>
                            <ArrowLongRight />
                            <div className='w-max h-4 bg-customIndigo150 flex justify-center items-center py-1 px-[6px] rounded-2xl'>
                              <p className='text-xs line-through text-customIndigo'>
                                В процессе
                              </p>
                            </div>
                          </Fragment>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='mt-3'>
                    <div className='flex gap-3 items-center'>
                      <div className='mr-2'>
                        <AvatarUser
                          image={""}
                          alt={event.user_name}
                          width={20}
                          height={20}
                          size={14}
                          id={event.user_id}
                        />
                      </div>
                      <p
                        // Color need change
                        className='font-normal text-[15px] font-sfpro'
                        style={{
                          color:
                            useUserColor(event.user_id).lightColor.id === 1
                              ? "rgba(86, 148, 214, .5)"
                              : useUserColor(event.user_id).lightColor.id === 2
                              ? "rgba(68, 169, 171, .5)"
                              : useUserColor(event.user_id).lightColor.id === 3
                              ? "rgba(214, 86, 148, .5)"
                              : useUserColor(event.user_id).lightColor.id === 4
                              ? "rgba(222, 121, 119, 0.5)"
                              : useUserColor(event.user_id).lightColor.id === 5
                              ? "rgba(100, 99, 176, .5)"
                              : "",
                        }}
                      >
                        {event.user_name}
                      </p>
                    </div>
                    <div className='flex gap-2 mt-1'>
                      <div className='w-[3px] h-auto bg-customIndigo500 rounded-full ml-2' />
                      <div className='p-2 flex flex-col gap-3'>
                        {event.changes.map(
                          (change: IEventChange, index: number) => (
                            <div key={index} className='flex flex-col gap-2'>
                              <div className='flex gap-3 items-center'>
                                <p
                                  className='font-normal text-black text-xs font-sfpro'
                                >
                                  {change.type === "status"
                                    ? t("status_changed")
                                    : change.type === "priority"
                                    ? "priority_changed"
                                    : change.type === "created"
                                    ? t("created")
                                    : change.type === "comment"
                                    ? t("comment")
                                    : change.type === "participant"
                                    ? t("participants_changed")
                                    : change.type === "archive"
                                    ? t("added_to_archive")
                                    : t("performers_assigned")}
                                </p>
                                {/* Time */}
                                <p
                                  className='font-normal text-[10px] text-customGray font-sfpro'
                                >
                                  {dateTimeConverter.convertTime(
                                    change.created_at,
                                  )}
                                </p>
                              </div>
                              <div className='flex items-center gap-1'>
                                <div className='w-max h-4 bg-customIndigo150 flex justify-center items-center py-1 px-[6px] rounded-2xl'>
                                  <p className='text-xs line-through text-customIndigo'>
                                    {Number(change.old_value) == 1
                                      ? t("priority_data")[
                                          Number(change.old_value)
                                        ]
                                      : Number(change.old_value) == 2
                                      ? t("priority_data")[
                                          Number(change.old_value)
                                        ]
                                      : Number(change.old_value) == 3
                                      ? t("priority_data")[
                                          Number(change.old_value)
                                        ]
                                      : capitalizeFirstLetter(change.old_value)}
                                  </p>
                                </div>
                                <ArrowLongRight />
                                <div className='w-max h-4 bg-customIndigo150 flex justify-center items-center py-1 px-[6px] rounded-2xl'>
                                  <p className='text-xs line-through text-customIndigo'>
                                    {Number(change.new_value) == 1
                                      ? t("priority_data")[
                                          Number(change.new_value)
                                        ]
                                      : Number(change.new_value) == 2
                                      ? t("priority_data")[
                                          Number(change.new_value)
                                        ]
                                      : Number(change.new_value) == 3
                                      ? t("priority_data")[
                                          Number(change.new_value)
                                        ]
                                      : capitalizeFirstLetter(change.new_value)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    // <Link
    //   to={"/tasks/" + props.group.change.task_id}
    //   className='py-3 px-4 shadow-custom bg-white rounded-[14px]'
    // >
    //   <div className='flex justify-between items-center'>
    //     <div className='flex items-center gap-[6px]'>
    //       <p
    //         className='font-normal text-[12px] text-customBlack'
    //         style={{ fontFamily: "SF Pro Display" }}
    //       >
    //         {dateTimeConverter.convertTime(props.group.change.created_at)}
    //       </p>
    //       <div className='w-[4px] h-[4px] bg-customBlack rounded-full' />
    //       <p
    //         className='text-customBlue font-normal text-[12px]'
    //         style={{
    //           fontFamily: "SF Pro Display",
    //           // width: "100px",
    //         }}
    //       >
    //         {props.group.change.type === "status"
    //           ? locales[lang].status_changed
    //           : props.group.change.type === "priority"
    //           ? locales[lang].priority_changed
    //           : props.group.change.type === "created"
    //           ? locales[lang].created
    //           : props.group.change.type === "comment"
    //           ? locales[lang].comment
    //           : props.group.change.type === "participant"
    //           ? locales[lang].participants_changed
    //           : props.group.change.type === "archive"
    //           ? locales[lang].added_to_archive
    //           : locales[lang].performers_assigned}
    //       </p>
    //     </div>
    //     <div className='flex gap-[6px]'>
    //       <Avatar
    //         image={""}
    //         alt={props.group.change.task.project.name}
    //         width={18}
    //         radius={4}
    //         id={props.group.change.task.project.id}
    //       />
    //       <p
    //         className='font-normal text-[12px] text-customBlack'
    //         style={{ fontFamily: "SF Pro Display" }}
    //       >
    //         {capitalizeFirstLetter(props.group.change.task.project.name)}
    //       </p>
    //     </div>
    //   </div>
    //   <p
    //     className='mt-[7px] text-customBlack1E font-medium duo-line-ellipsis'
    //     style={{ fontFamily: "SF Pro Display" }}
    //   >
    //     {capitalizeFirstLetter(props.group.change.task.name)}

    //     {/* {capitalizeFirstLetter(props.group.change.new_value) == 1
    //       ? locales[lang].priority_data[props.group.change.new_value]
    //       : capitalizeFirstLetter(props.group.change.new_value) == 2
    //       ? locales[lang].priority_data[props.group.change.new_value]
    //       : capitalizeFirstLetter(props.group.change.new_value) == 3
    //       ? locales[lang].priority_data[props.group.change.new_value]
    //       : capitalizeFirstLetter(props.group.change.new_value)} */}
    //   </p>
    // </Link>
  );
};

export default EventPromo;
