import { settingsButton } from "@telegram-apps/sdk";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext({});

function AppProvider({ children }: PropsWithChildren<{}>) {
    const navigate = useNavigate();
    useEffect(() => {
        settingsButton.isVisible();
        settingsButton.show();
        settingsButton.onClick(SettingsButtonListener);
        // secondaryButton.setParams({
        //     text: "Settings",
        //     isVisible: true,
        //     backgroundColor: "#007AFF"
        // }),
        // secondaryButton.onClick(SettingsButtonListener);
      }, []);

    const SettingsButtonListener = () => {
        navigate('/settings')
    }
    
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
  