import { useParams } from "react-router-dom";
import { AddTaskButton } from "../components/AddTaskButton";
import { ProjectCarusel } from "../components/ProjectCarusel";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useUserContext } from "../context/UserContext";

const BackButton = WebApp.BackButton;
BackButton.show();
BackButton.onClick(() => window.history.back());
const Project = () => {
  const { id } = useParams();
  const {updateUserState} = useUserContext()
  useEffect(() => {
    WebApp.setHeaderColor("#FFFFFF");
    updateUserState({location: "project" });
  }, []);

  return (
    <>
      <ProjectCarusel />
      <AddTaskButton id={Number(id)} />
    </>
  );
};


export default Project
