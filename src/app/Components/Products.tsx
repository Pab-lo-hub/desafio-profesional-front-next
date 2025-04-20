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
  price: string;
  categoria_id: number;
  imagenes: { id: number; ruta: string }[];
}

// Props del componente
interface ProductsProps {
  categoryId: number | null;
}

const Products = ({ categoryId }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlides, setCurrentSlides] = useState<{ [key: number]: number }>({});
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const productsToShow = 10;
  const fallbackImage = "https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!backendUrl) {
          throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined in .env");
        }

        const url = categoryId
          ? `${backendUrl}/api/productos?categoria_id=${categoryId}`
          : `${backendUrl}/api/productos`;

        const response = await axios.get<Product[]>(url, {
          headers: { "Content-Type": "application/json" },
        });

        console.log("Response from backend:", response.data);
        const data = Array.isArray(response.data) ? response.data : [];
        setProducts(data);
        setRandomProducts(getRandomUniqueProducts(data, productsToShow));
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const getRandomUniqueProducts = (allProducts: Product[], count: number): Product[] => {
    if (allProducts.length <= count) return allProducts;

    const result: Product[] = [];
    const usedIndices = new Set<number>();

    while (result.length < count && usedIndices.size < allProducts.length) {
      const randomIndex = Math.floor(Math.random() * allProducts.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        result.push(allProducts[randomIndex]);
      }
    }

    return result;
  };

  const prevSlide = (productId: number, totalImages: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [productId]: prev[productId] === 0 ? totalImages - 1 : (prev[productId] || 0) - 1,
    }));
  };

  const nextSlide = (productId: number, totalImages: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) === totalImages - 1 ? 0 : (prev[productId] || 0) + 1,
    }));
  };

  const goToSlide = (productId: number, index: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [productId]: index,
    }));
  };

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  if (!Array.isArray(randomProducts)) {
    return <div className="text-center py-16 text-red-500">Error: Products data is not an array</div>;
  }

  return (
    <div className="pt-1">
      <div className="mx-auto max-w-2xl px-1 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Productos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
          {randomProducts.map((product) => {
            const currentSlide = currentSlides[product.id] || 0;
            const totalImages = product.imagenes?.length || 0;
            const imageUrl = product.imagenes && product.imagenes.length > 0 && product.imagenes[currentSlide]?.ruta
              ? (product.imagenes[currentSlide].ruta.startsWith('http') 
                  ? product.imagenes[currentSlide].ruta 
                  : `${backendUrl}${product.imagenes[currentSlide].ruta}`)
              : fallbackImage;

            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="relative aspect-square w-full rounded-lg bg-gray-200 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={product.descripcion || "Producto sin descripción"}
                    fill
                    className="object-cover group-hover:opacity-75"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    onError={(e) => {
                      console.log(`Image failed to load: ${imageUrl}`);
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                  {totalImages > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
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
                <h3 className="mt-4 text-sm text-gray-700">{product.nombre}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{product.price || "Otra Prop de producto dinamica"}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;