const colors = [
  {
    id: 1,
    color:
      "linear-gradient(0deg, #5694D6, #5694D6), linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
  },
  {
    id: 2,
    color:
      "linear-gradient(0deg, #44A9AB, #44A9AB), linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
  },
  {
    id: 3,
    color:
      "linear-gradient(0deg, #D65694, #D65694), linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
  },
  {
    id: 4,
    color:
      "linear-gradient(0deg, #DE7977, #DE7977), linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
  },
  {
    id: 5,
    color:
      "linear-gradient(0deg, #6463B0, #6463B0), linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
  },
];

const lightColor = "#ffffff";

const useUserColor = (id: number | undefined) => {
  if (id === undefined || id === null) {
    return { color: lightColor, lightColor: colors[0] };
  }
  const index = id % colors.length;
  return {
    color: lightColor,
    lightColor: colors[index],
  };
};

export default useUserColor;
