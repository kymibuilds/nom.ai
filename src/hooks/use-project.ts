import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

function useProject() {
   
  const { data: projects } = api.project.getProjects.useQuery();

  const [projectId, setProjectId] = useLocalStorage("qode-project", "");

  const project = projects?.find((p) => p.id === projectId);

  return {
    projects,
    project,
    projectId,
    setProjectId,
  };
}

export default useProject;
