import { settingsButton } from "@telegram-apps/sdk";
import WebApp from "@twa-dev/sdk";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext({});
const testMode: string = import.meta.env.VITE_TEST_MODE;

function AppProvider({ children }: PropsWithChildren<{}>) {
    const navigate = useNavigate();
    useEffect(() => {
        if(testMode === 'false')
        {
            settingsButton.mount();
            settingsButton.show();
            WebApp.SettingsButton.onClick(() => navigate('/settings'));
            WebApp.setBackgroundColor("#f2f2f7")
            WebApp.expand();
        }
      }, [navigate]);
    
    const contextValue = {}
    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

const useAppContext = () => {
    const context = useContext(AppContext);
    
    if (!context) {
      throw new Error("useUserContext must be used within a UserProvider");
    }
  
    return context;
};
  
export { AppProvider, AppContext, useAppContext };
  