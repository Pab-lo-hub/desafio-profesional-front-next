"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@headlessui/react";
import { Input } from "@headlessui/react";
import { SubmitHandler } from "react-hook-form";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }).max(50, {
    message: "El nombre no puede exceder los 50 caracteres.",
  }),
  apellido: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }).max(50, {
    message: "El apellido no puede exceder los 50 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, ingrese un correo electrónico válido.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function FormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Submitting form", data);
    const { username: email, password } = data;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Registration Successful", result);
    } catch (error: any) {
      console.error("Registration Failed:", error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-2/3 space-y-6"
    >
      <h1>HOLA FORM</h1>

      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <Input
          id="nombre"
          type="text"
          placeholder="Nombre"
          {...register("nombre")}
          className="mt-1 w-full p-2 border rounded data-[focus]:ring-2 data-[focus]:ring-blue-500"
        />
        {errors.nombre && (
          <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
          Apellido
        </label>
        <Input
          id="apellido"
          type="text"
          placeholder="Apellido"
          {...register("apellido")}
          className="mt-1 w-full p-2 border rounded data-[focus]:ring-2 data-[focus]:ring-blue-500"
        />
        {errors.apellido && (
          <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Correo Electrónico"
          {...register("email")}
          className="mt-1 w-full p-2 border rounded data-[focus]:ring-2 data-[focus]:ring-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          type="text"
          placeholder="Username"
          {...register("username")}
          className="w-full p-2 border rounded"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>

      <div>
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full p-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form >
  );
}