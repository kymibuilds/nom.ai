import { api } from "@/trpc/react";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

function useProject() {
  const { data: projects, isLoading } = api.project.getProjects.useQuery();
  const [projectId, setProjectId] = useLocalStorage<string>("qode-project", "");

  useEffect(() => {
    if (!projects) return;

    // Case 1: No projects at all → clear selected project
    if (projects.length === 0) {
      setProjectId(""); // ensures consistency
      return;
    }

    // Case 2: No local selection → pick the first project
    if (!projectId) {
      setProjectId(projects?.[0]?.id ?? "");
      return;
    }

    // Case 3: Stored projectId is invalid → reset to first project
    const exists = projects.some((p) => p.id === projectId);
    if (!exists) {
      setProjectId(projects?.[0]?.id ?? "");
    }
  }, [projects, projectId, setProjectId]);

  // Final selected project (null if none)
  const project = projects?.find((p) => p.id === projectId) ?? null;

  return {
    projects,
    project,
    projectId,
    setProjectId,
    loading: isLoading,
    hasProjects: (projects?.length ?? 0) > 0,
  };
}

export default useProject;
