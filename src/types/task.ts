import { type Project } from "./project";
import { STATUS } from "./status";
import { type User } from "./user";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: STATUS;
  project: Project;
  assignedTo: User | null;
}
