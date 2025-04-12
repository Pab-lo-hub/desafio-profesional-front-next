// src/app/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Header from "../../Components/Header"; // Importa el componente Header
import Footer from "../../Components/Footer"; // Importa el componente Footer

// Interfaz que define la estructura de un producto
interface Product {
  id: number; // Identificador único del producto
  nombre: string; // Nombre del producto
  descripcion: string; // Descripción del producto
  imagenes: { id: number; ruta: string }[]; // Lista de imágenes asociadas
}

// Interfaz para los props del componente, que incluye los parámetros de la ruta
interface ProductPageProps {
  params: Promise<{ id: string }>; // params es un Promise en rutas dinámicas
}

// Componente para el slider de imágenes del producto
function ProductImageSlider({
  imagenes,
  backendUrl,
}: {
  imagenes: { id: number; ruta: string }[]; // Imágenes del producto
  backendUrl: string; // URL base del backend
}) {
  // Estado para controlar el índice de la imagen actual en el slider
  const [currentIndex, setCurrentIndex] = useState(0);

  // Retrocede a la imagen anterior en el slider
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  // Avanza a la siguiente imagen en el slider
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  // Cambia a una imagen específica en el slider
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Muestra un mensaje si no hay imágenes disponibles
  if (imagenes.length === 0) {
    return <p className="text-gray-500 text-center">No hay imágenes disponibles</p>;
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Contenedor para la imagen actual del slider */}
      <div className="relative h-96 overflow-hidden rounded-lg">
        <Image
          src={`${backendUrl}${imagenes[currentIndex].ruta}`}
          alt={`Imagen ${currentIndex + 1} de ${imagenes.length}`}
          fill
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Botones de navegación (solo si hay más de una imagen) */}
      {imagenes.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
          >
            ❯
          </button>
          {/* Indicadores de puntos para navegar entre imágenes */}
          <div className="flex justify-center mt-4 space-x-2">
            {imagenes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? "bg-indigo-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Componente principal para la página de detalles del producto
export default function ProductDetailPage({ params }: ProductPageProps) {
  // Estado para almacenar el producto obtenido del backend
  const [product, setProduct] = useState<Product | null>(null);
  // Estado para indicar si los datos están cargando
  const [loading, setLoading] = useState(true);
  // Estado para almacenar errores durante la carga
  const [error, setError] = useState<string | null>(null);
  // URL del backend, con un fallback si no está definida en .env
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Efecto para cargar los detalles del producto al montar el componente
  useEffect(() => {
    // Función asíncrona para obtener el producto
    const fetchProduct = async () => {
      try {
        // Resuelve el Promise de params para obtener el id
        const resolvedParams = await params;
        const id = resolvedParams.id;

        // Valida que el id sea un número
        if (!/^\d+$/.test(id)) {
          throw new Error("El ID del producto debe ser un número");
        }

        // Realiza la solicitud GET al endpoint del producto
        const response = await axios.get<Product>(`${backendUrl}/api/productos/${id}`, {
          headers: { "Content-Type": "application/json" },
        });

        // Almacena el producto en el estado
        setProduct(response.data);
        // Finaliza la carga
        setLoading(false);
      } catch (err: any) {
        // Almacena el mensaje de error
        setError(err.message || "No se pudo cargar el producto");
        // Finaliza la carga
        setLoading(false);
        // Loguea el error para depuración
        console.error("Error fetching product:", err);
      }
    };

    // Ejecuta la función de carga
    fetchProduct();
  }, [params]); // Dependencia en params para manejar cambios en la ruta

  // Muestra un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Componente Header compartido */}
        <Header className="z-50" />
        {/* Contenedor principal con espacio para evitar solapamiento */}
        <main className="flex-grow pt-36">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-center">
            Cargando...
          </div>
        </main>
        {/* Componente Footer compartido */}
        <Footer />
      </div>
    );
  }

  // Muestra un mensaje de error si falla la carga o no hay producto
  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Componente Header compartido */}
        <Header className="z-50" />
        {/* Contenedor principal con espacio para evitar solapamiento */}
        <main className="flex-grow pt-36">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-center text-red-500">
            {error || "Producto no encontrado"}
          </div>
        </main>
        {/* Componente Footer compartido */}
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Componente Header compartido, con z-index para asegurar visibilidad */}
      <Header className="z-50" />
      {/* Contenedor principal con espacio para evitar solapamiento con el header */}
      <main className="flex-grow pt-36">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              {/* Encabezado con título y botón de retroceso */}
              <div className="flex justify-between items-center mb-6">
                {/* Título del producto alineado a la izquierda */}
                <h1 className="text-3xl font-bold text-gray-900 text-left">{product.nombre}</h1>
                {/* Botón para volver atrás */}
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <ArrowLeftIcon className="h-6 w-6 mr-2" />
                  Volver
                </Link>
              </div>
              {/* Cuerpo con descripción y slider */}
              <div>
                {/* Descripción del producto */}
                <p className="text-gray-700 mb-6">{product.descripcion}</p>
                {/* Slider de imágenes del producto */}
                <ProductImageSlider imagenes={product.imagenes} backendUrl={backendUrl} />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Componente Footer compartido */}
      <Footer />
    </div>
  );
}