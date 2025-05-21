import type { User } from "../types/user";
import { useForm } from "react-hook-form";
import { useCreateProject } from "../hooks/useCreateProject"; // хук мутації

type Props = {
  onClose: () => void;
  user: User;
};

type ProjectFormInputs = {
  title: string;
  description: string;
};

export default function ProjectForm({ onClose, user }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormInputs>();

  const { mutate, isPending, error } = useCreateProject();

  const onSubmit = (formData: ProjectFormInputs) => {
    mutate(
      {
        ...formData,
        owner: user,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gradient-to-l from-white to-blue-300 rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 font-bold text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="font-bold text-center text-3xl">Create project</h1>

          <label htmlFor="title" className="font-bold">
            Title:
          </label>
          <input
            id="title"
            placeholder="Title"
            className="border-2 border-black p-2 rounded-xl"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}

          <label htmlFor="description" className="font-bold mt-4">
            Description:
          </label>
          <textarea
            id="description"
            placeholder="Description"
            className="border-2 border-black p-2 rounded-xl"
            {...register("description", {
              required: "Description is required",
            })}
          ></textarea>
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}

          {error && <p className="text-red-500 mt-2">{error.message}</p>}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="border-2 border-black py-2 px-8 cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
