// src/app/admin/products/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

// Interfaz para la estructura de una categoría
interface Categoria {
  id: number;
  titulo: string;
}

// Interfaz para la estructura de un producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria?: { id: number; titulo: string };
}

/**
 * Componente para editar un producto existente en el panel de administración.
 * Permite modificar nombre, descripción, categoría e imágenes.
 */
export default function EditProduct() {
  // Estado para el nombre del producto
  const [nombre, setNombre] = useState("");
  // Estado para la descripción del producto
  const [descripcion, setDescripcion] = useState("");
  // Estado para el ID de la categoría seleccionada
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  // Estado para las nuevas imágenes subidas
  const [imagenes, setImagenes] = useState<File[]>([]);
  // Estado para la lista de categorías disponibles
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  // Estado para indicar si se está cargando
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);
  // Hook de enrutamiento de Next.js
  const router = useRouter();
  // Obtiene el ID del producto desde los parámetros de la URL
  const params = useParams();
  const id = params.id;
  // URL del backend desde variables de entorno
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  /**
   * Efecto para cargar los datos del producto y las categorías.
   * Redirige a /login si el usuario no es admin.
   * @returns {void}
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        if (!session || session.user.role !== "admin") {
          router.push("/login");
          return;
        }

        // Obtener producto
        const productoResponse = await axios.get<Producto>(`${backendUrl}/api/productos/${id}`);
        const producto = productoResponse.data;
        setNombre(producto.nombre);
        setDescripcion(producto.descripcion || "");
        setCategoriaId(producto.categoria ? producto.categoria.id : null);

        // Obtener categorías
        const categoriasResponse = await axios.get<Categoria[]>(`${backendUrl}/api/categorias`);
        setCategorias(categoriasResponse.data);

        setLoading(false);
      } catch (err: any) {
        setError("No se pudo cargar el producto o las categorías");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [id, router]);

  /**
   * Maneja el envío del formulario para actualizar el producto.
   * Valida categoriaId y envía los datos al backend.
   * @param {React.FormEvent} e - Evento del formulario
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoriaId !== null && !categorias.some((cat) => cat.id === categoriaId)) {
      Swal.fire({
        title: "Error",
        text: "La categoría seleccionada no es válida.",
        icon: "error",
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("producto", JSON.stringify({ nombre, descripcion }));
      imagenes.forEach((imagen) => formData.append("imagenes", imagen));
      if (categoriaId !== null) {
        formData.append("categoriaId", String(categoriaId));
      }

      await axios.put(`${backendUrl}/api/productos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await Swal.fire({
        title: "Éxito",
        text: "Producto actualizado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/admin/products");
    } catch (err: any) {
      const message = err.response?.data || "No se pudo actualizar el producto.";
      await Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
      });
      console.error("Error updating product:", err);
    }
  };

  /**
   * Maneja la selección de nuevas imágenes para el producto.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del input de archivo
   * @returns {void}
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files));
    }
  };

  // Renderiza el estado de carga
  if (loading) {
    return (
      <div className="min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-4">Editar Producto</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  // Renderiza el estado de error
  if (error) {
    return (
      <div className="min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-4">Editar Producto</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Renderiza el formulario de edición
  return (
    <div className="min-h-screen p-8 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Producto</h1>
        <Link href="/admin/products" className="text-gray-600 hover:text-gray-900 flex items-center">
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
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="categoria"
            value={categoriaId ?? ""}
            onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : null)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          >
            <option value="">Sin categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.titulo}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="imagenes" className="block text-sm font-medium text-gray-700">
            Nuevas Imágenes (opcional)
          </label>
          <input
            type="file"
            id="imagenes"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}