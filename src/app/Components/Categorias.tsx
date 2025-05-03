"use client";

import { useState, useEffect } from "react";

interface Categoria {
  id: number;
  titulo: string;
  descripcion?: string;
  imagen?: string;
}

interface CategoriasProps {
  onCategorySelect: (ids: number[]) => void;
}

export default function Categorias({ onCategorySelect }: CategoriasProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const fallbackImage = "https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg";

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

  const handleCategoryClick = (id: number) => {
    let updatedSelection;
    if (selectedCategories.includes(id)) {
      updatedSelection = selectedCategories.filter((catId) => catId !== id);
    } else {
      updatedSelection = [...selectedCategories, id];
    }
    setSelectedCategories(updatedSelection);
    onCategorySelect(updatedSelection);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    onCategorySelect([]);
  };

  const removeCategory = (id: number) => {
    const updatedSelection = selectedCategories.filter((catId) => catId !== id);
    setSelectedCategories(updatedSelection);
    onCategorySelect(updatedSelection);
  };

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
    <div className="pt-8 bg-gradient-to-r from-indigo-50 to-blue-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Categorías</h2>
          {selectedCategories.length > 0 && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Limpiar filtros
            </button>
          )}
        </div>
        {selectedCategories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedCategories.map((id) => {
              const categoria = categorias.find((cat) => cat.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                >
                  {categoria?.titulo || "Categoría desconocida"}
                  <button
                    onClick={() => removeCategory(id)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        )}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => handleCategoryClick(categoria.id)}
              className={`group text-left rounded-xl overflow-hidden transition-shadow duration-300 ${
                selectedCategories.includes(categoria.id) ? "shadow-lg shadow-indigo-400/50" : "shadow-sm"
              } hover:shadow-xl hover:shadow-indigo-200/50`}
            >
              <img
                alt={categoria.descripcion || "Categoría sin descripción"}
                src={
                  categoria.imagen && categoria.imagen.startsWith("http")
                    ? categoria.imagen
                    : `${backendUrl}${categoria.imagen || ""}`
                }
                className="aspect-square w-full rounded-xl bg-gray-200 object-cover group-hover:opacity-75"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
              <h3 className="mt-4 p-2 text-lg font-semibold text-gray-800">{categoria.titulo}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}