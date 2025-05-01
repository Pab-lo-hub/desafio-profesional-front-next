"use client";

// Importaciones de dependencias
import { useState, useEffect } from "react";

// Interfaz para la estructura de una categoría
interface Categoria {
  id: number;
  titulo: string;
  descripcion?: string;
  imagen?: string;
}

// Interfaz para las props del componente
interface CategoriasProps {
  onCategorySelect: (id: number) => void; // Función para manejar la selección de categoría
}

// Componente principal para mostrar categorías
export default function Categorias({ onCategorySelect }: CategoriasProps) {
  // Estados para categorías, carga y errores
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // URL del backend desde variables de entorno
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  // Imagen de respaldo para errores
  const fallbackImage = "https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg";

  // Efecto para cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/categorias`);
        if (!response.ok) {
          throw new Error("No se pudieron cargar las categorías");
        }
        const data = await response.json();
        console.log("Categorías desde la API:", data);
        setCategorias(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        console.error("Error al cargar categorías:", err);
      }
    };

    fetchCategorias();
  }, [backendUrl]);

  // Manejo de estados de carga y error
  if (loading) {
    return <div className="text-center py-16 bg-gradient-to-r from-indigo-50 to-blue-50">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500 bg-gradient-to-r from-indigo-50 to-blue-50">
        {error}
      </div>
    );
  }

  return (
    // Contenedor con fondo degradado
    <div className="pt-8 bg-gradient-to-r from-indigo-50 to-blue-50">
      {/* Contenedor responsivo */}
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
        {/* Título principal */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Categorías</h2>
        {/* Cuadrícula de categorías */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => onCategorySelect(categoria.id)}
              className="group text-left"
            >
              {/* Imagen de la categoría */}
              <img
                alt={categoria.descripcion || "Categoría sin descripción"}
                src={
                  categoria.imagen && categoria.imagen.startsWith("http")
                    ? categoria.imagen
                    : `${backendUrl}${categoria.imagen || ""}`
                }
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
              {/* Título de la categoría */}
              <h3 className="mt-4 text-lg font-semibold text-gray-800">{categoria.titulo}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}