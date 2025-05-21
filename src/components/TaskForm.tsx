import type { Project } from "../types/project";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  project: Project;
  onClose: () => void;
};

type TaskFormInputs = {
  title: string;
  description: string;
};

export default function TaskForm({ project, onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInputs>();

  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: async (formData: TaskFormInputs) => {
      const data = JSON.stringify({ ...formData, project });
      const res = await fetch("http://localhost:3005/task/create", {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to create task");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", project.id] });
      reset();
      onClose();
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    },
  });

  const onSubmit = (formData: TaskFormInputs) => {
    createTaskMutation.mutate(formData);
  };

  return (
    <form
      className="flex flex-col mt-10"
      onReset={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="font-bold text-center text-3xl">Create task</h1>

      <label htmlFor="title" className="font-bold">
        Title:
      </label>
      <input
        type="text"
        id="title"
        placeholder="Title:"
        className="border-2 border-black p-2 rounded-xl"
        {...register("title", { required: "Title is required" })}
      />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <label htmlFor="description" className="font-bold mt-4">
        Description:
      </label>
      <textarea
        id="description"
        placeholder="Description:"
        className="border-2 border-black p-2 rounded-xl"
        {...register("description")}
      ></textarea>

      <div className="flex justify-center gap-4 mt-4">
        <button
          type="reset"
          className="border-2 border-black py-2 px-8 cursor-pointer"
        >
          Close
        </button>
        <button
          type="submit"
          className="border-2 border-black py-2 px-8 cursor-pointer"
        >
          {createTaskMutation.isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
