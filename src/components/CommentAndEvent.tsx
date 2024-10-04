import {
  FaArrowRight,
  FaPlus,
  FaRegCommentDots,
  FaUsers,
} from "react-icons/fa6";
import { dateTimeConverter } from "../common/dateTimeConverter";
import { AvatarUser } from "./mini/AvatarUser";
import { BsBarChartFill } from "react-icons/bs";
import { IoSyncOutline } from "react-icons/io5";
import { useContext, useRef } from "react";
import { StateContext } from "../context/StateContext";
import { useParams } from "react-router-dom";
import languages from "../local/languages.json";
import axiosClient from "../common/axiosClient";
import Archive from "../assets/icons/Archive";
import Comment from "./Comment";

const CommentAndEvent = (props: {
  state: any;
  setState: any;
  queryClient: any;
}) => {
  const { state, setState, queryClient } = props;
  const locales: any = languages;
  const { id } = useParams();
  const { lang, capitalizeFirstLetter } = useContext(StateContext);
  const textareaRef = useRef(null);
  const handleChange = (event: any) => {
    setState({ commentText: event.target.value });
    adjustTextareaHeight();
  };
  const adjustTextareaHeight = () => {
    const textarea: any = textareaRef.current;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
  };

  const createComment = async () => {
    try {
      const response = await axiosClient.put(`/task/${id}/comment`, {
        text: state.commentText,
      });
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ["taskData"],
        });
        setState({ commentText: "" });
      }
    } catch (error) {
      console.log("create comment: " + error);
    }
  };

  const trimmedString = (text: string) => {
    return text.replace(/,\s*$/, "");
  };

  console.log(state);

  return (
    <>
      {state.selector === "comment" && (
        <>
          <div className='transition-all flex mt-5 items-center gap-2'>
            <textarea
              ref={textareaRef}
              onChange={handleChange}
              value={state.commentText}
              name=''
              id=''
              placeholder={locales[lang].enter_comment}
              rows={1}
              style={{
                overflow: "hidden",
                resize: "none",
                width: "calc(100% - 30px)",
              }}
              onFocus={() => setState({ commentInput: true })}
              onMouseLeave={() => setState({ commentInput: false })}
              className='outline-none bg-gray-100 px-3 py-2 text-sm rounded-lg'
            />
            {state.commentText === "" ? (
              <div className='h-[30px] w-[30px] bg-gray-100 text-gray-500 flex justify-center items-center rounded-full'>
                <FaArrowRight />
              </div>
            ) : (
              <div
                onClick={createComment}
                className='h-[30px] w-[30px] bg-blue-500 text-white flex justify-center items-center rounded-full'
              >
                <FaArrowRight />
              </div>
            )}
          </div>
          <div className='transition-all flex flex-col gap-2 mt-5'>
            {state.comments.length > 0 &&
              state.comments.map((comment: any, index: number) => {
                return (
                  <Comment comment={comment} key={index} />
                );
              })}
          </div>
        </>
      )}

      {state.selector === "event" && (
        <div className='transition-all flex flex-col gap-2 mt-5'>
          {state.events.length > 0 &&
            state.events.map((eventElement: any, index: number) => (
              <div key={index} className='flex gap-2 '>
                <div className='flex flex-col justify-center items-center gap-2'>
                  <div className='min-w-[24px] w-[24px] min-h-[24px] h-[24px] flex justify-center items-center rounded-full bg-gray-200 text-gray-600'>
                    {eventElement.type === "status" && <IoSyncOutline />}
                    {eventElement.type === "priority" && <BsBarChartFill />}
                    {eventElement.type === "created" && <FaPlus />}
                    {eventElement.type === "comment" && <FaRegCommentDots />}
                    {eventElement.type === "participant" && <FaUsers />}
                    {eventElement.type === "archive" && (
                      <Archive width={16} height={16} />
                    )}
                  </div>
                  <div className='w-[3px] rounded-full h-[100%] bg-gray-200'></div>
                </div>
                <div className='pb-[15px]'>
                  <div className='flex gap-2 items-center'>
                    <AvatarUser
                      image={eventElement.image}
                      alt={eventElement.user?.name}
                      width={20}
                      height={20}
                      id={eventElement.user.telegram_id}
                      size={13}
                    />
                    <span
                      className='ml-2 font-sans text-[15px] text-blue-500 font-[400]'
                      style={{ fontFamily: "SF Pro Display" }}
                    >
                      {eventElement.user.name}
                    </span>
                    <span className='font-sans text-[13px] text-customBlack font-[500]'>
                      {dateTimeConverter.convertTime(eventElement.created_at)}
                    </span>
                  </div>
                  <div className='mt-3  font-sans text-sm  font-[500]'>
                    {eventElement.type === "created" && (
                      <p
                        className='text-[13px] font-medium text-customBlackLight'
                        style={{ fontFamily: "SF Pro Display" }}
                      >
                        {locales[lang].created_task}
                      </p>
                    )}
                    {eventElement.type === "archive" && (
                      <p
                        className='text-[13px] font-medium text-customBlackLight'
                        style={{ fontFamily: "SF Pro Display" }}
                      >
                        {eventElement.new_value}
                      </p>
                    )}
                    {eventElement.type === "status" && (
                      <>
                        <p
                          className='text-[13px] font-medium text-customBlackLight pb-[10px]'
                          style={{ fontFamily: "SF Pro Display" }}
                        >
                          {locales[lang].change_status}
                        </p>
                        <div className='flex mt-2 items-center gap-2'>
                          <div
                            className={`rounded-full text-[12px] py-[4px] px-[6px] bg-customBlueLight text-customBlue line-through`}
                          >
                            {eventElement.old_value}
                          </div>
                          <div className='h-[20px] w-[20px] rounded-full flex justify-center items-center bg-gray-200 text-gray-500'>
                            {" "}
                            <FaArrowRight />
                          </div>
                          <div className='rounded-full text-[12px] py-[4px] px-[6px] bg-customIndigoLight text-customIndigo'>
                            {eventElement.new_value}
                          </div>
                        </div>
                      </>
                    )}
                    {eventElement.type === "priority" && (
                      <>
                        <p
                          className='text-[13px] font-medium text-customBlackLight pb-[10px]'
                          style={{ fontFamily: "SF Pro Display" }}
                        >
                          {locales[lang].priority_change}
                        </p>
                        <div className='flex mt-2 items-center gap-2'>
                          <div
                            className={`rounded-full text-[12px] py-[4px] px-[6px] bg-customYellowLight text-customYellow line-through`}
                          >
                            {
                              locales[lang].priority_data[
                                eventElement.old_value
                              ]
                            }
                          </div>
                          <div className='h-[20px] w-[20px] rounded-full flex justify-center items-center bg-gray-200 text-gray-500'>
                            {" "}
                            <FaArrowRight />
                          </div>
                          <div
                            className={`rounded-full text-[12px] py-[4px] px-[6px] bg-customRedLight text-customRed`}
                          >
                            {
                              locales[lang].priority_data[
                                eventElement.new_value
                              ]
                            }
                          </div>
                        </div>
                      </>
                    )}
                    {eventElement.type === "comment" && (
                      <>
                        <p
                          className='text-[13px] font-medium text-customBlackLight pb-[5px]'
                          style={{ fontFamily: "SF Pro Display" }}
                        >
                          {locales[lang].comment}
                        </p>
                        <div className='flex mt-2 items-center gap-2'>
                          <div className='rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] bg-[#F2F2F7] text-[12px] px-3 text-customBlackLight py-1'>
                            {capitalizeFirstLetter(eventElement.new_value)}
                          </div>
                        </div>
                      </>
                    )}
                    {eventElement.type === "participant" && (
                      <>
                        <p
                          className='text-[13px] font-medium text-customBlackLight pb-[5px]'
                          style={{ fontFamily: "SF Pro Display" }}
                        >
                          {locales[lang].participants_changed}
                        </p>
                        <div className='flex mt-2 items-center gap-2'>
                          <div
                            className={`rounded-full text-[12px] py-[4px] px-[6px] bg-gray-200 text-gray-500`}
                          >
                            {trimmedString(eventElement.old_value)}
                          </div>
                          <div className='h-[20px] w-[20px] rounded-full flex justify-center items-center bg-gray-200 text-gray-500'>
                            {" "}
                            <FaArrowRight />
                          </div>
                          <div
                            className={`rounded-full text-[12px] py-[4px] px-[6px] bg-gray-200 text-gray-500`}
                          >
                            {trimmedString(eventElement.new_value)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default CommentAndEvent;