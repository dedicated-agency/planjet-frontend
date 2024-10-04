import { useEffect, useState } from "react";
import { Avatar } from "./mini/Avatar";

const SettingsComponent = (props: any) => {
  const [isSelected, setIsSelected] = useState(props.isSelected); // Propdan olingan isSelected

  useEffect(() => {
    setIsSelected(props.isSelected); // Prop o'zgarganda yangilash
  }, [props.isSelected]);

  const handleToggle = () => {
    const newSelectedState = !isSelected; // Holatni o'zgartirish
    setIsSelected(newSelectedState); // Lokal holatni yangilash
    props.handleUpdateGroup(props.group.id, newSelectedState); // Yana asosiy komponentga yuborish
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
          id={`switch-${props.group.id}`} // ID ni noyob qilish
          type='checkbox'
          className='peer sr-only'
          checked={isSelected} // Lokal holatdan foydalanish
          onChange={handleToggle} // Holatni o'zgartirish
        />
        <label htmlFor={`switch-${props.group.id}`} className='hidden'></label>
        <div className="peer h-[31px] w-[51px] rounded-full bg-slate-200 after:absolute after:left-[2px]  after:top-0.5 after:h-[27px] after:w-[27px] after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-custom-gradient-blue peer-checked:after:translate-x-[20px] peer-checked:after:border-custom-gradient-blue "></div>
      </label>
    </label>
  );
};

export default SettingsComponent;
