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
      <div className="flex flex-row">
        <div className="basis-3xs">
          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Agregar Producto</h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Agregar Producto</p>
            <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Agregar Producto
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                {/* <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" /> */}
              </svg>
            </a>
          </div>

        </div>
        <div className="basis-2xs">
          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Agregar Producto</h5>
            <Link href="/admin/products/add">
              <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Agregar Producto
              </button>
            </Link>
          </div>
        </div>
        <div className="basis-xs">03</div>
        <div className="basis-sm">04</div>
      </div>
      <LogoutButton />
    </div>
  );
}