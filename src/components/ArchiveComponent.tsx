import { LuArrowUpFromLine } from "react-icons/lu";
import { dateTimeConverter } from "../common/dateTimeConverter";
import { Link } from "react-router-dom";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";

interface IArchive {
  archive: IArchiveIn
}

export interface IArchiveIn {
  id: number,
  name: string,
  description: string,
  created_at: string,
  updated_at: string,
  task_count: number,
}


const ArchiveComponent = (props: IArchive) => {
  
  return (
    <Link to={`tasks/${props.archive.id}`} className='bg-white p-[16px] rounded-[16px]'>
      <p
        className='font-medium text-[17px] text-customBlack1E single-line-ellipsis font-sfpro'
      >
        {capitalizeFirstLetter(props.archive.name)}
      </p>
      <p
        className='font-light text-[14px] text-customBlack mt-1 mb-1 duo-line-ellipsis font-sfpro'
      >
        {capitalizeFirstLetter(props.archive.description)}
      </p>
      <div className='flex items-center justify-between mt-3'>
        <p
          className='font-medium text-[13px] text-customBlack font-sfpro'
        >
          {dateTimeConverter.convertTime(props.archive.created_at)}
        </p>
        <div className='w-[18px] h-[18px] bg-customBlackLight rounded flex items-center justify-center text-white'>
          <LuArrowUpFromLine />
        </div>
      </div>
    </Link>
  );
};

export default ArchiveComponent;
