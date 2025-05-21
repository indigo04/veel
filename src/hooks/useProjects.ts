import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ProjectSchema } from "../types/project";
import type { User } from "../types/user";

const ProjectsSchema = z.array(ProjectSchema);

const fetchProjects = async () => {
  const response = await fetch("http://localhost:3005/project");
  const data = await response.json();

  const zodData = ProjectsSchema.safeParse(data);
  if (!zodData.success) {
    throw new Error(zodData.error.errors[0].message);
  }

  return zodData.data;
};

export const useProjects = (user?: User) => {
  return useQuery({
    queryKey: ["projects", user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve([]);
      return fetchProjects();
    },
    enabled: !!user,
    retry: false,
  });
};
