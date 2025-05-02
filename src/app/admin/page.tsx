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
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Panel de Administración</h1>
        <p className="text-lg font-medium text-gray-900 mb-2">Bienvenido, {session.user.email}</p>
        <p className="text-sm text-gray-500 mb-6">Rol: {session.user.role}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tarjeta para Agregar Producto */}
          <div className="w-full sm:w-80 bg-white shadow-lg rounded-lg p-6">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Agregar Producto</h5>
            <p className="text-gray-700 font-normal mb-4">Crea un nuevo producto en el sistema.</p>
            <Link href="/admin/products/add">
              <button className="w-full text-center px-4 py-2.5 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors">
                Agregar Producto
              </button>
            </Link>
          </div>
          {/* Tarjeta para Lista de Productos */}
          <div className="w-full sm:w-80 bg-white shadow-lg rounded-lg p-6">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Lista de Productos</h5>
            <p className="text-gray-700 font-normal mb-4">Ver y gestionar todos los productos.</p>
            <Link href="/admin/products">
              <button className="w-full text-center px-4 py-2.5 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors">
                Ver Productos
              </button>
            </Link>
          </div>
          {/* Tarjeta para Lista de Usuarios */}
          <div className="w-full sm:w-80 bg-white shadow-lg rounded-lg p-6">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Lista de Usuarios</h5>
            <p className="text-gray-700 font-normal mb-4">Ver y gestionar los usuarios del sistema.</p>
            <Link href="/admin/users">
              <button className="w-full text-center px-4 py-2.5 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors">
                Ver Usuarios
              </button>
            </Link>
          </div>
          {/* Tarjeta para Lista de Características */}
          <div className="w-full sm:w-80 bg-white shadow-lg rounded-lg p-6">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Lista de Características</h5>
            <p className="text-gray-700 font-normal mb-4">Ver y gestionar las características de los productos.</p>
            <Link href="/admin/features">
              <button className="w-full text-center px-4 py-2.5 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors">
                Ver Características
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}