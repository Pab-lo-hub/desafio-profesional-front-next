// src/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default async function AdminPanel() {
  const session = await getServerSession(authOptions);

  console.log("Session in AdminPanel:", session);

  if (!session || session.user.role !== "admin") {
    console.log("Redirecting to /login due to:", { session });
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
      <p>Bienvenido, {session.user.email}</p>
      <p>Rol: {session.user.role}</p>
      <LogoutButton />
    </div>
  );
}