import { fetchImage } from "./fetchImage";

interface DynamicObject {
    [key: string]: any;
  }
const imageCacheChacker = async (id: string, userImages: DynamicObject, setState: any) => {
    if(userImages[id])
    {    
        return userImages[id];
    }else{
        const imageBase = await fetchImage(Number(id));
        userImages[id] = imageBase;
        setState({userImages: {...userImages}})
        return imageBase;
    }
}

export default imageCacheChacker;