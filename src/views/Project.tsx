import { useParams } from "react-router-dom";
import { AddTaskButton } from "../components/AddTaskButton";
import { ProjectCarusel } from "../components/ProjectCarusel";
import WebApp from "@twa-dev/sdk";
import { useContext, useEffect } from "react";
import { StateContext } from "../context/StateContext";

const BackButton = WebApp.BackButton;
BackButton.show();
BackButton.onClick(() => window.history.back());
const Project = () => {
  const { id } = useParams();
  const { setContextState } = useContext(StateContext);
  useEffect(() => {
    WebApp.setHeaderColor("#FFFFFF");
    setContextState({ location: "project" });
  }, []);

  return (
    <>
      <ProjectCarusel />
      <AddTaskButton id={Number(id)} />
    </>
  );
};


export default Project
