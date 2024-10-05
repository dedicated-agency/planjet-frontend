// import { FaLink, FaRegComment } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { dateTimeConverter } from "../common/dateTimeConverter";
import { Avatar } from "./mini/Avatar";
import capitalizeFirstLetter from "../common/capitalizeFirstLetter";

const ProjectCaruselItem = (props: any) => {
  const { project } = props;




  console.log(project);

  return (
    <>
      <div className='w-full mt-2 relative'>
        <Link
          to={"/tasks/" + project.id}
          key={project.id}
          className='block bg-white rounded-[16px] p-[16px] w-full'
        >
          <div className='flex justify-between items-center mb-2 relative'>
            <p
              className='text[17px] text-customDark1 font-sans font-[500] single-line-ellipsis'
              style={{ fontFamily: "SF Pro Display" }}
            >
              {capitalizeFirstLetter(project.name)}
            </p>
          </div>
          <p
            className='text-sm text-customBlack font-sans font-normal duo-line-ellipsis'
            style={{ fontFamily: "SF Pro Display" }}
          >
            {project.description}
          </p>
          <div className='flex justify-between items-center mt-6'>
            <div className='flex gap-2 items-center'>
              <p className='font-sans text-sm font-bold text-gray-400'>
                {dateTimeConverter.convertTime(project.created_at)}
              </p>
              <div className='flex gap-[1px] items-end justify-center pb-1'>
                <span
                  className={` ${
                    project.priority === 1 && "bg-green-400 border-green-400"
                  } ${
                    project.priority === 2 && "bg-yellow-400 border-yellow-400"
                  } ${
                    project.priority === 3 && "bg-red-400 border-red-400"
                  } border rounded-sm w-[5px] h-2`}
                ></span>
                <span
                  className={` ${
                    project.priority === 1 && "bg-green-200 border-green-200"
                  } ${
                    project.priority === 2 && "bg-yellow-400 border-yellow-400"
                  } ${
                    project.priority === 3 && "bg-red-400 border-red-400"
                  } border rounded-sm w-[5px] h-3`}
                ></span>
                <span
                  className={` ${
                    project.priority === 1 && "bg-green-200 border-green-200"
                  } ${
                    project.priority === 2 && "bg-yellow-200 border-yellow-200"
                  } ${
                    project.priority === 3 && "bg-red-400 border-red-400"
                  } border rounded-sm w-[5px] h-4`}
                ></span>
              </div>
            </div>
            <div className='flex justify-between items-center gap-3 relative'>
              <p className="">{capitalizeFirstLetter(project?.project?.name)}</p>
              <div className='text-blue-500'>
                <Avatar
                  image={""}
                  alt={project?.project?.name}
                  width={28}
                  radius={6}
                  id={project?.project?.id}
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default ProjectCaruselItem;