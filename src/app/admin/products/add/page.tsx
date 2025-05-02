"use client";

// Importaciones de dependencias y componentes
import { useState, useEffect } from "react"; // Hooks de React para estado y efectos
import axios from "axios"; // Cliente HTTP para solicitudes al backend
import { getSession } from "next-auth/react"; // Función para obtener la sesión del usuario
import { useRouter } from "next/navigation"; // Hook para navegación programática
import Link from "next/link"; // Componente de Next.js para enlaces
import { ArrowLeftIcon } from "@heroicons/react/24/outline"; // Icono de flecha para volver
import Swal from "sweetalert2"; // Librería para alertas personalizadas

// Interfaz para la estructura de una característica
interface Feature {
  id: number;
  nombre: string;
  icono: string;
}

// Interfaz para la estructura de una categoría
interface Categoria {
  id: number;
  titulo: string;
}

// Componente principal para la página de añadir producto
export default function AddProductPage() {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "", // Nombre del producto
    descripcion: "", // Descripción del producto
    categoriaId: "", // ID de la categoría seleccionada
  });
  // Estado para las características seleccionadas (IDs)
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  // Estado para las imágenes cargadas
  const [images, setImages] = useState<File[]>([]);
  // Estado para la lista de características disponibles
  const [features, setFeatures] = useState<Feature[]>([]);
  // Estado para la lista de categorías disponibles
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  // Estado para indicar si se está cargando
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);
  // Hook para navegación
  const router = useRouter();
  // URL del backend desde variables de entorno
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Efecto para cargar datos iniciales (características y categorías)
  useEffect(() => {
    // Función para obtener datos
    const fetchData = async () => {
      try {
        // Verifica si el usuario es admin
        const session = await getSession();
        if (!session || session.user.role !== "admin") {
          router.push("/login");
          return;
        }

        // Obtiene características y categorías en paralelo
        const [featuresResponse, categoriasResponse] = await Promise.all([
          axios.get<Feature[]>(`${backendUrl}/api/features`),
          axios.get<Categoria[]>(`${backendUrl}/api/categorias`),
        ]);

        // Actualiza los estados con los datos obtenidos
        setFeatures(featuresResponse.data);
        setCategorias(categoriasResponse.data);
        setLoading(false);
      } catch (err: any) {
        // Maneja errores
        setError(err.message || "No se pudo cargar la información");
        setLoading(false);
        console.error("Error al cargar datos:", err);
      }
    };

    fetchData();
  }, [router, backendUrl]);

  // Maneja el cambio de imágenes cargadas
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convierte la lista de archivos a un arreglo
      setImages(Array.from(e.target.files));
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Verifica si el usuario es admin
      const session = await getSession();
      if (!session || session.user.role !== "admin") {
        throw new Error("No tienes permisos para realizar esta acción");
      }

      // Prepara los datos para enviar al backend
      const formDataToSend = new FormData();
      formDataToSend.append(
        "producto",
        JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
        })
      );
      if (formData.categoriaId) {
        formDataToSend.append("categoriaId", formData.categoriaId);
      }
      images.forEach((image) => formDataToSend.append("imagenes", image));
      selectedFeatures.forEach((id) => formDataToSend.append("featureIds", id.toString()));

      // Envía la solicitud al backend
      await axios.post(`${backendUrl}/api/productos`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Muestra alerta de éxito
      Swal.fire({
        title: "Éxito",
        text: "Producto añadido correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirige a la página de administración
      router.push("/admin/products?refresh=true");
    } catch (err: any) {
      // Muestra alerta de error
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudo añadir el producto",
        icon: "error",
      });
      console.error("Error al añadir producto:", err);
    }
  };

  // Maneja la selección/deselección de características
  const handleFeatureToggle = (id: number) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Renderiza un mensaje de carga
  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="mx-auto max-w-7xl">
          {/* Título principal */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Añadir Producto</h1>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Renderiza un mensaje de error
  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="mx-auto max-w-7xl">
          {/* Título principal */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Añadir Producto</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Renderiza el formulario
  return (
    // Contenedor principal con fondo degradado
    <div className="min-h-screen p-8 bg-gradient-to-r from-indigo-50 to-blue-50">
      {/* Contenedor responsivo */}
      <div className="mx-auto max-w-4xl">
        {/* Encabezado con título y enlace para volver */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">Añadir Producto</h1>
          <Link
            href="/admin/products"
            className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver
          </Link>
        </div>
        {/* Tarjeta del formulario */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo para el nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                required
              />
            </div>
            {/* Campo para la descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                rows={4}
              />
            </div>
            {/* Campo para la categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Categoría</label>
              <select
                value={formData.categoriaId}
                onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              >
                <option value="">Sin categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.titulo}
                  </option>
                ))}
              </select>
            </div>
            {/* Campo para las imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Imágenes</label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full text-gray-900 file:bg-indigo-50 file:border-0 file:rounded-lg file:px-4 file:py-2 file:text-indigo-600 file:hover:bg-indigo-100"
              />
            </div>
            {/* Campo para las características */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Características</label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature) => (
                  <label key={feature.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={() => handleFeatureToggle(feature.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-900">{feature.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors"
              >
                Añadir Producto
              </button>
              <Link
                href="/admin/products"
                className="bg-gray-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}