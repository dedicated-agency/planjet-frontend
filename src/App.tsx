import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { useEffect, useReducer, useState } from "react";
import { StateContext } from "./context/StateContext";
import { IUserData, sendData } from "./common/sendData";
import NotTelegram from "./components/mini/NotTelegram";
import i18n from "./i18n";
import AppRoutes from "./AppRoutes";

const testMode: string = import.meta.env.VITE_TEST_MODE;

function App() {
  const [state, setState] = useReducer(
    (state: IInitState, setState: any) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );

  console.log(state);
  
  const navigate = useNavigate();

  const [isTelegramWebApp, setIsTelegramWebApp] = useState(true);

  useEffect(() => {
    initer();
  }, []);

  const initer = async () => {
    const dataUnsafe = WebApp.initDataUnsafe;

    if (dataUnsafe && dataUnsafe?.user) {
      setIsTelegramWebApp(true);
    } else {
      setIsTelegramWebApp(false);
    }

    if (dataUnsafe?.start_param) {
      const variable = dataUnsafe?.start_param;
      const match = variable.match(/^(.*?)_(\d+)$/);
      if (match) {
        const path = match[1];
        const id = match[2];

        if (path && id) {
          navigate("/" + path + "/" + id);
        }
      }
    }

    const user = dataUnsafe?.user;
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (user && currentUser?.id !== user.id) {
      const userData: IUserData = {
        id: user.id,
        first_name: user.first_name,
        username: user.username,
        language_code: user.language_code,
      };
      setState({ user: user, lang: user?.language_code });
      await sendData("user/init", userData, user.id);
      i18n.changeLanguage(user?.language_code);
      localStorage.setItem("currentUser", JSON.stringify(userData));
    } else if (testMode === "false") {
      const userData = {
        id: currentUser.id,
        first_name: currentUser.first_name,
        username: currentUser.username,
        language_code: currentUser.language_code,
      };
      i18n.changeLanguage(currentUser.language_code);
      setState({ user: userData, lang: userData?.language_code });
    }
    if (testMode === "true") {
      const userData = {
        id: 5673577167,
        first_name: "Muhammad",
        username: "dayless_nights",
        language_code: "en",
      };
      setState({ user: userData, lang: "en" });
      await sendData("user/init", userData, 5673577167);
    }
  };

  if (!isTelegramWebApp && testMode  === 'false') {
    return <NotTelegram/>
  }

  const contextValue = {
    user: state.user,
    lang: state.lang,
    location: state.location,
    setContextState: setState,
    availableUserImages: state.availableUserImages,
  };

  return (
    <StateContext.Provider value={contextValue}>
      <AppRoutes/>
    </StateContext.Provider>
  );
}

export default App;

const initialState: IInitState = {
  user: {
    id: 0,
    first_name: "no name",
    location: "",
  },
  lang: "en",
  availableUserImages: {}
};

interface IInitState {
  user: IInitStateUser,
  lang: string,
  availableUserImages: Record<string, unknown>,
}

interface IInitStateUser {
  id: number,
  first_name: string,
  location: string,
}