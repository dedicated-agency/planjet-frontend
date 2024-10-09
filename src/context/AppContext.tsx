import { settingsButton } from "@telegram-apps/sdk";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext({});

function AppProvider({ children }: PropsWithChildren<{}>) {
    const navigate = useNavigate();
    useEffect(() => {
        settingsButton.mount();
        settingsButton.show();
        settingsButton.onClick(() => {
            navigate('/settings')
        });
        //     backgroundColor: "#007AFF"
      }, []);
    
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
  