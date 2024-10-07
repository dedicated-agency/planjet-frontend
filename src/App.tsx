import { Route, Routes, useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import Home from "./views/Home";
import { useEffect, useReducer, useState } from "react";
import { StateContext } from "./context/StateContext";
import { Project } from "./views/Project";
import { Projects } from "./views/Projects";
import { Mytasks } from "./views/Mytasks";
import { Task } from "./views/Task";
import { sendData } from "./common/sendData";
import CreateTask from "./views/CreateTask";
import GroupSettings from "./views/GroupSettings";
import Events from "./views/Events";
import Onboarding from "./views/onboarding/Onboarding";
import SettingsProjects from "./views/SettingsProjects";
import Archive from "./views/Archive";
import Notification from "./views/Notification";
import Language from "./views/Language";
import CreateTaskFromGroup from "./views/CreateTaskFromGroup";
import HowToAdd from "./views/onboarding/HowToAdd";
import NotTelegram from "./components/mini/NotTelegram";
import Profile from "./views/Profile";
import Settings from "./views/Settings";
import TimeZone from "./views/TimeZone";
import i18n from "./i18n";

const testMode: string = import.meta.env.VITE_TEST_MODE;

function App() {
  const [state, setState] = useReducer(
    (state: any, setState: any) => ({
      ...state,
      ...setState,
    }),
    initialState,
  );
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
      const match: any = variable.match(/^(.*?)_(\d+)$/);
      const path = match[1];
      const id = match[2];

      if (path && id) {
        navigate("/" + path + "/" + id);
      }
    }

    const user = dataUnsafe?.user;
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (user && currentUser?.id !== user.id) {
      const userData = {
        id: user.id,
        first_name: user.first_name,
        username: user.username,
        language_code: user.language_code,
      };
      setState({ user: user, lang: user?.language_code });
      await sendData("user/init", userData, user.id);
      i18n.changeLanguage(user?.language_code);
      localStorage.setItem("currentUser", JSON.stringify(userData));
    } 
    else if(testMode === 'false') {
      const userData = {
        id: currentUser.id,
        first_name: currentUser.first_name,
        username: currentUser.username,
        language_code: currentUser.language_code,
      };
      i18n.changeLanguage(currentUser.language_code);
      setState({ user: userData, lang: userData?.language_code });
    }
    if(testMode  === 'true')
    {
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
    availableUserImages: state.availableUserImages
  };

  return (
    <StateContext.Provider value={contextValue}>
      <div className='max-w-[700px] bg-[#F2F2F7] h-[100dvh] mx-auto w-full relative'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/groups/:id' element={<Projects />} />
          <Route path='/projects/:id' element={<Project />} />
          <Route path='/projects/:id/settings' element={<GroupSettings />} />
          <Route path='/mytasks' element={<Mytasks />} />
          <Route path='/tasks/create/:project_id' element={<CreateTask />} />
          <Route
            path='/task/create/:project_id'
            element={<CreateTaskFromGroup />}
          />
          <Route path='/tasks/:id' element={<Task />} />
          <Route path='/event' element={<Events />} />
          <Route path='/onboarding' element={<Onboarding />} />
          <Route path='/onboardingcrate' element={<HowToAdd />} />
          <Route path='/settingsprojects' element={<SettingsProjects />} />
          <Route path='/archive' element={<Archive />} />
          <Route path='/project/:id/archive' element={<Archive />} />
          <Route path='/project/:id/archive/tasks/:id' element={<Task />} />
          <Route path='/notification' element={<Notification />} />
          <Route path='/language' element={<Language />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/timezone' element={<TimeZone />} />
        </Routes>
      </div>
    </StateContext.Provider>
  );
}

export default App;

const initialState = {
  user: {
    id: 0,
    first_name: "no name",
    location: "",
  },
  lang: "en",
  availableUserImages: {}
};
