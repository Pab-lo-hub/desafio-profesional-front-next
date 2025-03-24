"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { Button } from "@headlessui/react";
import { Input } from "@headlessui/react";
import { useState } from "react";

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setApiError(null);
    console.log("Submitting form", data);
    const { email, password } = data;

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log({ response });

      if (response?.error) {
        throw new Error(response.error);
      }

      if (!response?.ok) {
        throw new Error("Authentication failed");
      }

      console.log("Login Successful", response);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("Login Failed:", error);
      setApiError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-2/3 space-y-6 text-white p-4 md:p-16 border-[1.5px] rounded-lg border-gray-300 flex flex-col items-center justify-center gap-y-6"
    >
      <div className="w-full">
        <label htmlFor="email" className="block mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          className="w-full p-2 text-black border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="w-full">
        <label htmlFor="password" className="block mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          className="w-full p-2 text-black border rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {apiError && (
        <p className="text-red-500 text-sm text-center">{apiError}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-cyan-600 text-white p-2 rounded hover:scale-110 hover:bg-cyan-700 disabled:bg-gray-400 transition-all"
      >
        {isSubmitting ? "Opening..." : "Open Sesame!"}
      </Button>
    </form>
  );
}