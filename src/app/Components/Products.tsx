// src/app/Components/Products.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

// Interfaz para definir la estructura de un producto
interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  imagenes: { id: number; ruta: string }[];
}

const Products = () => {
  // Estado para almacenar todos los productos obtenidos del backend
  const [products, setProducts] = useState<Product[]>([]);
  // Estado para almacenar los 10 productos aleatorios seleccionados
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  // Estado para indicar si los datos están cargando
  const [loading, setLoading] = useState(true);
  // Estado para almacenar cualquier error durante la carga de datos
  const [error, setError] = useState<string | null>(null);
  // Estado para controlar la imagen actual en el slider de cada producto
  const [currentSlides, setCurrentSlides] = useState<{ [key: number]: number }>({});
  // URL del backend, con un fallback si no está definida en .env
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  // Número de productos a mostrar (2 columnas x 5 filas = 10 productos)
  const productsToShow = 10;

  // Efecto para cargar los productos del backend al montar el componente
  useEffect(() => {
    // Función asíncrona para obtener los productos
    const fetchProducts = async () => {
      try {
        if (!backendUrl) {
          throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined in .env");
        }

        const response = await axios.get<Product[]>(`${backendUrl}/api/productos`, {
          headers: { "Content-Type": "application/json" },
        });

        console.log("Response from backend:", response.data);
        const data = Array.isArray(response.data) ? response.data : [];
        setProducts(data);

        // Seleccionar productos aleatorios sin repetición
        setRandomProducts(getRandomUniqueProducts(data, productsToShow));
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []); // Dependencias vacías para ejecutar solo al montar

  // Método para seleccionar un número específico de productos aleatorios sin repetición
  const getRandomUniqueProducts = (allProducts: Product[], count: number): Product[] => {
    // Si hay menos productos que el número solicitado, devolver todos
    if (allProducts.length <= count) return allProducts;

    const result: Product[] = [];
    const usedIndices = new Set<number>();

    // Seleccionar productos hasta alcanzar el número deseado
    while (result.length < count && usedIndices.size < allProducts.length) {
      const randomIndex = Math.floor(Math.random() * allProducts.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        result.push(allProducts[randomIndex]);
      }
    }

    return result;
  };

  // Método para retroceder en el slider de imágenes de un producto
  const prevSlide = (productId: number, totalImages: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [productId]: prev[productId] === 0 ? totalImages - 1 : (prev[productId] || 0) - 1,
    }));
  };

  // Método para avanzar en el slider de imágenes de un producto
  const nextSlide = (productId: number, totalImages: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) === totalImages - 1 ? 0 : (prev[productId] || 0) + 1,
    }));
  };

  // Método para ir directamente a una imagen específica en el slider
  const goToSlide = (productId: number, index: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [productId]: index,
    }));
  };

  // Mostrar estado de carga
  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  // Mostrar mensaje de error si ocurre
  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  // Verificar que randomProducts sea un arreglo
  if (!Array.isArray(randomProducts)) {
    return <div className="text-center py-16 text-red-500">Error: Products data is not an array</div>;
  }

  return (
    <div className="pt-1">
      <div className="mx-auto max-w-2xl px-1 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Título de la sección */}
        <h2 className="text-2xl font-bold mb-6">Productos</h2>

        {/* Cuadrícula de 2 columnas y 5 filas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
          {randomProducts.map((product) => {
            const currentSlide = currentSlides[product.id] || 0;
            const totalImages = product.imagenes?.length || 0;

            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="relative aspect-square w-full rounded-lg bg-gray-200 overflow-hidden">
                  {/* Imagen actual del producto o imagen por defecto */}
                  {product.imagenes && product.imagenes.length > 0 ? (
                    <Image
                      src={`${backendUrl}${product.imagenes[currentSlide].ruta}`}
                      alt={product.descripcion || "Producto sin descripción"}
                      fill
                      className="object-cover group-hover:opacity-75"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <Image
                      src="https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg"
                      alt="Imagen por defecto"
                      fill
                      className="object-cover group-hover:opacity-75"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  )}

                  {/* Controles del slider (solo si hay más de una imagen) */}
                  {totalImages > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Evita la navegación al hacer clic
                          prevSlide(product.id, totalImages);
                        }}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 focus:outline-none"
                      >
                        ❮
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          nextSlide(product.id, totalImages);
                        }}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 focus:outline-none"
                      >
                        ❯
                      </button>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                        {product.imagenes.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.preventDefault();
                              goToSlide(product.id, index);
                            }}
                            className={`w-2 h-2 rounded-full ${
                              index === currentSlide ? "bg-indigo-600" : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Nombre del producto */}
                <h3 className="mt-4 text-sm text-gray-700">{product.nombre}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;