// src/app/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

// Interfaz para la estructura de un producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria?: { id: number; titulo: string };
}

/**
 * Componente para listar y gestionar productos en el panel de administración.
 * Muestra una tabla con los productos, permite editarlos o eliminarlos.
 */
export default function ProductList() {
  // Estado para la lista de productos
  const [productos, setProductos] = useState<Producto[]>([]);
  // Estado para indicar si se está cargando
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);
  // Hook de enrutamiento de Next.js
  const router = useRouter();
  // URL del backend desde variables de entorno
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  /**
   * Efecto para cargar los productos y verificar la sesión del usuario.
   * Si el usuario no es admin, redirige a /login.
   * @returns {void}
   */
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const session = await getSession();
        if (!session || session.user.role !== "admin") {
          router.push("/login");
          return;
        }
        const response = await axios.get<Producto[]>(`${backendUrl}/api/productos`);
        setProductos(response.data);
        setLoading(false);
      } catch (err: any) {
        setError("No se pudieron cargar los productos");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };
    fetchProductos();
  }, [router]);

  /**
   * Maneja la eliminación de un producto tras confirmar con el usuario.
   * @param {number} id - ID del producto a eliminar
   * @returns {Promise<void>}
   */
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${backendUrl}/api/productos/${id}`);
        setProductos(productos.filter((p) => p.id !== id));
        Swal.fire({
          title: "Eliminado",
          text: "Producto eliminado correctamente",
          icon: "success",
          timer: 1500,
        });
      } catch (err: any) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el producto",
          icon: "error",
        });
        console.error("Error deleting product:", err);
      }
    }
  };

  // Renderiza el estado de carga
  if (loading) {
    return (
      <div className="min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-4">Productos</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  // Renderiza el estado de error
  if (error) {
    return (
      <div className="min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-4">Productos</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Renderiza la lista de productos
  return (
    <div className="min-h-screen p-8 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Link
          href="/admin/products/add"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Agregar Producto
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td className="px-6 py-4 whitespace-nowrap">{producto.nombre}</td>
                <td className="px-6 py-4">{producto.descripcion}</td>
                <td className="px-6 py-4">
                  {producto.categoria ? producto.categoria.titulo : "Sin categoría"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/admin/products/edit/${producto.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(producto.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}