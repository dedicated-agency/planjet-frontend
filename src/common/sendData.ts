import axiosClient from "./axiosClient";

export const sendData = async (path: string, data: any, accountId: number) => {
  try {
    const response = await axiosClient.post(path, data);
    localStorage.setItem(`accessToken_${accountId}`, JSON.stringify(response?.data?.token));
    return response.data;
  } catch (error) {
    console.error("Error sending data:", error);
    throw error;
  }
};
