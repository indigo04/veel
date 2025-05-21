import { useState } from "react";
import { UserSchema, type User } from "../types/user";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

type Props = {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

type AuthFormInputs = {
  name: string;
  email: string;
};

export default function AuthForm({ setUser }: Props) {
  const [register, setRegister] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormInputs>();
  const mutation = useMutation({
    mutationFn: async (data: AuthFormInputs) => {
      const response = await fetch(
        register
          ? "http://localhost:3005/user/create"
          : "http://localhost:3005/user/find",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.message) {
        throw new Error(result.message);
      }

      const zodData = UserSchema.safeParse(result);
      if (!zodData.success) {
        throw new Error(zodData.error.errors[0].message);
      }

      return zodData.data;
    },
    onSuccess: (userData) => {
      setUser(userData);
      reset();
    },
    onError: (err: Error) => {
      setError(err);
    },
  });

  const onSubmit = (data: AuthFormInputs) => {
    mutation.mutate(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col rounded-4xl items-center w-fit mx-auto py-15 px-12 border-2 border-black gap-4"
    >
      <h1 className="text-4xl font-bold">AuthForm</h1>

      <div className="flex flex-col">
        <label htmlFor="name" className="font-bold">
          Name:
        </label>
        <input
          className="py-2 px-4 border-2 border-black"
          type="text"
          id="name"
          placeholder="Name:"
          {...formRegister("name", { required: "Name is required" })}
          onChange={() => setError(null)}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col">
        <label htmlFor="email" className="font-bold">
          Email:
        </label>
        <input
          className="py-2 px-4 border-2 border-black"
          type="email"
          id="email"
          placeholder="Email:"
          {...formRegister("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          onChange={() => setError(null)}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      {register ? (
        <div className="flex items-center w-full gap-4">
          <button
            className="py-2 px-8 border-2 border-black w-fit"
            type="submit"
          >
            Sign up
          </button>
          <h3
            onClick={() => setRegister(false)}
            className="text-blue-400 cursor-pointer"
          >
            Sign in
          </h3>
        </div>
      ) : (
        <div className="flex items-center w-full gap-4">
          <button
            className="py-2 px-8 border-2 border-black w-fit"
            type="submit"
          >
            Sign in
          </button>
          <h3
            onClick={() => setRegister(true)}
            className="text-blue-400 cursor-pointer"
          >
            Sign up
          </h3>
        </div>
      )}

      {error?.message === "Bad request" && (
        <p className="text-red-400">User does not exist</p>
      )}
      {error?.message && error.message !== "Bad request" && (
        <p className="text-red-400">User with this email already exists</p>
      )}
    </form>
  );
}
