"use client";

import { useState, useEffect } from "react";

export default function Categorias({ onCategorySelect }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const fallbackImage = "https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg";

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("/api/categorias");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        console.log("Categories from API:", data);
        setCategorias(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategorias();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  return (
    <div className="pt-1">
      <div className="mx-auto max-w-2xl px-1 py-1 sm:px-6 sm:py-1 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold underline text-[#7d858c]">Categorias</h1>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => onCategorySelect(categoria.id)}
              className="group text-left"
            >
              <img
                alt={categoria.descripcion || "Categoría sin descripción"}
                src={categoria.imagen && categoria.imagen.startsWith('http') ? categoria.imagen : `${backendUrl}${categoria.imagen}`}
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
              <h3 className="mt-4 text-sm text-gray-700">{categoria.titulo}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}