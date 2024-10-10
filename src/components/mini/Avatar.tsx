import useUserColor from "../../common/useUserColor";

export const Avatar = (props: {
  image: string;
  alt: string;
  width?: number;
  radius?: number;
  id?: number;
}) => {
  const { width, image, alt, radius, id } = props;

  const { color } = useUserColor(id);
  
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
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))`,
        color: color
      }}
      className={`rounded-[${radius}px] border border-customGrey2 backdrop-blur-xl flex justify-center items-center text-gray-500 uppercase text-lg`}
    >
      {alt[0]}
    </div>
  );
};
