// src/app/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

// Interfaz para un producto
interface Product {
  id: number; // Identificador único del producto
  nombre: string; // Nombre del producto
}

export default function ProductList() {
  // Estado para almacenar la lista de productos
  const [products, setProducts] = useState<Product[]>([]);
  // Estado para indicar si los datos están cargando
  const [loading, setLoading] = useState(true);
  // Estado para almacenar errores
  const [error, setError] = useState<string | null>(null);
  // Router para redirección
  const router = useRouter();
  // URL del backend
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Efecto para verificar la sesión y cargar productos
  useEffect(() => {
    const checkSessionAndFetchProducts = async () => {
      try {
        // Verifica la sesión en el cliente
        const session = await getSession();
        if (!session || session.user.role !== "admin") {
          router.push("/login");
          return;
        }

        // Obtiene la lista de productos
        const response = await axios.get<Product[]>(`${backendUrl}/api/productos`, {
          headers: { "Content-Type": "application/json" },
        });

        setProducts(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "No se pudo cargar la lista de productos");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };

    checkSessionAndFetchProducts();
  }, [router]);

  // Función para eliminar un producto
  const handleDelete = async (id: number, nombre: string) => {
    // Muestra un mensaje de confirmación con SweetAlert2
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar el producto "${nombre}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        // Realiza la solicitud DELETE al backend
        await axios.delete(`${backendUrl}/api/productos/${id}`, {
          headers: { "Content-Type": "application/json" },
        });

        // Actualiza la lista de productos
        setProducts(products.filter((product) => product.id !== id));

        // Muestra un mensaje de éxito
        await Swal.fire({
          title: "Eliminado",
          text: `El producto "${nombre}" ha sido eliminado.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err: any) {
        // Muestra un mensaje de error
        await Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el producto. Intenta de nuevo.",
          icon: "error",
        });
        console.error("Error deleting product:", err);
      }
    }
  };

  // Muestra un indicador de carga
  if (loading) {
    return (
      <div className="min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-4">Lista de Productos</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  // Muestra un mensaje de error si falla la carga
  if (error) {
    return (
      <div className="min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-4">Lista de Productos</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-black">
      {/* Título y botón para volver */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lista de Productos</h1>
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
          Volver al Panel
        </Link>
      </div>
      {/* Tabla de productos */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No hay productos disponibles.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(product.id, product.nombre)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}