import { useState } from "react";
import type { Project } from "../types/project";
import TaskForm from "./TaskForm";
import type { Task } from "../types/task";
import type { User } from "../types/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  project: Project;
  onClose: () => void;
  user: User;
};

export default function ProjectDetails({ project, onClose, user }: Props) {
  const queryClient = useQueryClient();
  const [taskForm, setTaskForm] = useState(false);

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks", project.id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3005/task/${project.id}`);
      return res.json();
    },
  });

  const { data: userList = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3005/user");
      return res.json();
    },
    enabled: tasks.length > 0,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      const data = JSON.stringify({ id: project.id, user });
      await fetch(`http://localhost:3005/project/remove/${project.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      const data = JSON.stringify({ id: task.id, user });
      await fetch(`http://localhost:3005/task/remove/${task.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", project.id] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: Task) => {
      const data = JSON.stringify(updatedTask);
      await fetch(`http://localhost:3005/task/update/${updatedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", project.id] });
    },
  });

  const onSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
    task: Task,
    action: "status" | "assign"
  ) => {
    const updated: Task = { ...task };

    if (action === "status") {
      updated.status = e.target.value as Task["status"];
    } else {
      const selectedUser = userList.find((u) => `${u.id}` === e.target.value);
      updated.assignedTo = e.target.value === "null" ? null : selectedUser!;
    }

    updateTaskMutation.mutate(updated);
  };

  const taskStatusStyles = (task: Task) => {
    const base =
      "relative border-2 flex flex-col border-black py-4 px-2 w-full lg:w-[45%] rounded-xl max-h-fit gap-2";
    if (task.status === "TODO") return `${base} bg-red-300`;
    if (task.status === "IN_PROGRESS") return `${base} bg-yellow-300`;
    return `${base} bg-green-300`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="overflow-y-scroll max-h-screen bg-gradient-to-l from-white to-blue-300 rounded-xl shadow-xl p-6 w-full max-w-md relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 font-bold text-gray-500 hover:text-gray-700 hover:scale-150 duration-500 cursor-pointer"
        >
          &times;
        </button>
        <h1 className="font-bold text-3xl text-center py-4">Project Details</h1>

        <div>
          <h1 className="font-bold">Title: {project.title}</h1>
          <h1 className="font-bold">Owner: {project.owner.name}</h1>
          <h2 className="font-bold break-words">Description: {project.description}</h2>
        </div>

        {project.owner.id === user.id && (
          <div>
            <button
              className="border-2 border-black py-2 px-8 bg-red-400 font-bold my-4 cursor-pointer"
              onClick={() => deleteProjectMutation.mutate()}
            >
              Delete project
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-4">
          {tasks.length ? (
            tasks
              .sort((a, b) => b.id - a.id)
              .map((task) => (
                <div key={task.id} className={taskStatusStyles(task)}>
                  <h1 className="text-center font-bold">{task.title}</h1>
                  {project.owner.id === user.id && (
                    <button
                      onClick={() => deleteTaskMutation.mutate(task)}
                      className="absolute top-2 right-2 font-bold text-gray-500 hover:text-gray-700 hover:scale-150 duration-500 cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                  <h2 className="break-words">{task.description}</h2>
                  
                  <div className="flex gap-2">
                    <h2>Status:</h2>
                    <select
                      className="border-2 border-black"
                      value={task.status}
                      onChange={(e) => onSelect(e, task, "status")}
                    >
                      <option value="TODO">Todo</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <h2>Assigned to</h2>
                    <select
                      className="border-2 border-black"
                      value={task.assignedTo ? `${task.assignedTo.id}` : "null"}
                      onChange={(e) => onSelect(e, task, "assign")}
                    >
                      <option value="null">null</option>
                      {userList.map((u) => (
                        <option key={u.id} value={`${u.id}`}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
          ) : (
            <div>
              <h1>You don't have any tasks.</h1>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-5">
          <button
            className="font-bold border-2 border-black py-2 px-8"
            onClick={() => setTaskForm(true)}
          >
            Create task
          </button>
        </div>

        {taskForm && (
          <TaskForm project={project} onClose={() => setTaskForm(false)} />
        )}
      </div>
    </div>
  );
}
