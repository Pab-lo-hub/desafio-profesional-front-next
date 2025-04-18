// src/app/admin/products/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

interface Categoria {
  id: number | string;
  titulo: string;
}

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
 * Componente para editar un producto existente en el panel de administración.
 * Usa ProductoDTO para la comunicación con el backend.
 */
export default function EditProduct() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "[invalid url, do not cite]"

  /**
   * Efecto para cargar los datos del producto y las categorías.
   * Redirige a /login si el usuario no es admin.
   * Maneja el caso de categoría inválida al cargar el producto.
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
        console.log("Producto cargado:", producto);
        setNombre(producto.nombre);
        setDescripcion(producto.descripcion || "");
        let initialCategoriaId = producto.categoria ? String(producto.categoria.id) : null;

        // Obtener categorías
        const categoriasResponse = await axios.get<Categoria[]>(`${backendUrl}/api/categorias`);
        const normalizedCategorias = categoriasResponse.data.map((cat) => ({
          ...cat,
          id: String(cat.id), // Normaliza IDs a string
        }));
        setCategorias(normalizedCategorias);

        // Verificar si la categoría del producto es válida
        console.log("Initial categoriaId:", initialCategoriaId);
        console.log("Available categorias:", normalizedCategorias);
        if (initialCategoriaId !== null && !normalizedCategorias.some((cat) => cat.id === initialCategoriaId)) {
          initialCategoriaId = null;
          Swal.fire({
            title: "Advertencia",
            text: "La categoría actual del producto ya no está disponible. Por favor, seleccione una nueva categoría.",
            icon: "warning",
          });
        }
        setCategoriaId(initialCategoriaId);

        setLoading(false);
      } catch (err: any) {
        setError("No se pudo cargar el producto");
        setLoading(false);
        console.error("Error fetching product:", err);
      }
    };
    fetchData();
  }, [id, router]);

  /**
   * Maneja el envío del formulario para actualizar el producto.
   * Envía datos compatibles con ProductoDTO, incluyendo categoriaId en el cuerpo.
   * @param {React.FormEvent} e - Evento del formulario
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting with categoriaId:", categoriaId);
    console.log("Available categorias:", categorias);
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
      const productoData = {
        nombre,
        descripcion,
        categoriaId: categoriaId, // Envía null si no hay categoría seleccionada
      };
      formData.append(
        "producto",
        new Blob([JSON.stringify(productoData)], { type: "application/json" })
      );
      imagenes.forEach((imagen) => formData.append("imagenes", imagen));

      const url = categoriaId
        ? `${backendUrl}/api/productos/${id}?categoriaId=${categoriaId}`
        : `${backendUrl}/api/productos/${id}`;
      console.log("Sending PUT request to:", url);
      console.log("Producto data:", productoData);
      const response = await axios.put(url, formData);
      console.log("Backend response:", response.data);

      await Swal.fire({
        title: "Éxito",
        text: "Producto actualizado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      // Redirige con parámetro para forzar recarga
      router.push("/admin/products?refresh=true");
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

  if (loading) {
    return (
      <div className="min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-4">Editar Producto</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-4">Editar Producto</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
            onChange={(e) => setCategoriaId(e.target.value ? e.target.value : null)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            disabled={categorias.length === 0}
          >
            <option value="">Sin categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.titulo}
              </option>
            ))}
          </select>
          {categorias.length === 0 && (
            <p className="text-red-500 text-sm mt-1">No se pudieron cargar las categorías</p>
          )}
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