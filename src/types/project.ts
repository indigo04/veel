import { z } from "zod";
import type { User } from "./user";

export interface Project {
  id: number;
  title: string;
  description: string;
  owner: User;
}

export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  owner: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
  }),
});
