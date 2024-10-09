import { AvatarUser } from "./mini/AvatarUser";
import { dateTimeConverter } from "../common/dateTimeConverter";
import useUserColor from "../common/useUserColor";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";

interface IComment {
  comment: ICommentIn;
}

export interface ICommentIn {
  id: number,
  user_id: number,
  comment: string,
  created_at: string,
  user: IUser,
  image: string
}

export interface IUser {
  telegram_id: number,
  name: string,
  image?: string | undefined;
  username?: string;
}

const Comment = ({ comment }: IComment) => {

  const { color, lightColor } = useUserColor(comment.user_id);
  console.log({comment});
  
  return (
    <div className='flex gap-5' key={comment.id}>
      <AvatarUser
        image={comment.user && comment.image}
        alt={comment.user ? comment.user.name : "No user"}
        id={comment.user.telegram_id}
      />
      <div className='bg-[#f2f2f7] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] p-3 w-full'>
        <div className='flex w-full justify-between mb-3'>
          <div
            className='text-[12px] px-2 rounded-md bg-blue-200 text-blue-500'
            style={{ color: color, background: lightColor }}
          >
            {comment.user ? comment.user.name : "No user"}
          </div>
          <div className=' text-[12px] text-gray-500'>
            {comment.created_at &&
              dateTimeConverter.convertTime(comment.created_at)}
          </div>
        </div>
        <div
          className='px-1 font-sans font-medium text-gray-700 text-sm'
          style={{ fontFamily: "SF Pro Display" }}
        >
          {capitalizeFirstLetter(comment.comment)}
        </div>
      </div>
    </div>
  );
};

export default Comment;
