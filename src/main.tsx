import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { QueryClient, QueryClientProvider } from "react-query";
import './i18n'; 
import Application from "./Application.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import { postEvent } from "@telegram-apps/sdk";

const queryClient = new QueryClient();
postEvent('web_app_expand');
postEvent('web_app_setup_main_button', { is_visible: false })
postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false })
WebApp.ready();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserProvider>
        <AppProvider>
          <Application/>
        </AppProvider>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>,
);
