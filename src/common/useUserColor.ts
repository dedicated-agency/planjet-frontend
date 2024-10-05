const colors = [
  "#639CD9",
  "#56D698",
  "#D65694",
  "#6463B0"
];

const lightColor = "#ffffff";

const useUserColor = (id: number | undefined) => {
    if (id === undefined || id === null) {
      return { color: lightColor, lightColor: colors[0] };
    }
    const index = id % colors.length;
    return {
      color: lightColor,
      lightColor:  colors[index]
    };
 
};

export default useUserColor;