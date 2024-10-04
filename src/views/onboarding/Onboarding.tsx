import { useEffect, useState } from "react";
import HowToAdd from "./HowToAdd";
import HowToCreate from "./HowToCreate";
import UsefullCommand from "./UsefullCommand";
import WebApp from "@twa-dev/sdk";

const Onboarding = () => {
  useEffect(() => {
    WebApp.setHeaderColor("#007AFF");
  }, []);
  const [page, setPage] = useState(1);
  return (
    <>
      {(page === 1 && <HowToAdd setPage={setPage} />) ||
        (page === 2 && <HowToCreate setPage={setPage} />) ||
        (page === 3 && <UsefullCommand />)}
    </>
  );
};

export default Onboarding;
