// import { Link } from "react-router-dom";
// images
// import { Avatar } from "./mini/Avatar";
import { useContext } from "react";
import { dateTimeConverter } from "../common/dateTimeConverter";
import { StateContext } from "../context/StateContext";
import languages from "../local/languages.json";
import ArrowRight from "../assets/icons/ArrowRight";
import { AvatarUser } from "./mini/AvatarUser";
// import ArrowLeft from "../assets/icons/ArrowLeft";
import ArrowLongRight from "../assets/icons/ArrowLongRight";
import { useState } from "react";

const EventPromo = (props: any) => {
  const { capitalizeFirstLetter, lang } = useContext(StateContext);
  const locales: any = languages;
  console.log(props.group);

  const [isOpenDescription, setisOpenDescription] = useState<boolean>(false);

  return (
    <div className='h-auto bg-white rounded-2xl p-3'>
      <p
        className='text-customIndigo100 text-xs font-medium'
        style={{ fontFamily: "SF Pro Display" }}
      >
        {props.group.group} | {props.group.project}
      </p>
      <p
        className='font-medium text-base leading-5 mt-1 duo-line-ellipsis'
        style={{ fontFamily: "SF Pro Display" }}
      >
        {capitalizeFirstLetter(props.group.task_name)}
      </p>
      <div className='bg-customIndigo120 h-auto rounded-xl border-l-[3px] border-customIndigo100 p-3 mt-1'>
        <div
          className='h-5 flex justify-between items-center cursor-pointer'
          onClick={() => setisOpenDescription(!isOpenDescription)}
        >
          <p
            className='font-medium text-[13px] text-customIndigo100'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {locales[lang].recent_events}
          </p>

          <div
            className={`${
              !isOpenDescription ? "rotate-90" : "rotate-[-90deg]"
            } duration-300 transition-all`}
          >
            <ArrowRight stroke='#6463B0' opacity={1} />
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out scrollbar-hidden ${
            isOpenDescription ? "max-h-[350px] overflow-y-auto" : "max-h-0"
          }`}
        >
          <div className='mt-3'>
            {props.group.events.map((event: any, index: number) => (
              <>
                {event.changes.length === 1 ? (
                  <div className='mt-3'>
                    <div className='flex gap-3 items-center'>
                      <div className='mr-2'>
                        <AvatarUser
                          image={""}
                          alt='User'
                          width={20}
                          height={20}
                          size={14}
                        />
                      </div>
                      <p
                        // Color need change
                        className='text-red-500 font-normal text-[15px]'
                        style={{ fontFamily: "SF Pro Display" }}
                      >
                        {event.user_name}
                      </p>
                      {event.changes.map((change: any, index: number) => (
                        <>
                          <p
                            key={index}
                            className='font-normal text-black text-xs'
                            style={{ fontFamily: "SF Pro Display" }}
                          >
                            {change.type === "status"
                              ? locales[lang].status_changed
                              : change.type === "priority"
                              ? locales[lang].priority_changed
                              : change.type === "created"
                              ? locales[lang].created
                              : change.type === "comment"
                              ? locales[lang].comment
                              : change.type === "participant"
                              ? locales[lang].participants_changed
                              : change.type === "archive"
                              ? locales[lang].added_to_archive
                              : locales[lang].performers_assigned}
                          </p>
                          <p
                            className='font-normal text-[10px] text-customGray'
                            style={{ fontFamily: "SF Pro Display" }}
                          >
                            {dateTimeConverter.convertTime(change.created_at)}
                          </p>
                        </>
                      ))}
                      {/* Time */}
                    </div>
                    <div className='flex items-center gap-1 mt-2'>
                      {event.changes.map((change: any, index: number) => (
                        <>
                          <div className='w-max h-4 bg-customIndigo150 flex justify-center items-center py-1 px-[6px] rounded-2xl'>
                            <p className='text-xs line-through text-customIndigo'>
                              {change.old_value == 1
                                ? locales[lang].priority_data[change.old_value]
                                : change.old_value == 2
                                ? locales[lang].priority_data[change.old_value]
                                : change.old_value == 3
                                ? locales[lang].priority_data[change.old_value]
                                : capitalizeFirstLetter(change.old_value)}
                            </p>
                          </div>
                          <ArrowLongRight />
                          <div className='w-max h-4 bg-customIndigo150 flex justify-center items-center py-1 px-[6px] rounded-2xl'>
                            <p className='text-xs line-through text-customIndigo'>
                              В процессе
                            </p>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='mt-3'>
                    <div className='flex gap-3 items-center'>
                      <div className='mr-2'>
                        <AvatarUser
                          image={""}
                          alt='User'
                          width={20}
                          height={20}
                          size={14}
                        />
                      </div>
                      <p
                        // Color need change
                        className='text-red-500 font-normal text-[15px]'
                        style={{ fontFamily: "SF Pro Display" }}
                      >
                        {event.user_name}
                      </p>
                    </div>
                    <div className='flex gap-2 mt-1'>
                      <div className='w-[3px] h-auto bg-customIndigo500 rounded-full ml-2' />
                      <div className='p-2 flex flex-col gap-3'>
                        {event.changes.map((change: any, index: number) => (
                          <div className='flex flex-col gap-2'>
                            <div className='flex gap-3 items-center'>
                              <p
                                className='font-normal text-black text-xs'
                                style={{ fontFamily: "SF Pro Display" }}
                              >
                                {change.type === "status"
                                  ? locales[lang].status_changed
                                  : change.type === "priority"
                                  ? locales[lang].priority_changed
                                  : change.type === "created"
                                  ? locales[lang].created
                                  : change.type === "comment"
                                  ? locales[lang].comment
                                  : change.type === "participant"
                                  ? locales[lang].participants_changed
                                  : change.type === "archive"
                                  ? locales[lang].added_to_archive
                                  : locales[lang].performers_assigned}
                              </p>
                              {/* Time */}
                              <p
                                className='font-normal text-[10px] text-customGray'
                                style={{ fontFamily: "SF Pro Display" }}
                              >
                                {dateTimeConverter.convertTime(
                                  change.created_at,
                                )}
                              </p>
                            </div>
                            <div className='flex items-center gap-1'>
                              <div className='w-max h-4 bg-customIndigo150 flex justify-center items-center py-1 px-[6px] rounded-2xl'>
                                <p className='text-xs line-through text-customIndigo'>
                                  {change.old_value == 1
                                    ? locales[lang].priority_data[
                                        change.old_value
                                      ]
                                    : change.old_value == 2
                                    ? locales[lang].priority_data[
                                        change.old_value
                                      ]
                                    : change.old_value == 3
                                    ? locales[lang].priority_data[
                                        change.old_value
                                      ]
                                    : capitalizeFirstLetter(change.old_value)}
                                </p>
                              </div>
                              <ArrowLongRight />
                              <div className='w-max h-4 bg-customIndigo150 flex justify-center items-center py-1 px-[6px] rounded-2xl'>
                                <p className='text-xs line-through text-customIndigo'>
                                  {change.new_value == 1
                                    ? locales[lang].priority_data[
                                        change.new_value
                                      ]
                                    : change.new_value == 2
                                    ? locales[lang].priority_data[
                                        change.new_value
                                      ]
                                    : change.new_value == 3
                                    ? locales[lang].priority_data[
                                        change.new_value
                                      ]
                                    : capitalizeFirstLetter(change.new_value)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
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
