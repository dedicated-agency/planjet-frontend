import { IUser } from "../components/Comment";
import axiosClient from "./axiosClient";
import imageCacheChacker from "./imagesCacher";

interface User {
    telegram_id: string,
    name: string,
    username: string,
    phone: string,
    language_code: string
}

interface GroupUser {
    group_id: string,
    user_id: string,
    is_selected: boolean,
    user: User
}

interface IUserProp {
    user_id: string,
    image: string,
    user: IUser,
}

interface DynamicObject {
    [key: string]: GroupUser[];
}

const usersByGroups: DynamicObject = {};

const getData = async (id: string) => {
    const {data} = await axiosClient.get(`/group/${id}/users`);
    return data;
}

const getUsersData = async (group_id: string) => {
    if(usersByGroups[group_id])
    {    
        return usersByGroups[group_id];
    }else{
        const groupUsers = await getData(group_id);
        const resultPromises = groupUsers.map(async (user: IUserProp) => {
            user.image = await imageCacheChacker( user.user_id );
            return {...user, name: user.user.name, telegram_id: user.user_id, username: user.user.username};
        });
        const result = await Promise.all(resultPromises);
        usersByGroups[group_id] = result;
        return result;
    }
};

export default getUsersData;