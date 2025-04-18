"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@headlessui/react";
import { Input } from "@headlessui/react";
import { SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const FormSchema = z.object({
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
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function FormPage() {
  const router = useRouter();
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
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Submitting form", data);
    const { nombre, apellido, email, password } = data;

    try {
      // Registrar usuario
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, apellido, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar el usuario");
      }

      const result = await response.json();
      console.log("Registration Successful", result);

      // Iniciar sesión automáticamente
      const signInResponse = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResponse?.error) {
        throw new Error("Error al iniciar sesión: " + signInResponse.error);
      }

      // Mostrar mensaje de éxito
      await Swal.fire({
        title: "Registro exitoso",
        text: "Su cuenta ha sido creada y ha iniciado sesión.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirigir a la página principal
      router.push("/");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo completar el registro.",
        icon: "error",
      });
      console.error("Registration Failed:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 bg-white p-6 rounded shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">Registro</h1>

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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Contraseña"
            {...register("password")}
            className="mt-1 w-full p-2 border rounded data-[focus]:ring-2 data-[focus]:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 data-[hover]:bg-blue-600 data-[disabled]:bg-gray-400"
        >
          {isSubmitting ? "Enviando..." : "Registrarse"}
        </Button>
      </form>
    </div>
  );
}