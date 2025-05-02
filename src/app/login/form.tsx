"use client";

import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useFormState } from "react-hook-form";
import * as z from "zod";
import { Button } from "@headlessui/react";
import { Input } from "@headlessui/react";
import { useState, useRef, useEffect } from "react";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormData = z.infer<typeof FormSchema>;

const FormField = ({ id, label, type, register, error, placeholder }: any) => (
  <div className="w-full">
    <label htmlFor={id} className="block mb-1 text-white">
      {label}
    </label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      {...register}
      className="w-full p-2 text-black border rounded"
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <p id={`${id}-error`} className="text-red-500 text-sm mt-1">
        {error.message}
      </p>
    )}
  </div>
);

export default function LoginForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    emailInputRef.current?.focus();
    const savedEmail = localStorage.getItem("lastEmail");
    if (savedEmail) setValue("email", savedEmail);
  }, [setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setApiError(null);
    const trimmedData = { email: data.email.trim(), password: data.password.trim() };
    console.log("Submitting form", trimmedData);
    localStorage.setItem("lastEmail", trimmedData.email);

    try {
      const response: SignInResponse | undefined = await signIn("credentials", {
        email: trimmedData.email,
        password: trimmedData.password,
        redirect: false,
      });

      if (!response) throw new Error("No response from authentication server");

      console.log({ response });

      if (response.error) throw new Error(response.error);
      if (!response.ok) throw new Error("Authentication failed");

      console.log("Login Successful", response);
      setSuccess(true);
      setTimeout(() => router.push("/"), 1000);
    } catch (error: any) {
      console.error("Login Failed:", error);
      setApiError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-2/3 space-y-6 text-white p-4 md:p-16 border-[1.5px] rounded-lg border-gray-300 flex flex-col items-center justify-center gap-y-6"
      aria-label="Login Form"
    >
      <h1 className="text-2xl font-bold text-white">Login</h1>

      <FormField
        id="email"
        label="Email"
        type="email"
        register={register("email")}
        error={errors.email}
        placeholder="Enter your email"
      />

      <FormField
        id="password"
        label="Password"
        type="password"
        register={register("password")}
        error={errors.password}
        placeholder="Enter your password"
      />

      {success && (
        <p className="text-green-500 text-sm text-center">Login successful!</p>
      )}
      {apiError && (
        <p className="text-red-500 text-sm text-center">{apiError}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-cyan-600 text-white p-2 rounded hover:scale-110 hover:bg-cyan-700 disabled:bg-gray-400 transition-all flex items-center justify-center disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Opening...
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>

      {/* <a href="/forgot-password" className="text-cyan-400 text-sm hover:underline">
        Forgot Password?
      </a> */}
    </form>
  );
}