// src/app/login/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./form";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Importa authOptions

export default async function LoginPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const session = await getServerSession(authOptions);
  console.log({ session });

  // Si hay sesión y el rol es "admin", redirige a /admin
  if (session && session.user.role === "admin") {
    redirect("/admin");
  }
  // Si hay sesión pero no es "admin", no redirigir, mostrar login para cerrar sesión o cambiar usuario
  // Si no hay sesión, mostrar el formulario de login

  return (
    <section className="bg-black h-screen flex items-center justify-center">
      <div className="w-[600px]">
        <LoginForm />
      </div>
    </section>
  );
}