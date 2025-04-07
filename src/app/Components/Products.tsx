// src/app/Components/Products.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  imagenes: { id: number; ruta: string }[];
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"; // Fallback por si no está en .env

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!backendUrl) {
          throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined in .env");
        }

        const response = await axios.get<Product[]>(`${backendUrl}/api/productos`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response from backend:", response.data);
        const data = Array.isArray(response.data) ? response.data : [];
        setProducts(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  if (!Array.isArray(currentProducts)) {
    return <div className="text-center py-16 text-red-500">Error: Products data is not an array</div>;
  }

  return (
    <div className="pt-1">
      <div className="mx-auto max-w-2xl px-1 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Productos</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {currentProducts.map((product) => (
            <a key={product.id} href="#" className="group">
              <img
                alt={product.descripcion || "Producto sin descripción"}
                src={
                  product.imagenes && product.imagenes.length > 0
                    ? `${backendUrl}${product.imagenes[0].ruta}` // Construir URL completa
                    : "https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg"
                }
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
              />
              <h3 className="mt-4 text-sm text-gray-700">{product.nombre}</h3>
            </a>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Anterior
            </button>
            <span className="py-2">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;