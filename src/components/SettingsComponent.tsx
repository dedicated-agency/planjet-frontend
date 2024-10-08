import { useEffect, useState } from "react";
import { Avatar } from "./mini/Avatar";

interface IProps {
  group: IPropsGroup;
  handleUpdateGroup: (groupId: number, isSelected: boolean) => void;
  isSelected: boolean;
}

export interface IPropsGroup {
  id: number;
  name: string;
  is_selected: boolean;
}

const SettingsComponent = (props: IProps) => {
  const [isSelected, setIsSelected] = useState(props.isSelected);

  console.log(props);
  

  useEffect(() => {
    setIsSelected(props.isSelected);
  }, [props.isSelected]);

  const handleToggle = () => {
    const newSelectedState = !isSelected;
    setIsSelected(newSelectedState);
    props.handleUpdateGroup(props.group.id, newSelectedState);
  };

  return (
    <label className='flex justify-between items-center py-[12px] px-[16px] bg-white'>
      <div className='flex items-center gap-[12px]'>
        <Avatar
          width={28}
          image={""}
          alt={props.group.name}
          radius={6}
          id={props.group.id}
        />
        <p className='font-medium text-[16px]'>{props.group.name}</p>
      </div>
      <label className='relative inline-flex cursor-pointer items-center'>
        <input
          id={`switch-${props.group.id}`}
          type='checkbox'
          className='peer sr-only'
          checked={isSelected}
          onChange={handleToggle}
        />
        <label htmlFor={`switch-${props.group.id}`} className='hidden'></label>
        <div className="peer h-[31px] w-[51px] rounded-full bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
      </label>
    </label>
  );
};

export default SettingsComponent;
