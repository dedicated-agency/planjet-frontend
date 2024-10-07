import useUserColor from "../../common/useUserColor";

export const AvatarUser = (props: {
  image: string;
  alt: string;
  width?: number;
  height?: number;
  mr?: boolean;
  id?: number;
  size?: number;
}) => {
  const { color, lightColor } = useUserColor(props.id);
  return props.image ? (
    <img
      src={props.image}
      alt={props.alt}
      className={`w-[${props.width ? props.width : 24}px] h-[${
        props.height ? props.height : 24
      }px] min-w-[${props.width ? props.width : 24}px] rounded-full border-[2px] border-customWhite2 ${
        props.mr ? "" : "mr-[-12px] "
      }`}
      style={{
        fontFamily: "SF Pro Display",
        backgroundColor: lightColor,
        color: color,
        minHeight: `${props.width ? props.width : 24}px`
      }}
    />
  ) : (
    <div
      className={`${props.mr ? "" : "mr-[-12px] "} w-[${
        props.width ? props.width : 24
      }px] h-[${props.width ? props.width : 24}px] min-w-[${
        props.width ? props.width : 24
      }px] rounded-full border-[1.5px] border-customWhite2 bg-gray-100 flex justify-center items-center text-customBlack uppercase text-md`}
      style={{
        fontFamily: "SF Pro Display",
        backgroundColor: lightColor,
        color: color,
        minHeight: `${props.width ? props.width : 24}px`
      }}
    >
      <p style={{fontSize: `${props.size}px` || ""}}>{props?.alt[0]}</p>
    </div>
  );
};
