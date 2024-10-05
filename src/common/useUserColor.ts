import { useMemo } from "react";

const colors = [
  {
    indigo: "#ffffff",
    indigo_light: "#639CD9",
  },
  {
    blue: "#ffffff",
    blue_light: "#56D698",
  },
  {
    greenblue: "#ffffff",
    greenblue_light: "#D65694",
  },
  {
    green: "#ffffff",
    green_light: "#DE7977",
  },
  {
    yellow: "#ffffff",
    yellow_light: "#6463B0",
  }
];

const useUserColor = (id: number | undefined) => {
  const selectedColors = useMemo(() => {
    if (id === undefined || id === null) {
      console.log("ID is null or undefined");
      return { color: colors[0].indigo, lightColor: colors[0].indigo_light };
    }

    const index = id % colors.length;
    const colorGroup: any = colors[index]; 

    if (!colorGroup) {
      console.log("Color group not found for index:", index);
      return { color: null, lightColor: null }; 
    }

    const colorName = Object.keys(colorGroup)[0]; 
    const lightColorName = `${colorName}_light`; 

    return {
      color: colorGroup[colorName],
      lightColor: colorGroup[lightColorName], 
    };
  }, [id]);

  return selectedColors;
};

export default useUserColor;