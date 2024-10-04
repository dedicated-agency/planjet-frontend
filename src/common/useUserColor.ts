import { useMemo } from "react";

const colors = [
  {
    indigo: "#5856D6",
    indigo_light: "#E2E2F5",
  },
  {
    blue: "#007AFF",
    blue_light: "#D5E7FB",
  },
  {
    greenblue: "#00C7BE",
    greenblue_light: "#D5F3F1",
  },
  {
    green: "#009951",
    green_light: "#CFF7D3",
  },
  {
    yellow: "#FFCC00",
    yellow_light: "#FFF1C2",
  },
  {
    red: "#FF3B30",
    red_light: "#FDD3D0",
  },
];

const useUserColor = (id: number | undefined) => {
  const selectedColors = useMemo(() => {
    if (id === undefined || id === null) {
      console.log("ID is null or undefined");
      return { color: colors[0].indigo, lightColor: colors[0].indigo_light }; // Agar id mavjud bo'lmasa
    }

    const index = id % colors.length; // 6 ga qoldiqli
    const colorGroup: any = colors[index]; // Rang guruhini olish

    if (!colorGroup) {
      console.log("Color group not found for index:", index);
      return { color: null, lightColor: null }; // Tekshiruv: undefined qiymat kelmasligi uchun
    }

    const colorName = Object.keys(colorGroup)[0]; // Asosiy rang nomini olish
    const lightColorName = `${colorName}_light`; // Light rang nomini tuzish

    return {
      color: colorGroup[colorName], // Asosiy rang
      lightColor: colorGroup[lightColorName], // Light rang
    };
  }, [id]);

  return selectedColors; // Tanlangan rang va light rangni qaytarish
};

export default useUserColor;