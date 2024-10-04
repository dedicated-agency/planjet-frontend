import useUserColor from "../../common/useUserColor";

export const Avatar = (props: {
  image: any;
  alt: string;
  width?: number;
  radius?: number;
  id?: number;
}) => {
  const { width, image, alt, radius, id } = props;

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
        background: lightColor,
        color: color
      }}
      className={`rounded-[${radius}px] border bg-white flex justify-center items-center text-gray-500 uppercase text-lg`}
    >
      {alt[0]}
    </div>
  );
};
