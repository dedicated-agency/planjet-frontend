import { useQuery } from "react-query";
import axiosClient from "./axiosClient";


async function getTasks(params: string, id: number): Promise<any> {
  const response = await axiosClient.get("/project/show/" + id, { params });
  return response.data;
}

export function useGetTasks(params: any, id: number) {
  return useQuery({
    queryKey: ["tasksDate", params, id],
    queryFn: () => getTasks(params, id),
    refetchOnReconnect: true,
  });
}
