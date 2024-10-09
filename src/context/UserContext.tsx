import { createContext, PropsWithChildren, useContext, useReducer } from "react";
import NotTelegram from "../components/mini/NotTelegram";
import i18n from "../i18n";
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import axios from "axios";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";

interface UserState {
  user: {
    telegram_id: number;
    first_name: string;
    username: string;
    lang: string;
  };
  location: string;
  isTelegramWebApp: boolean;
}

interface UserContextType {
  user: UserState['user'];
  updateUserState: (state: Partial<UserState>) => void;
  isTelegramWebApp: boolean;
  initer: () => Promise<void>;
  location: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const testMode: string = import.meta.env.VITE_TEST_MODE;

const initialState: UserState = {
  user: {
    telegram_id: 0,
    first_name: "no user",
    username: "no username",
    lang: "en",
  },
  location: "",
  isTelegramWebApp: true,
};

function UserProvider({ children }: PropsWithChildren<{}>) {
  const navigate = useNavigate();
  const [state, setState] = useReducer(
    (state: UserState, setState: Partial<UserState>) => ({
    ...state,
    ...setState,
  }), initialState);
  
  const initer = async () => {

    if(testMode === 'false')
    {
      const dataUnsafe = WebApp.initDataUnsafe;
      setState({isTelegramWebApp: (dataUnsafe && dataUnsafe?.user) ? true : false})
  
      if (dataUnsafe?.start_param) {
        const variable = dataUnsafe?.start_param;
        const match: any = variable.match(/^(.*?)_(\d+)$/);
        const path = match[1];
        const id = match[2];
  
        if (path && id) {
          navigate("/" + path + "/" + id);
        }
      }

      const { initDataRaw } = retrieveLaunchParams();
      try {
        const response = await axios.post('https://telegram.circle.uz/auth', null, {
          headers: {
            Authorization: `tma ${initDataRaw}`
          },
        });

        if(response && response.data)
        {
          const initUser = response.data.user;
          
          const userData = {
            telegram_id: initUser.id,
            first_name: initUser.first_name,
            username: initUser.first_name,
            lang: initUser.languageCode,
          }

          i18n.changeLanguage(initUser.languageCode);
          setState({ user: userData});
        }

      } catch (error) {
        console.log("error initer", error);
      }    
    }


    if (testMode === 'true') {
      const userData = {
        id: 5673577167,
        first_name: "Muhammad",
        username: "dayless_nights",
        lang: "en",
      };
      console.log({userData});
      
      setState({ user: {...userData, telegram_id: userData.id }});
    }
  };

  if (!state.isTelegramWebApp && testMode === 'false') {
    return <NotTelegram />;
  }

  const contextValue: UserContextType = {
    user: state.user,
    updateUserState: setState,
    isTelegramWebApp: state.isTelegramWebApp,
    initer,
    location: state.location,
  };

  console.log({state});
  
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};

export { UserProvider, UserContext, useUserContext };
