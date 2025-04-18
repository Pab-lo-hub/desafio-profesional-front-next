"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  role: string;
}

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const session = await getSession();
        if (!session || session.user.role !== "admin") {
          router.push("/login");
          return;
        }

        const response = await axios.get<User[]>(`${backendUrl}/api/users`, {
          headers: { "Content-Type": "application/json" },
        });

        setUsers(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "No se pudo cargar la lista de usuarios");
        setLoading(false);
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [router]);

  const handleRoleChange = async (userId: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const session = await getSession();
      if (!session || session.user.role !== "admin") {
        throw new Error("No tienes permisos para realizar esta acción");
      }

      const response = await axios.patch(
        `${backendUrl}/api/users/${userId}/role`,
        { role: newRole },
        { headers: { "Content-Type": "application/json" } }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      Swal.fire({
        title: "Éxito",
        text: `Rol actualizado a ${newRole}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudo actualizar el rol",
        icon: "error",
      });
      console.error("Error updating role:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-4">Lista de Usuarios</h1>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-4">Lista de Usuarios</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lista de Usuarios</h1>
          <Link
            href="/admin"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            Volver al Panel
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.apellido}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRoleChange(user.id, user.role)}
                          className={`px-4 py-2 rounded-lg text-white ${
                            user.role === "admin" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {user.role === "admin" ? "Revocar Admin" : "Hacer Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}