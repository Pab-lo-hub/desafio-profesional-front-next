// src/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

export default async function AdminPanel() {
  const session = await getServerSession(authOptions);

  console.log("Session in AdminPanel:", session);

  if (!session || session.user.role !== "admin") {
    console.log("Redirecting to /login due to:", { session });
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-8 text-black">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
      <p>Bienvenido, {session.user.email}</p>
      <p>Rol: {session.user.role}</p>
      <div className="flex flex-row flex-wrap gap-4">
        {/* Tarjeta para Agregar Producto */}
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded Ending Session-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Agregar Producto</h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Crea un nuevo producto en el sistema.</p>
          <Link href="/admin/products/add">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300">
              Agregar Producto
            </button>
          </Link>
        </div>
        {/* Tarjeta para Lista de Productos */}
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Lista de Productos</h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Ver y gestionar todos los productos.</p>
          <Link href="/admin/products">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300">
              Ver Productos
            </button>
          </Link>
        </div>
        {/* Tarjeta para Lista de Usuarios */}
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Lista de Usuarios</h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Ver y gestionar los usuarios del sistema.</p>
          <Link href="/admin/users">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300">
              Ver Usuarios
            </button>
          </Link>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}