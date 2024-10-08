import { useEffect } from "react";
import AppRoutes from "./AppRoutes";
import { useUserContext } from "./context/UserContext";

function Application() {
    const context = useUserContext()
    useEffect(() => {
        context.initer();
    }, []);

    return <AppRoutes/>
}

export default Application;