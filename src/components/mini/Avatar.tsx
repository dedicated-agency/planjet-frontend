import useUserColor from "../../common/useUserColor";

export const Avatar = (props: {
  image: string;
  alt: string;
  width?: number;
  radius?: number;
  id?: number;
  bgColor?: boolean;
}) => {
  const { width, image, alt, radius, id, bgColor } = props;

  const initials = alt
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")

  const { color, lightColor } = useUserColor(id);
  
  return image ? (
    <img
      src={image}
      alt={alt}
      style={{
        width: `${width ? width : 40}px`,
        height: `${width ? width : 40}px`,
      }}
      className={`rounded-[${radius}px] border`}
    />
  ) : (
    <div
      style={{
        width: `${width ? width : 40}px`,
        height: `${width ? width : 40}px`,
        borderRadius: `${radius}px`,
        background: `${!bgColor ? lightColor.color : "linear-gradient(0deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))"}`,
        color: color
      }}
      className={`rounded-[${radius}px] border border-customGrey2 backdrop-blur-xl flex justify-center items-center text-gray-500 uppercase shadow-custom60`}
    >
      {initials}
    </div>
  );
};
