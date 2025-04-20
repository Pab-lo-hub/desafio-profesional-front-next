// src/app/admin/products/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

/**
 * Interfaz para Producto, alineada con ProductoDTO del backend.
 */
interface Producto {
  id: number | string;
  nombre: string;
  descripcion?: string;
  categoria?: { id: number | string; titulo: string };
  imagenes?: { id: number | string; ruta: string }[];
}

/**
 * Componente que maneja la carga y renderizado de la tabla de productos.
 */
function ProductTable() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const session = await getSession();
        if (!session || session.user.role !== "admin") {
          router.push("/login");
          return;
        }
        const response = await axios.get<Producto[]>(`${backendUrl}/api/productos`);
        console.log("Productos cargados:", response.data);
        setProductos(response.data);
        setLoading(false);
      } catch (err: any) {
        const message = err.response?.data || "No se pudieron cargar los productos. Intenta de nuevo.";
        setError(message);
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };
    fetchProductos();
  }, [router, searchParams]);

  const handleDelete = async (id: number | string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${backendUrl}/api/productos/${id}`);
        setProductos(productos.filter((producto) => producto.id !== id));
        Swal.fire({
          title: "Eliminado",
          text: "Producto eliminado correctamente.",
          icon: "success",
          timer: 1500,
        });
      } catch (err: any) {
        const message = err.response?.data || "No se pudo eliminar el producto.";
        Swal.fire({
          title: "Error",
          text: message,
          icon: "error",
        });
        console.error("Error deleting product:", err);
      }
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <Link href="/admin" className="text-blue-500 hover:underline">
          Volver al Panel
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
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
              <td className="px-6 py-4 whitespace-nowrap">
                {producto.categoria ? producto.categoria.titulo : "Sin categoría"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  href={`/admin/products/edit/${producto.id}`}
                  className="text-blue-600 hover:text-blue-900 mr-4"
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
  );
}

/**
 * Componente principal para la página de gestión de productos.
 */
export default function ProductList() {
  return (
    <div className="min-h-screen p-8 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Productos</h1>
        <div className="flex space-x-4">
          <Link
            href="/admin/products/add"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Agregar Producto
          </Link>
          <Link href="/admin" className="text-gray-600 hover:text-gray-900 flex items-center">
            <svg
              className="h-6 w-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </Link>
        </div>
      </div>
      <Suspense fallback={<p>Cargando...</p>}>
        <ProductTable />
      </Suspense>
    </div>
  );
}